# FinShield Savings Goals API Router
# Protected endpoints for financial targets, contributions, and completion pacing

from typing import List
from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.core.security import get_current_user_id
from app.services.savings_service import SavingsService
from app.schemas.savings import (
    SavingsGoalCreate,
    SavingsGoalOut,
    ContributionCreate,
)

router = APIRouter()


@router.get("", response_model=List[SavingsGoalOut], summary="List savings goals")
def list_user_savings_goals(
    user_id: str = Depends(get_current_user_id),
    db: Session = Depends(get_db),
):
    """Retrieve all savings targets with completion percentages and pacing recommendations."""
    return SavingsService.list_goals(db=db, user_id=user_id)


@router.post("", response_model=SavingsGoalOut, status_code=status.HTTP_201_CREATED, summary="Create savings goal")
def create_savings_target(
    data: SavingsGoalCreate,
    user_id: str = Depends(get_current_user_id),
    db: Session = Depends(get_db),
):
    """Set up a new savings milestone."""
    return SavingsService.create_goal(db=db, user_id=user_id, data=data)


@router.get("/{goal_id}", response_model=SavingsGoalOut, summary="Get savings goal")
def get_savings_goal_details(
    goal_id: str,
    user_id: str = Depends(get_current_user_id),
    db: Session = Depends(get_db),
):
    """Retrieve details and contribution history for a single savings goal."""
    goal = SavingsService.get_goal(db=db, user_id=user_id, goal_id=goal_id)
    return SavingsService.format_goal_out(goal)


@router.post("/{goal_id}/contributions", response_model=SavingsGoalOut, summary="Deposit into savings goal")
def add_contribution_to_goal(
    goal_id: str,
    data: ContributionCreate,
    user_id: str = Depends(get_current_user_id),
    db: Session = Depends(get_db),
):
    """Record a deposit or spare-change round-up contribution to a goal."""
    return SavingsService.add_contribution(db=db, user_id=user_id, goal_id=goal_id, data=data)


@router.delete("/{goal_id}", status_code=status.HTTP_204_NO_CONTENT, summary="Delete savings goal")
def delete_savings_goal(
    goal_id: str,
    user_id: str = Depends(get_current_user_id),
    db: Session = Depends(get_db),
):
    """Remove a savings target."""
    SavingsService.delete_goal(db=db, user_id=user_id, goal_id=goal_id)
    return None
