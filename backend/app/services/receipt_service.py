# FinShield AI Receipt Scanner Service
# Multimodal vision OCR with NVIDIA NIM Llama 3.2 Vision and deterministic fallback

import io
import re
import json
import base64
import html
from decimal import Decimal, InvalidOperation
from typing import Optional, List, Dict, Any
from PIL import Image, UnidentifiedImageError
from fastapi import UploadFile, HTTPException, status
from sqlalchemy.orm import Session

from app.core.config import settings
from app.schemas.receipt import ReceiptScanResponse, ReceiptItem
from app.models.financial import Transaction
import httpx

MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024  # 5 MB
ALLOWED_CONTENT_TYPES = {
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp",
}
ALLOWED_EXTENSIONS = {".jpg", ".jpeg", ".png", ".webp"}

VALID_CATEGORIES = [
    "Food",
    "Transport",
    "Shopping",
    "Bills",
    "Education",
    "Entertainment",
    "Healthcare",
    "Other",
]

VALID_PAYMENT_METHODS = [
    "UPI",
    "Debit Card",
    "Credit Card",
    "Bank Transfer",
    "Cash",
]


def sanitize_text(val: Optional[str]) -> Optional[str]:
    """Sanitize strings to prevent XSS or script injection."""
    if not val:
        return None
    # Escape HTML special chars and strip tags
    clean = re.sub(r"<[^>]*>", "", str(val))
    return html.escape(clean.strip())


class ReceiptService:
    @staticmethod
    async def validate_and_read_image(file: UploadFile) -> bytes:
        """
        Validates file type, size, and image integrity.
        Files are kept strictly in memory for privacy and never saved to public storage.
        """
        # 1. Content-Type verification
        content_type = (file.content_type or "").lower().strip()
        filename = (file.filename or "").lower()
        has_valid_ext = any(filename.endswith(ext) for ext in ALLOWED_EXTENSIONS)

        if content_type not in ALLOWED_CONTENT_TYPES and not has_valid_ext:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Unsupported file format. Please upload a JPG, JPEG, or PNG image.",
            )

        # 2. Read bytes with size limit
        file_bytes = await file.read()
        if len(file_bytes) == 0:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="The uploaded file is empty. Please upload a valid receipt image.",
            )

        if len(file_bytes) > MAX_FILE_SIZE_BYTES:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"File exceeds maximum allowed size of 5 MB (received {len(file_bytes) / (1024 * 1024):.1f} MB).",
            )

        # 3. PIL Image integrity check
        try:
            with Image.open(io.BytesIO(file_bytes)) as img:
                img.verify()  # Verifies file format and header without decoding entire pixel raster
        except (UnidentifiedImageError, Exception):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="The uploaded file is corrupted or not a recognized image. Please try another file.",
            )

        return file_bytes

    @staticmethod
    def preprocess_image_for_vision(file_bytes: bytes) -> tuple[str, str]:
        """
        Opens, normalizes, and resizes image if needed to optimize OCR payload.
        Returns (base64_encoded_str, mime_type).
        """
        with Image.open(io.BytesIO(file_bytes)) as img:
            # Convert RGBA/P to RGB for JPEG compatibility
            if img.mode in ("RGBA", "P", "LA"):
                img = img.convert("RGB")

            # Downsample if dimensions are excessive (> 1600px on either side)
            max_dimension = 1600
            if img.width > max_dimension or img.height > max_dimension:
                img.thumbnail((max_dimension, max_dimension), Image.Resampling.LANCZOS)

            buffer = io.BytesIO()
            img.save(buffer, format="JPEG", quality=85, optimize=True)
            optimized_bytes = buffer.getvalue()
            b64_str = base64.b64encode(optimized_bytes).decode("utf-8")
            return b64_str, "image/jpeg"

    @classmethod
    async def scan_receipt(
        cls,
        file: UploadFile,
        db: Optional[Session] = None,
        user_id: Optional[str] = None,
    ) -> ReceiptScanResponse:
        """
        Performs end-to-end receipt scanning:
        1. Validates image in memory
        2. Dispatches to NVIDIA Llama 3.2 Vision NIM
        3. Parses structured receipt fields without hallucinations
        4. Detects potential duplicate transactions in user ledger
        """
        file_bytes = await cls.validate_and_read_image(file)
        b64_str, mime_type = cls.preprocess_image_for_vision(file_bytes)

        # 1. Attempt AI Vision OCR
        parsed_result: Optional[ReceiptScanResponse] = None
        if settings.NVIDIA_API_KEY and settings.NVIDIA_API_KEY.startswith("nvapi-"):
            try:
                parsed_result = cls._extract_with_nvidia_vision(b64_str, mime_type)
            except Exception as e:
                # Log and fallback gracefully
                print(f"[ReceiptService] NVIDIA NIM OCR error: {e}")
                parsed_result = None

        # 2. Fallback if AI was unavailable or could not process
        if not parsed_result:
            parsed_result = ReceiptScanResponse(
                merchant_name=None,
                transaction_date=None,
                total_amount=None,
                currency="INR",
                suggested_category="Shopping",
                payment_method="UPI",
                items=[],
                confidence_score=0.2,
                raw_text=None,
                warnings=[
                    "AI Vision OCR could not automatically extract details from this receipt. "
                    "Please review the image and fill in the required fields."
                ],
            )

        # 3. Check for duplicates in user's historical transactions
        if db is not None and user_id is not None and parsed_result.total_amount:
            cls._check_for_duplicates(db, user_id, parsed_result)

        return parsed_result

    @staticmethod
    def _extract_with_nvidia_vision(b64_str: str, mime_type: str) -> ReceiptScanResponse:
        """
        Queries NVIDIA Llama 3.2 Vision Instruct API with strict structured prompt.
        """
        system_prompt = (
            "You are an expert OCR receipt parsing engine for FinShield personal finance.\n"
            "Your task is to extract structured financial data from the receipt image.\n\n"
            "CRITICAL EXTRACTION RULES:\n"
            "1. DO NOT INVENT, GUESS, OR HALLUCINATE ANY VALUES. If any field is missing, blurry, "
            "or unreadable, return null for that field.\n"
            "2. 'merchant_name': Store or vendor name (string or null).\n"
            "3. 'transaction_date': Date in YYYY-MM-DD format (string or null). If ambiguous, use null.\n"
            "4. 'total_amount': The grand total paid as a numeric float/decimal or null (e.g. 450.50). "
            "Look for TOTAL, NET PAYABLE, GRAND TOTAL, AMOUNT PAID.\n"
            "5. 'currency': Currency symbol or code, default 'INR' for rupees (₹ / Rs / India), 'USD' for $, etc.\n"
            "6. 'suggested_category': ONE OF: Food, Transport, Shopping, Bills, Education, Entertainment, Healthcare, Other.\n"
            "7. 'payment_method': ONE OF: UPI, Debit Card, Credit Card, Bank Transfer, Cash (or null if not indicated).\n"
            "8. 'items': Array of objects with 'name' (string), 'quantity' (number), 'price' (number or null).\n"
            "9. 'confidence_score': Number from 0.0 to 1.0 reflecting how clear and complete the receipt is.\n"
            "10. 'warnings': Array of strings noting any issues, e.g. 'Total amount was unclear', 'Receipt date missing'.\n"
            "11. 'raw_text': Brief transcription of the key lines visible on the receipt.\n\n"
            "RESPOND EXCLUSIVELY WITH A VALID JSON OBJECT matching this schema. NO MARKDOWN, NO EXPLANATION."
        )

        headers = {
            "Authorization": f"Bearer {settings.NVIDIA_API_KEY}",
            "Content-Type": "application/json",
            "Accept": "application/json",
        }

        user_content = [
            {"type": "text", "text": "Extract all structured receipt fields from this receipt image. Follow all instructions strictly."},
            {
                "type": "image_url",
                "image_url": {
                    "url": f"data:{mime_type};base64,{b64_str}"
                },
            },
        ]

        payload = {
            "model": settings.NVIDIA_MODEL,
            "messages": [
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_content},
            ],
            "temperature": 0.1,
            "max_tokens": 1024,
        }

        with httpx.Client(timeout=25.0) as client:
            resp = client.post(
                f"{settings.NVIDIA_BASE_URL}/chat/completions",
                headers=headers,
                json=payload,
            )

        if resp.status_code != 200:
            raise RuntimeError(f"NVIDIA API status {resp.status_code}: {resp.text}")

        raw_content = resp.json()["choices"][0]["message"]["content"].strip()

        # Clean JSON markdown formatting if present
        clean_json = raw_content
        if clean_json.startswith("```"):
            clean_json = re.sub(r"^```(?:json)?\s*", "", clean_json)
            clean_json = re.sub(r"\s*```$", "", clean_json)

        data = json.loads(clean_json)

        # Parse and sanitize fields
        merchant = sanitize_text(data.get("merchant_name"))
        date_str = sanitize_text(data.get("transaction_date"))
        
        total_amt = None
        raw_amt = data.get("total_amount")
        if raw_amt is not None:
            try:
                # Remove currency symbols if string
                if isinstance(raw_amt, str):
                    raw_amt = re.sub(r"[^\d.]", "", raw_amt)
                total_amt = Decimal(str(raw_amt))
                if total_amt <= 0:
                    total_amt = None
            except (InvalidOperation, ValueError):
                total_amt = None

        currency = sanitize_text(data.get("currency")) or "INR"
        
        category = sanitize_text(data.get("suggested_category"))
        if category not in VALID_CATEGORIES:
            category = "Shopping"

        payment = sanitize_text(data.get("payment_method"))
        if payment not in VALID_PAYMENT_METHODS:
            payment = "UPI"

        # Item parsing
        raw_items = data.get("items") or []
        items: List[ReceiptItem] = []
        for it in raw_items:
            if isinstance(it, dict) and it.get("name"):
                name = sanitize_text(it.get("name"))
                qty = float(it.get("quantity") or 1.0)
                price = None
                if it.get("price") is not None:
                    try:
                        price = Decimal(str(it.get("price")))
                    except Exception:
                        price = None
                items.append(ReceiptItem(name=name or "Item", quantity=qty, price=price))

        conf = float(data.get("confidence_score", 0.8))
        conf = max(0.0, min(1.0, conf))

        warnings: List[str] = [sanitize_text(w) for w in (data.get("warnings") or []) if w]

        # Automatic checks for missing core fields
        if total_amt is None:
            warnings.append("Total amount was not detected. Please verify and enter the amount manually.")
            conf = min(conf, 0.4)
        if not merchant:
            warnings.append("Merchant name could not be identified. Please specify the store name.")
            conf = min(conf, 0.5)
        if not date_str:
            warnings.append("Transaction date could not be found. Defaulting to today.")
            conf = min(conf, 0.6)

        raw_text = sanitize_text(data.get("raw_text"))

        return ReceiptScanResponse(
            merchant_name=merchant,
            transaction_date=date_str,
            total_amount=total_amt,
            currency=currency,
            suggested_category=category,
            payment_method=payment,
            items=items,
            confidence_score=conf,
            raw_text=raw_text,
            warnings=warnings,
        )

    @staticmethod
    def _check_for_duplicates(db: Session, user_id: str, parsed: ReceiptScanResponse):
        """
        Queries historical transactions to flag potential duplicate receipts.
        """
        if not parsed.total_amount:
            return

        query = db.query(Transaction).filter(
            Transaction.user_id == user_id,
            Transaction.type == "expense",
        )

        if parsed.transaction_date:
            try:
                query = query.filter(Transaction.transaction_date == parsed.transaction_date)
            except Exception:
                pass

        matches = query.all()
        for tx in matches:
            # Check if amount matches within 0.01 tolerance
            if abs(tx.amount - parsed.total_amount) < Decimal("0.01"):
                # If merchant also matches closely
                if parsed.merchant_name and (
                    parsed.merchant_name.lower() in tx.title.lower()
                    or tx.title.lower() in parsed.merchant_name.lower()
                ):
                    parsed.is_duplicate = True
                    parsed.duplicate_warning = (
                        f"Potential duplicate: You already logged an expense of ₹{tx.amount:.2f} "
                        f"for '{tx.title}' on {tx.transaction_date}."
                    )
                    parsed.warnings.append(parsed.duplicate_warning)
                    break
