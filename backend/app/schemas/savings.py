# FinShield Savings Goals & Contributions Pydantic Schemas
# Accurately computes progress percentage and remaining targets

from decimal import Decimal
from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel, Field, ConfigDict


class ContributionCreate(BaseModel):
    amount: Decimal = Field(..., gt=0, max_digits=12, decimal_places=2, description="Deposit amount")
    note: Optional[str] = Field(None, max_length=255, description="Optional note (e.g. Spare change round-up)")


class ContributionOut(BaseModel):
    id: str
    goal_id: str
    user_id: str
    amount: Decimal
    note: Optional[str]
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class SavingsGoalBase(BaseModel):
    goal_name: str = Field(..., min_length=1, max_length=120, description="Name of savings target")
    target_amount: Decimal = Field(..., gt=0, max_digits=12, decimal_places=2, description="Target amount to save")
    target_months: int = Field(12, gt=0, le=360, description="Target timeline in months")


class SavingsGoalCreate(SavingsGoalBase):
    initial_deposit: Optional[Decimal] = Field(Decimal("0.00"), ge=0, max_digits=12, decimal_places=2)


class SavingsGoalUpdate(BaseModel):
    goal_name: Optional[str] = Field(None, min_length=1, max_length=120)
    target_amount: Optional[Decimal] = Field(None, gt=0, max_digits=12, decimal_places=2)
    target_months: Optional[int] = Field(None, gt=0, le=360)


class SavingsGoalOut(SavingsGoalBase):
    id: str
    user_id: str
    current_amount: Decimal
    completion_percentage: Decimal
    remaining_amount: Decimal
    monthly_recommended_saving: Decimal
    created_at: datetime
    contributions: Optional[List[ContributionOut]] = []

    model_config = ConfigDict(from_attributes=True)
