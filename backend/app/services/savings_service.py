# FinShield Savings Goals & Contributions Service Layer
# Calculates progress, remaining amounts, and monthly targets using exact Decimal math

from decimal import Decimal, ROUND_HALF_UP
from typing import List, Optional
from sqlalchemy.orm import Session
from fastapi import HTTPException, status

from app.models.financial import SavingsGoal, SavingsContribution
from app.schemas.savings import (
    SavingsGoalCreate,
    SavingsGoalUpdate,
    SavingsGoalOut,
    ContributionCreate,
    ContributionOut,
)


class SavingsService:
    @staticmethod
    def create_goal(db: Session, user_id: str, data: SavingsGoalCreate) -> SavingsGoalOut:
        """Create a new savings target and record initial deposit if provided."""
        initial_deposit = data.initial_deposit or Decimal("0.00")

        goal = SavingsGoal(
            user_id=user_id,
            goal_name=data.goal_name.strip(),
            target_amount=data.target_amount,
            current_amount=initial_deposit,
            target_months=data.target_months,
        )
        db.add(goal)
        db.flush()

        if initial_deposit > 0:
            contribution = SavingsContribution(
                goal_id=goal.id,
                user_id=user_id,
                amount=initial_deposit,
                note="Initial opening deposit",
            )
            db.add(contribution)

        db.commit()
        db.refresh(goal)
        return SavingsService.format_goal_out(goal)

    @staticmethod
    def get_goal(db: Session, user_id: str, goal_id: str) -> SavingsGoal:
        """Fetch savings goal with strict ownership verification."""
        goal = db.query(SavingsGoal).filter(
            SavingsGoal.id == goal_id,
            SavingsGoal.user_id == user_id,
        ).first()
        if not goal:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Savings goal not found or access unauthorized",
            )
        return goal

    @staticmethod
    def format_goal_out(goal: SavingsGoal) -> SavingsGoalOut:
        """Helper to compute completion %, remaining balance, and recommended monthly pace."""
        current = Decimal(str(goal.current_amount))
        target = Decimal(str(goal.target_amount))
        months = max(1, goal.target_months)

        remaining = max(Decimal("0.00"), target - current)
        
        if target > 0:
            completion = (current / target) * Decimal("100.00")
            completion = min(Decimal("100.00"), completion.quantize(Decimal("0.01"), rounding=ROUND_HALF_UP))
        else:
            completion = Decimal("100.00")

        monthly_needed = (remaining / Decimal(str(months))).quantize(Decimal("0.01"), rounding=ROUND_HALF_UP)

        contributions_out = [
            ContributionOut(
                id=c.id,
                goal_id=c.goal_id,
                user_id=c.user_id,
                amount=Decimal(str(c.amount)),
                note=c.note,
                created_at=c.created_at,
            )
            for c in goal.contributions
        ]

        return SavingsGoalOut(
            id=goal.id,
            user_id=goal.user_id,
            goal_name=goal.goal_name,
            target_amount=target,
            target_months=goal.target_months,
            current_amount=current,
            completion_percentage=completion,
            remaining_amount=remaining,
            monthly_recommended_saving=monthly_needed,
            created_at=goal.created_at,
            contributions=contributions_out,
        )

    @staticmethod
    def list_goals(db: Session, user_id: str) -> List[SavingsGoalOut]:
        """List all savings goals for the user with calculated metrics."""
        goals = db.query(SavingsGoal).filter(SavingsGoal.user_id == user_id).all()
        return [SavingsService.format_goal_out(g) for g in goals]

    @staticmethod
    def add_contribution(
        db: Session, user_id: str, goal_id: str, data: ContributionCreate
    ) -> SavingsGoalOut:
        """Add funds to a savings goal and record a contribution entry."""
        goal = SavingsService.get_goal(db, user_id, goal_id)

        contribution = SavingsContribution(
            goal_id=goal.id,
            user_id=user_id,
            amount=data.amount,
            note=data.note.strip() if data.note else None,
        )
        db.add(contribution)

        # Update running balance
        goal.current_amount = Decimal(str(goal.current_amount)) + data.amount
        db.commit()
        db.refresh(goal)
        return SavingsService.format_goal_out(goal)

    @staticmethod
    def delete_goal(db: Session, user_id: str, goal_id: str) -> None:
        """Delete a savings goal and all associated contributions."""
        goal = SavingsService.get_goal(db, user_id, goal_id)
        db.delete(goal)
        db.commit()
