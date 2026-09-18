# FinShield Financial Analytics Service Layer
# Aggregates income, expense, category distribution, and monthly trends using high-precision Decimal

from decimal import Decimal, ROUND_HALF_UP
from typing import List, Dict
from sqlalchemy.orm import Session
from sqlalchemy import func, extract
from collections import defaultdict
from datetime import date, timedelta

from app.models.financial import Transaction, Budget, SavingsGoal
from app.schemas.analytics import FinancialSummary, CategorySpendingOut, MonthlyTrendOut


class AnalyticsService:
    @staticmethod
    def get_financial_summary(db: Session, user_id: str) -> FinancialSummary:
        """Computes high-level financial health overview and metrics."""
        # 1. Total Income & Total Expenses
        income_val = db.query(func.coalesce(func.sum(Transaction.amount), Decimal("0.00"))).filter(
            Transaction.user_id == user_id,
            Transaction.type == "income",
        ).scalar()
        total_income = Decimal(str(income_val or "0.00"))

        expense_val = db.query(func.coalesce(func.sum(Transaction.amount), Decimal("0.00"))).filter(
            Transaction.user_id == user_id,
            Transaction.type == "expense",
        ).scalar()
        total_expense = Decimal(str(expense_val or "0.00"))

        net_balance = total_income - total_expense

        if total_income > 0:
            savings_rate = ((total_income - total_expense) / total_income) * Decimal("100.00")
            savings_rate = savings_rate.quantize(Decimal("0.01"), rounding=ROUND_HALF_UP)
        else:
            savings_rate = Decimal("0.00")

        # 2. Category Spending Breakdown
        cat_rows = (
            db.query(
                Transaction.category,
                func.sum(Transaction.amount).label("total"),
                func.count(Transaction.id).label("cnt"),
            )
            .filter(Transaction.user_id == user_id, Transaction.type == "expense")
            .group_by(Transaction.category)
            .all()
        )

        categories_out = []
        for cat, amt, cnt in cat_rows:
            amt_dec = Decimal(str(amt or "0.00"))
            pct = (amt_dec / total_expense * Decimal("100.00")) if total_expense > 0 else Decimal("0.00")
            categories_out.append(
                CategorySpendingOut(
                    category=cat,
                    total_amount=amt_dec,
                    transaction_count=cnt,
                    percentage_of_total=pct.quantize(Decimal("0.01"), rounding=ROUND_HALF_UP),
                )
            )

        # 3. Monthly Trends (past 6 calendar months)
        all_txs = db.query(Transaction).filter(Transaction.user_id == user_id).all()
        month_map: Dict[str, Dict[str, Decimal]] = defaultdict(lambda: {"income": Decimal("0.00"), "expense": Decimal("0.00")})

        for tx in all_txs:
            m_key = tx.transaction_date.strftime("%Y-%m")
            amt = Decimal(str(tx.amount))
            if tx.type == "income":
                month_map[m_key]["income"] += amt
            else:
                month_map[m_key]["expense"] += amt

        trends_out = []
        for m_key in sorted(month_map.keys(), reverse=True)[:6]:
            inc = month_map[m_key]["income"]
            exp = month_map[m_key]["expense"]
            diff = inc - exp
            rate = ((diff / inc) * Decimal("100.00")) if inc > 0 else Decimal("0.00")
            trends_out.append(
                MonthlyTrendOut(
                    month_year=m_key,
                    total_income=inc,
                    total_expense=exp,
                    net_savings=diff,
                    savings_rate_pct=rate.quantize(Decimal("0.01"), rounding=ROUND_HALF_UP),
                )
            )

        # 4. Budget & Goal Counts
        active_budgets = db.query(Budget).filter(Budget.user_id == user_id).count()
        
        vault_val = db.query(func.coalesce(func.sum(SavingsGoal.current_amount), Decimal("0.00"))).filter(
            SavingsGoal.user_id == user_id
        ).scalar()
        total_savings = Decimal(str(vault_val or "0.00"))

        return FinancialSummary(
            total_income=total_income,
            total_expense=total_expense,
            net_balance=net_balance,
            savings_rate_percentage=savings_rate,
            active_budget_count=active_budgets,
            total_savings_in_goals=total_savings,
            category_breakdown=categories_out,
            recent_monthly_trends=trends_out,
        )
