# FinShield Financial Intelligence Engine Schemas
# Explainable anomaly detection, recurring expense patterns, and educational financial health scores

from decimal import Decimal
from datetime import date
from typing import List, Optional
from pydantic import BaseModel, Field


class AnomalyItem(BaseModel):
    transaction_id: str
    title: str
    amount: Decimal
    category: str
    transaction_date: date
    severity: str  # 'low', 'medium', 'high'
    reason: str
    is_possible_anomaly: bool = True  # Clearly labeled as a possible anomaly


class AnomalyReport(BaseModel):
    total_transactions_analyzed: int
    anomalies_detected_count: int
    possible_anomalies: List[AnomalyItem]
    methodology: str = "Rule-based statistical IQR and category moving-average deviation"
    disclaimer: str = "Notice: Flagged items are possible anomalies based on your historical habits, not definitive errors."


class RecurringExpenseItem(BaseModel):
    title: str
    category: str
    estimated_amount: Decimal
    occurrence_count: int
    estimated_interval_days: int
    detection_reason: str


class RecurringReport(BaseModel):
    detected_recurring_expenses: List[RecurringExpenseItem]
    total_monthly_recurring_burden: Decimal
    notes: str


class HealthScoreFactor(BaseModel):
    factor_name: str
    score_contribution: int  # Points earned
    max_points: int          # Maximum possible
    rating: str              # 'Excellent', 'Good', 'Needs Attention'
    explanation: str


class FinancialHealthScore(BaseModel):
    overall_score: int = Field(..., ge=0, le=100, description="Educational financial health score (0-100)")
    tier_label: str  # 'Strong Financial Health', 'Developing Cushion', 'Needs Attention'
    factors: List[HealthScoreFactor]
    actionable_recommendations: List[str]
    disclaimer: str = (
        "Educational Notice: This score is a personal finance metric based on savings consistency and "
        "budget adherence. It is NOT a credit score and does not guarantee financial outcomes."
    )
