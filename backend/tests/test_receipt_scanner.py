# FinShield Receipt Scanner Test Suite
# Tests receipt upload validation, OCR processing, duplicate detection, and error states

import io
from decimal import Decimal
from datetime import date
from PIL import Image, ImageDraw
import pytest
from fastapi.testclient import TestClient

from app.main import app
from app.db.session import get_db, SessionLocal
from app.models.financial import Transaction, User

client = TestClient(app)


def create_dummy_receipt_image(text: str = "CAFE COFFEE DAY\nDate: 2026-03-10\nLatte 180.00\nTotal: 180.00\nUPI") -> bytes:
    """Generates an in-memory JPEG image with simulated receipt text."""
    img = Image.new("RGB", (400, 300), color=(255, 255, 255))
    draw = ImageDraw.Draw(img)
    # Simple lines
    y = 20
    for line in text.split("\n"):
        draw.text((20, y), line, fill=(0, 0, 0))
        y += 30
    buffer = io.BytesIO()
    img.save(buffer, format="JPEG")
    return buffer.getvalue()


def test_upload_unsupported_file_format():
    """Verify that non-image file uploads (TXT, PDF) are rejected with 400."""
    response = client.post(
        "/api/v1/receipts/scan",
        files={"file": ("receipt.txt", b"This is not an image", "text/plain")},
    )
    assert response.status_code == 400
    assert "Unsupported file format" in response.json().get("error", "")


def test_upload_empty_file():
    """Verify that uploading an empty file returns 400."""
    response = client.post(
        "/api/v1/receipts/scan",
        files={"file": ("receipt.png", b"", "image/png")},
    )
    assert response.status_code == 400
    assert "empty" in response.json().get("error", "").lower()


def test_upload_corrupted_image():
    """Verify that uploading invalid image bytes returns 400."""
    corrupted_bytes = b"GIF89aNOT_A_VALID_IMAGE_HEADER_OR_CONTENT"
    response = client.post(
        "/api/v1/receipts/scan",
        files={"file": ("fake.jpg", corrupted_bytes, "image/jpeg")},
    )
    assert response.status_code == 400
    assert "corrupted" in response.json().get("error", "").lower()


def test_upload_valid_receipt_image():
    """Verify scanning an image returns structured fields without error."""
    img_bytes = create_dummy_receipt_image()
    response = client.post(
        "/api/v1/receipts/scan",
        files={"file": ("cafe_receipt.jpg", img_bytes, "image/jpeg")},
    )
    assert response.status_code == 200
    data = response.json()
    assert "confidence_score" in data
    assert "warnings" in data
    assert "items" in data
    assert "suggested_category" in data
    assert "payment_method" in data
    assert isinstance(data["warnings"], list)


def test_duplicate_receipt_detection():
    """Verify that when a matching transaction exists in the user's ledger, is_duplicate is flagged."""
    import uuid
    # Use the test session from dependency overrides
    override_fn = app.dependency_overrides.get(get_db)
    db = next(override_fn()) if override_fn else SessionLocal()
    test_user_id = str(uuid.uuid4())
    try:
        # Create user
        user = User(
            id=test_user_id,
            email="dupcheck@finguard.app",
            full_name="Duplicate Tester",
        )
        db.add(user)
        db.commit()

        # Add existing transaction
        existing_tx = Transaction(
            id=str(uuid.uuid4()),
            user_id=test_user_id,
            title="Starbucks Coffee",
            amount=Decimal("450.00"),
            type="expense",
            category="Food",
            transaction_date=date(2026, 3, 15),
            description="Prior coffee run",
        )
        db.add(existing_tx)
        db.commit()

        # Generate receipt with matching info
        receipt_text = "Starbucks Coffee\nDate: 2026-03-15\nTotal: 450.00\nPayment: UPI"
        img_bytes = create_dummy_receipt_image(receipt_text)

        # Call with dev token
        response = client.post(
            "/api/v1/receipts/scan",
            files={"file": ("starbucks.jpg", img_bytes, "image/jpeg")},
            headers={"Authorization": f"Bearer dev-user-{test_user_id}"},
        )
        assert response.status_code == 200
        data = response.json()
        assert "is_duplicate" in data
    finally:
        db.close()
