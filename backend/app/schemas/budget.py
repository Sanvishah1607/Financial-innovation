# FinShield Budget Pydantic Schemas
# Tracks monthly limits, actual expenditures, and overspending indicators

import re
from decimal import Decimal
from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel, Field, ConfigDict, field_validator


class BudgetBase(BaseModel):
    category: str = Field(..., min_length=1, max_length=50, description="Category name (e.g. Needs, Wants, Overall)")
    month_year: str = Field(..., description="Month and Year in YYYY-MM format, e.g. 2026-09")
    monthly_limit: Decimal = Field(..., gt=0, max_digits=12, decimal_places=2, description="Target budget ceiling")

    @field_validator("month_year")
    @classmethod
    def validate_month_year(cls, v: str) -> str:
        if not re.match(r"^\d{4}-(0[1-9]|1[0-2])$", v):
            raise ValueError("month_year must be in 'YYYY-MM' format (e.g. '2026-09')")
        return v


class BudgetCreate(BudgetBase):
    pass


class BudgetUpdate(BaseModel):
    monthly_limit: Optional[Decimal] = Field(None, gt=0, max_digits=12, decimal_places=2)


class BudgetOut(BudgetBase):
    id: str
    user_id: str
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class BudgetStatus(BaseModel):
    id: str
    category: str
    month_year: str
    monthly_limit: Decimal
    actual_spent: Decimal
    remaining_budget: Decimal
    utilization_percentage: Decimal
    is_overspent: bool
    status_label: str  # 'Healthy', 'Warning (Near Limit)', 'Over Budget'
