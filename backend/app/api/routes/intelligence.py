# FinShield Financial Intelligence Engine API Router
# Anomaly detection, recurring expense discovery, and educational health scoring

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.core.security import get_current_user_id
from app.services.intelligence_service import IntelligenceService
from app.schemas.intelligence import (
    AnomalyReport,
    RecurringReport,
    FinancialHealthScore,
)

router = APIRouter()


@router.get("/anomalies", response_model=AnomalyReport, summary="Detect spending anomalies")
def get_spending_anomalies(
    user_id: str = Depends(get_current_user_id),
    db: Session = Depends(get_db),
):
    """Audit user's historical transactions to flag possible unusual spending spikes."""
    return IntelligenceService.detect_spending_anomalies(db=db, user_id=user_id)


@router.get("/recurring", response_model=RecurringReport, summary="Detect recurring expenses")
def get_recurring_expenses(
    user_id: str = Depends(get_current_user_id),
    db: Session = Depends(get_db),
):
    """Identify periodic subscriptions and recurring merchant bills."""
    return IntelligenceService.detect_recurring_expenses(db=db, user_id=user_id)


@router.get("/health-score", response_model=FinancialHealthScore, summary="Calculate financial health score")
def get_financial_health_score(
    user_id: str = Depends(get_current_user_id),
    db: Session = Depends(get_db),
):
    """Compute an educational financial wellness score (0-100) with factor-level insights."""
    return IntelligenceService.calculate_financial_health_score(db=db, user_id=user_id)
