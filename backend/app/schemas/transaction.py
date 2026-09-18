# FinShield Transaction Pydantic Schemas
# Strictly utilizes Decimal for all monetary amounts to prevent floating-point inaccuracies

from decimal import Decimal
from datetime import date, datetime
from typing import Optional, List
from pydantic import BaseModel, Field, ConfigDict, field_validator


class TransactionBase(BaseModel):
    title: str = Field(..., min_length=1, max_length=120, description="Name or merchant of transaction")
    amount: Decimal = Field(..., gt=0, max_digits=12, decimal_places=2, description="Monetary amount in currency")
    type: str = Field("expense", description="Transaction type: 'income' or 'expense'")
    category: str = Field(..., min_length=1, max_length=50, description="Category: Needs, Wants, Savings, Income, etc.")
    transaction_date: date = Field(default_factory=date.today, description="Date of transaction")
    description: Optional[str] = Field(None, max_length=500, description="Optional notes or context")
    is_recurring: bool = Field(False, description="Whether this is a recurring subscription or salary")

    @field_validator("type")
    @classmethod
    def validate_type(cls, v: str) -> str:
        low = v.strip().lower()
        if low not in {"income", "expense"}:
            raise ValueError("Transaction type must be either 'income' or 'expense'")
        return low


class TransactionCreate(TransactionBase):
    pass


class TransactionUpdate(BaseModel):
    title: Optional[str] = Field(None, min_length=1, max_length=120)
    amount: Optional[Decimal] = Field(None, gt=0, max_digits=12, decimal_places=2)
    type: Optional[str] = None
    category: Optional[str] = Field(None, min_length=1, max_length=50)
    transaction_date: Optional[date] = None
    description: Optional[str] = Field(None, max_length=500)
    is_recurring: Optional[bool] = None

    @field_validator("type")
    @classmethod
    def validate_type(cls, v: Optional[str]) -> Optional[str]:
        if v is not None:
            low = v.strip().lower()
            if low not in {"income", "expense"}:
                raise ValueError("Transaction type must be either 'income' or 'expense'")
            return low
        return v


class TransactionOut(TransactionBase):
    id: str
    user_id: str
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class PaginatedTransactions(BaseModel):
    items: List[TransactionOut]
    total: int
    page: int
    page_size: int
    total_pages: int
