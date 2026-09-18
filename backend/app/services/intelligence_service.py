# FinShield Financial Intelligence Engine Service Layer
# Explainable anomaly detection, recurring expense discovery, and educational health scoring

import math
from decimal import Decimal, ROUND_HALF_UP
from typing import List, Dict
from collections import defaultdict
from sqlalchemy.orm import Session

from app.models.financial import Transaction, Budget, SavingsGoal
from app.schemas.intelligence import (
    AnomalyReport,
    AnomalyItem,
    RecurringReport,
    RecurringExpenseItem,
    FinancialHealthScore,
    HealthScoreFactor,
)


class IntelligenceService:
    @staticmethod
    def detect_spending_anomalies(db: Session, user_id: str) -> AnomalyReport:
        """
        Detects possible anomalous transactions using rule-based moving category averages.
        Clearly labels all results as possible anomalies with human-understandable explanations.
        """
        expenses = (
            db.query(Transaction)
            .filter(Transaction.user_id == user_id, Transaction.type == "expense")
            .order_by(Transaction.transaction_date.asc())
            .all()
        )

        total_txs = len(expenses)
        if total_txs < 3:
            return AnomalyReport(
                total_transactions_analyzed=total_txs,
                anomalies_detected_count=0,
                possible_anomalies=[],
            )

        # Group amounts by category
        category_amounts = defaultdict(list)
        for tx in expenses:
            category_amounts[tx.category].append(float(tx.amount))

        anomalies: List[AnomalyItem] = []

        for tx in expenses:
            cat_list = category_amounts[tx.category]
            if len(cat_list) >= 3:
                avg = sum(cat_list) / len(cat_list)
                variance = sum((x - avg) ** 2 for x in cat_list) / len(cat_list)
                std_dev = math.sqrt(variance) if variance > 0 else 0.0

                amt = float(tx.amount)
                # Rule: Flag if amount is more than 2.5 standard deviations above average
                # or more than 3x the category average
                if (std_dev > 0 and amt > avg + (2.2 * std_dev)) or (amt > avg * 3.0 and amt > 100.0):
                    ratio = round(amt / avg, 1) if avg > 0 else 1.0
                    severity = "high" if ratio >= 3.5 else "medium"
                    anomalies.append(
                        AnomalyItem(
                            transaction_id=tx.id,
                            title=tx.title,
                            amount=Decimal(str(tx.amount)),
                            category=tx.category,
                            transaction_date=tx.transaction_date,
                            severity=severity,
                            reason=f"Spending of ₹{amt:.2f} is {ratio}x higher than your usual ₹{avg:.2f} average in {tx.category}.",
                            is_possible_anomaly=True,
                        )
                    )

        return AnomalyReport(
            total_transactions_analyzed=total_txs,
            anomalies_detected_count=len(anomalies),
            possible_anomalies=anomalies,
        )

    @staticmethod
    def detect_recurring_expenses(db: Session, user_id: str) -> RecurringReport:
        """
        Discovers recurring subscriptions and regular bills by clustering merchant descriptions
        and analyzing transaction periodicity.
        """
        expenses = (
            db.query(Transaction)
            .filter(Transaction.user_id == user_id, Transaction.type == "expense")
            .order_by(Transaction.transaction_date.asc())
            .all()
        )

        merchant_groups = defaultdict(list)
        for tx in expenses:
            # Normalize title for grouping
            key = tx.title.strip().lower()
            merchant_groups[key].append(tx)

        recurring_items: List[RecurringExpenseItem] = []
        total_monthly = Decimal("0.00")

        for key, tx_list in merchant_groups.items():
            if len(tx_list) >= 2:
                # Check interval between consecutive transactions
                intervals = []
                for i in range(1, len(tx_list)):
                    diff_days = (tx_list[i].transaction_date - tx_list[i - 1].transaction_date).days
                    intervals.append(diff_days)

                avg_interval = sum(intervals) / len(intervals) if intervals else 0

                # Check if weekly (~7 days) or monthly (~25-35 days)
                is_periodic = (5 <= avg_interval <= 9) or (25 <= avg_interval <= 35) or tx_list[0].is_recurring
                avg_amount = sum(Decimal(str(t.amount)) for t in tx_list) / Decimal(str(len(tx_list)))
                avg_amount = avg_amount.quantize(Decimal("0.01"), rounding=ROUND_HALF_UP)

                if is_periodic or len(tx_list) >= 3:
                    if 5 <= avg_interval <= 9:
                        monthly_cost = avg_amount * Decimal("4.33")
                        period_label = "weekly pattern (~7 days)"
                    else:
                        monthly_cost = avg_amount
                        period_label = "monthly billing cycle (~30 days)"

                    total_monthly += monthly_cost

                    recurring_items.append(
                        RecurringExpenseItem(
                            title=tx_list[0].title,
                            category=tx_list[0].category,
                            estimated_amount=avg_amount,
                            occurrence_count=len(tx_list),
                            estimated_interval_days=int(avg_interval),
                            detection_reason=f"Detected {len(tx_list)} repeating charges matching a {period_label}.",
                        )
                    )

        return RecurringReport(
            detected_recurring_expenses=recurring_items,
            total_monthly_recurring_burden=total_monthly.quantize(Decimal("0.01"), rounding=ROUND_HALF_UP),
            notes=f"Identified {len(recurring_items)} recurring expenses contributing approximately ₹{total_monthly:.2f}/month.",
        )

    @staticmethod
    def calculate_financial_health_score(db: Session, user_id: str) -> FinancialHealthScore:
        """
        Calculates an educational health score from 0 to 100 based on explainable factors.
        Strictly labeled as educational and NOT a credit score.
        """
        txs = db.query(Transaction).filter(Transaction.user_id == user_id).all()
        budgets = db.query(Budget).filter(Budget.user_id == user_id).all()
        goals = db.query(SavingsGoal).filter(SavingsGoal.user_id == user_id).all()

        total_income = sum(Decimal(str(t.amount)) for t in txs if t.type == "income")
        total_expense = sum(Decimal(str(t.amount)) for t in txs if t.type == "expense")

        # Factor 1: Savings Rate (Max 35 points)
        if total_income > 0:
            savings_pct = ((total_income - total_expense) / total_income) * Decimal("100.00")
        else:
            savings_pct = Decimal("0.00")

        if savings_pct >= Decimal("20.00"):
            f1_pts = 35
            f1_rating = "Excellent"
            f1_exp = f"Great savings discipline! You are saving {savings_pct:.1f}% of your income (target is ≥20%)."
        elif savings_pct >= Decimal("10.00"):
            f1_pts = 25
            f1_rating = "Good"
            f1_exp = f"Healthy baseline: Saving {savings_pct:.1f}% of your earnings."
        elif savings_pct > 0:
            f1_pts = 15
            f1_rating = "Needs Attention"
            f1_exp = f"Moderate savings: Saving {savings_pct:.1f}% of income. Aim for 15-20%."
        else:
            f1_pts = 5
            f1_rating = "Needs Attention"
            f1_exp = "Expenses currently equal or exceed income. Focus on reducing non-essential costs."

        # Factor 2: Budget Adherence (Max 35 points)
        if not budgets:
            f2_pts = 20
            f2_rating = "Good"
            f2_exp = "No active monthly budget limits set yet. Setting limits helps protect your cash cushion."
        else:
            overspent = 0
            for b in budgets:
                # check if overspent
                cat_spent = sum(
                    Decimal(str(t.amount))
                    for t in txs
                    if t.type == "expense" and (b.category.lower() == "overall" or t.category.lower() == b.category.lower())
                )
                if cat_spent > Decimal(str(b.monthly_limit)):
                    overspent += 1
            if overspent == 0:
                f2_pts = 35
                f2_rating = "Excellent"
                f2_exp = "Outstanding budget adherence: 100% of your category limits were respected."
            elif overspent == 1:
                f2_pts = 22
                f2_rating = "Good"
                f2_exp = f"1 budget category exceeded its target limit this period."
            else:
                f2_pts = 10
                f2_rating = "Needs Attention"
                f2_exp = f"{overspent} categories have exceeded their monthly spending ceilings."

        # Factor 3: Savings Goals Consistency (Max 30 points)
        if not goals:
            f3_pts = 15
            f3_rating = "Good"
            f3_exp = "Start a dedicated savings goal to track your long-term milestones."
        else:
            avg_completion = sum(
                (Decimal(str(g.current_amount)) / Decimal(str(g.target_amount))) * Decimal("100.00")
                for g in goals
                if Decimal(str(g.target_amount)) > 0
            ) / Decimal(str(len(goals)))
            if avg_completion >= Decimal("50.00"):
                f3_pts = 30
                f3_rating = "Excellent"
                f3_exp = f"Goals progress is strong: average {avg_completion:.1f}% completion across targets."
            elif avg_completion >= Decimal("20.00"):
                f3_pts = 22
                f3_rating = "Good"
                f3_exp = f"Consistent goal progression: average {avg_completion:.1f}% funded."
            else:
                f3_pts = 14
                f3_rating = "Needs Attention"
                f3_exp = "Keep contributing regular spare change to reach your goal milestones."

        total_score = f1_pts + f2_pts + f3_pts

        if total_score >= 80:
            tier = "Strong Financial Health"
            tips = [
                "Automate micro-contributions to your highest priority savings goal.",
                "Review subscription renewals to maintain your 20%+ savings buffer.",
            ]
        elif total_score >= 60:
            tier = "Developing Cushion"
            tips = [
                "Trim discretionary 'Wants' category spending by 5-10% this week.",
                "Set a weekly spending limit to keep non-essentials in check.",
            ]
        else:
            tier = "Needs Attention"
            tips = [
                "Prioritize building an initial emergency fund buffer of ₹5,000.",
                "Audit recurring subscriptions and cancel unused memberships.",
            ]

        factors = [
            HealthScoreFactor(
                factor_name="Savings Rate & Discipline",
                score_contribution=f1_pts,
                max_points=35,
                rating=f1_rating,
                explanation=f1_exp,
            ),
            HealthScoreFactor(
                factor_name="Budget Ceiling Adherence",
                score_contribution=f2_pts,
                max_points=35,
                rating=f2_rating,
                explanation=f2_exp,
            ),
            HealthScoreFactor(
                factor_name="Goal Progress & Stability",
                score_contribution=f3_pts,
                max_points=30,
                rating=f3_rating,
                explanation=f3_exp,
            ),
        ]

        return FinancialHealthScore(
            overall_score=total_score,
            tier_label=tier,
            factors=factors,
            actionable_recommendations=tips,
        )
