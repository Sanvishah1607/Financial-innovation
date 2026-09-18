# FinShield What-If Scenario Simulator Service
# Runs purely hypothetical cash-flow simulations without modifying stored user records

from decimal import Decimal, ROUND_HALF_UP
from typing import List
from sqlalchemy.orm import Session
from sqlalchemy import func

from app.models.financial import Transaction, User
from app.schemas.simulator import SimulationInput, SimulationResult


class SimulatorService:
    @staticmethod
    def run_simulation(db: Session, user_id: str, inputs: SimulationInput) -> SimulationResult:
        """
        Simulates financial impacts of income adjustments, new subscriptions, or spending cuts.
        Guarantees that database records are never altered.
        """
        user = db.query(User).filter(User.id == user_id).first()
        monthly_income = Decimal(str(user.monthly_income)) if user and user.monthly_income else Decimal("35000.00")

        # Compute average monthly expense from past transactions
        total_expense_val = db.query(func.coalesce(func.sum(Transaction.amount), Decimal("0.00"))).filter(
            Transaction.user_id == user_id,
            Transaction.type == "expense",
        ).scalar()
        total_expense = Decimal(str(total_expense_val or "0.00"))

        # Baseline monthly expense estimate (default to 65% of income if no transactions logged yet)
        if total_expense > 0:
            # Look at span of months
            baseline_monthly_expense = total_expense  # simplified monthly baseline
            if baseline_monthly_expense > monthly_income * Decimal("2.0"):
                baseline_monthly_expense = monthly_income * Decimal("0.65")
        else:
            baseline_monthly_expense = monthly_income * Decimal("0.65")

        baseline_surplus = monthly_income - baseline_monthly_expense

        # Simulated modifications
        add_exp = inputs.additional_monthly_expense or Decimal("0.00")
        cut_exp = inputs.reduced_monthly_spending or Decimal("0.00")
        extra_savings = inputs.increased_monthly_savings or Decimal("0.00")
        large_purchase = inputs.one_time_large_purchase or Decimal("0.00")
        months = Decimal(str(inputs.projection_months))

        simulated_monthly_expense = max(Decimal("0.00"), baseline_monthly_expense + add_exp - cut_exp)
        simulated_surplus = monthly_income - simulated_monthly_expense - extra_savings
        monthly_delta = simulated_surplus - baseline_surplus

        baseline_savings_timeline = (baseline_surplus * months).quantize(Decimal("0.01"), rounding=ROUND_HALF_UP)
        projected_savings_timeline = ((simulated_surplus + extra_savings) * months - large_purchase).quantize(
            Decimal("0.01"), rounding=ROUND_HALF_UP
        )
        savings_impact = projected_savings_timeline - baseline_savings_timeline

        warnings: List[str] = []
        insights: List[str] = []

        if simulated_surplus < Decimal("0.00"):
            warnings.append(
                f"Warning: Under this scenario, your monthly costs exceed income by ₹{abs(simulated_surplus):.2f}/month."
            )
        if large_purchase > monthly_income:
            warnings.append(
                f"Warning: The one-time purchase of ₹{large_purchase:.2f} exceeds a full month of income (₹{monthly_income:.2f})."
            )

        if savings_impact > Decimal("0.00"):
            insights.append(
                f"Net Positive: This adjustment adds an estimated ₹{savings_impact:.2f} to your savings reserve over {inputs.projection_months} months."
            )
        elif savings_impact < Decimal("0.00"):
            insights.append(
                f"Trade-Off: This scenario reduces your cumulative savings growth by ₹{abs(savings_impact):.2f} across {inputs.projection_months} months."
            )
        else:
            insights.append("Neutral: Projected savings growth remains consistent with your current baseline.")

        return SimulationResult(
            baseline_monthly_income=monthly_income.quantize(Decimal("0.01"), rounding=ROUND_HALF_UP),
            baseline_monthly_expenses=baseline_monthly_expense.quantize(Decimal("0.01"), rounding=ROUND_HALF_UP),
            baseline_monthly_surplus=baseline_surplus.quantize(Decimal("0.01"), rounding=ROUND_HALF_UP),
            simulated_monthly_expenses=simulated_monthly_expense.quantize(Decimal("0.01"), rounding=ROUND_HALF_UP),
            simulated_monthly_surplus=simulated_surplus.quantize(Decimal("0.01"), rounding=ROUND_HALF_UP),
            monthly_surplus_delta=monthly_delta.quantize(Decimal("0.01"), rounding=ROUND_HALF_UP),
            projected_savings_after_timeline=projected_savings_timeline,
            baseline_savings_after_timeline=baseline_savings_timeline,
            savings_impact_difference=savings_impact,
            warnings=warnings,
            insights=insights,
        )
