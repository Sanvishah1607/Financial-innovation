# FinShield Financial Analytics Schemas
# Provides high-precision financial health snapshots and aggregations

from decimal import Decimal
from typing import List, Dict
from pydantic import BaseModel, ConfigDict


class CategorySpendingOut(BaseModel):
    category: str
    total_amount: Decimal
    transaction_count: int
    percentage_of_total: Decimal


class MonthlyTrendOut(BaseModel):
    month_year: str
    total_income: Decimal
    total_expense: Decimal
    net_savings: Decimal
    savings_rate_pct: Decimal


class FinancialSummary(BaseModel):
    total_income: Decimal
    total_expense: Decimal
    net_balance: Decimal
    savings_rate_percentage: Decimal
    active_budget_count: int
    total_savings_in_goals: Decimal
    category_breakdown: List[CategorySpendingOut]
    recent_monthly_trends: List[MonthlyTrendOut]
