# FinShield Budgets API Router
# Protected endpoints for monthly limits, spending comparison, and overspending indicators

from datetime import date
from typing import List
from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.core.security import get_current_user_id
from app.services.budget_service import BudgetService
from app.schemas.budget import BudgetCreate, BudgetStatus, BudgetOut

router = APIRouter()


@router.get("", response_model=List[BudgetStatus], summary="List monthly budget statuses")
def get_user_budget_statuses(
    month_year: str = Query(
        default_factory=lambda: date.today().strftime("%Y-%m"),
        description="Target month in YYYY-MM format",
    ),
    user_id: str = Depends(get_current_user_id),
    db: Session = Depends(get_db),
):
    """Fetch all category budgets with real-time spending comparisons and overspending flags."""
    return BudgetService.list_budget_statuses(db=db, user_id=user_id, month_year=month_year)


@router.post("", response_model=BudgetOut, status_code=status.HTTP_201_CREATED, summary="Set or update budget")
def set_monthly_budget(
    data: BudgetCreate,
    user_id: str = Depends(get_current_user_id),
    db: Session = Depends(get_db),
):
    """Set or update a monthly category budget limit."""
    return BudgetService.create_or_update_budget(db=db, user_id=user_id, data=data)


@router.delete("/{budget_id}", status_code=status.HTTP_204_NO_CONTENT, summary="Delete budget")
def delete_monthly_budget(
    budget_id: str,
    user_id: str = Depends(get_current_user_id),
    db: Session = Depends(get_db),
):
    """Remove a budget configuration."""
    BudgetService.delete_budget(db=db, user_id=user_id, budget_id=budget_id)
    return None
