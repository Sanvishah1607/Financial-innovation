# FinShield Receipt Scanner Schemas
# Strictly typed Pydantic models for AI receipt parsing and user confirmation

from decimal import Decimal
from typing import List, Optional
from pydantic import BaseModel, Field


class ReceiptItem(BaseModel):
    name: str = Field(..., description="Line item name or description")
    quantity: Optional[float] = Field(default=1.0, description="Quantity purchased")
    price: Optional[Decimal] = Field(default=None, description="Item unit price or line total")


class ReceiptScanResponse(BaseModel):
    merchant_name: Optional[str] = Field(default=None, description="Extracted merchant or store name")
    transaction_date: Optional[str] = Field(default=None, description="Transaction date in YYYY-MM-DD format")
    total_amount: Optional[Decimal] = Field(default=None, description="Total amount paid")
    currency: Optional[str] = Field(default="INR", description="Currency symbol or 3-letter ISO code")
    suggested_category: Optional[str] = Field(default="Shopping", description="Category: Food, Transport, Shopping, Bills, etc.")
    payment_method: Optional[str] = Field(default="UPI", description="Detected payment method: UPI, Card, Cash, etc.")
    items: List[ReceiptItem] = Field(default_factory=list, description="Extracted itemized line items")
    confidence_score: float = Field(default=0.0, ge=0.0, le=1.0, description="Confidence score of OCR extraction (0-1)")
    raw_text: Optional[str] = Field(default=None, description="Raw OCR or extracted text from receipt")
    warnings: List[str] = Field(default_factory=list, description="Warnings or fields requiring manual user review")
    is_duplicate: bool = Field(default=False, description="Flag indicating potential duplicate transaction")
    duplicate_warning: Optional[str] = Field(default=None, description="Details if potential duplicate detected")
