# FinShield Financial Analytics API Router
# High-precision Decimal summaries, category distributions, and monthly trends

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.core.security import get_current_user_id
from app.services.analytics_service import AnalyticsService
from app.schemas.analytics import FinancialSummary

router = APIRouter()


@router.get("/summary", response_model=FinancialSummary, summary="Get full financial summary")
def get_user_financial_summary(
    user_id: str = Depends(get_current_user_id),
    db: Session = Depends(get_db),
):
    """Retrieve comprehensive financial snapshot including totals, savings rate, category breakdown, and trends."""
    return AnalyticsService.get_financial_summary(db=db, user_id=user_id)
