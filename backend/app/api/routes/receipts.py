# FinShield AI Receipt Scanner Route
# OCR scanning endpoint with user-scoped duplicate detection and privacy protection

from typing import Optional
from fastapi import APIRouter, Depends, UploadFile, File, status, HTTPException
from fastapi.security import HTTPAuthorizationCredentials
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.core.security import security, verify_supabase_token
from app.services.receipt_service import ReceiptService
from app.schemas.receipt import ReceiptScanResponse

router = APIRouter()


def get_optional_user_id(
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(security),
) -> Optional[str]:
    """Extracts user ID if Bearer token is provided, without blocking unauthenticated requests."""
    if not credentials or not credentials.credentials:
        return None
    try:
        user_info = verify_supabase_token(credentials.credentials)
        return str(user_info.get("id"))
    except Exception:
        return None


@router.post(
    "/scan",
    response_model=ReceiptScanResponse,
    status_code=status.HTTP_200_OK,
    summary="Scan physical or digital receipt via AI Vision",
)
async def scan_receipt_image(
    file: UploadFile = File(..., description="Receipt image file (JPG, JPEG, PNG, max 5MB)"),
    user_id: Optional[str] = Depends(get_optional_user_id),
    db: Session = Depends(get_db),
):
    """
    Accepts an uploaded receipt image, performs OCR via NVIDIA Multimodal Vision,
    and extracts structured details:
    - Merchant Name
    - Transaction Date
    - Total Amount
    - Currency
    - Category & Payment Method
    - Line Items
    - Duplicate detection against logged transactions
    
    Files are processed in memory and never exposed publicly.
    """
    return await ReceiptService.scan_receipt(file=file, db=db, user_id=user_id)
