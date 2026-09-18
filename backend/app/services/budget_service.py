# FinShield Budget Service Layer
# Calculates actual category expenditures against monthly limits using high-precision Decimal

from decimal import Decimal, ROUND_HALF_UP
from typing import List, Optional
from sqlalchemy.orm import Session
from sqlalchemy import func, extract
from fastapi import HTTPException, status

from app.models.financial import Budget, Transaction
from app.schemas.budget import BudgetCreate, BudgetUpdate, BudgetStatus


class BudgetService:
    @staticmethod
    def create_or_update_budget(db: Session, user_id: str, data: BudgetCreate) -> Budget:
        """Create a new monthly budget limit or update if existing for that month/category."""
        cat_clean = data.category.strip()
        month_clean = data.month_year.strip()

        existing = db.query(Budget).filter(
            Budget.user_id == user_id,
            Budget.month_year == month_clean,
            func.lower(Budget.category) == cat_clean.lower(),
        ).first()

        if existing:
            existing.monthly_limit = data.monthly_limit
            db.commit()
            db.refresh(existing)
            return existing

        budget = Budget(
            user_id=user_id,
            category=cat_clean,
            month_year=month_clean,
            monthly_limit=data.monthly_limit,
        )
        db.add(budget)
        db.commit()
        db.refresh(budget)
        return budget

    @staticmethod
    def get_budget_status(db: Session, user_id: str, budget: Budget) -> BudgetStatus:
        """Calculates actual spending, remaining funds, and overspending indicators."""
        # Parse year and month from 'YYYY-MM'
        year, month = map(int, budget.month_year.split("-"))

        # Base query for user expenses in that calendar month
        tx_query = db.query(func.coalesce(func.sum(Transaction.amount), Decimal("0.00"))).filter(
            Transaction.user_id == user_id,
            Transaction.type == "expense",
            extract("year", Transaction.transaction_date) == year,
            extract("month", Transaction.transaction_date) == month,
        )

        if budget.category.lower() != "overall":
            tx_query = tx_query.filter(
                func.lower(Transaction.category) == budget.category.lower()
            )

        actual_spent = Decimal(str(tx_query.scalar() or "0.00"))
        monthly_limit = Decimal(str(budget.monthly_limit))
        remaining = monthly_limit - actual_spent

        if monthly_limit > 0:
            utilization = (actual_spent / monthly_limit) * Decimal("100.00")
            utilization = utilization.quantize(Decimal("0.01"), rounding=ROUND_HALF_UP)
        else:
            utilization = Decimal("0.00")

        is_overspent = actual_spent > monthly_limit

        if is_overspent:
            status_label = "Over Budget"
        elif utilization >= Decimal("80.00"):
            status_label = "Warning (Near Limit)"
        else:
            status_label = "Healthy"

        return BudgetStatus(
            id=budget.id,
            category=budget.category,
            month_year=budget.month_year,
            monthly_limit=monthly_limit,
            actual_spent=actual_spent,
            remaining_budget=remaining,
            utilization_percentage=utilization,
            is_overspent=is_overspent,
            status_label=status_label,
        )

    @staticmethod
    def list_budget_statuses(db: Session, user_id: str, month_year: str) -> List[BudgetStatus]:
        """Fetch all category budget statuses for a specific user and month."""
        budgets = db.query(Budget).filter(
            Budget.user_id == user_id,
            Budget.month_year == month_year.strip(),
        ).all()
        return [BudgetService.get_budget_status(db, user_id, b) for b in budgets]

    @staticmethod
    def delete_budget(db: Session, user_id: str, budget_id: str) -> None:
        """Remove a budget configuration."""
        b = db.query(Budget).filter(
            Budget.id == budget_id,
            Budget.user_id == user_id,
        ).first()
        if not b:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Budget not found",
            )
        db.delete(b)
        db.commit()
