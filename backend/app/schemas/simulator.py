# FinShield What-If Scenario Simulator Schemas
# Pure hypothetical projections that never mutate stored transaction data

from decimal import Decimal
from typing import Optional, List
from pydantic import BaseModel, Field


class SimulationInput(BaseModel):
    additional_monthly_expense: Optional[Decimal] = Field(Decimal("0.00"), ge=0, description="Hypothetical new monthly cost")
    reduced_monthly_spending: Optional[Decimal] = Field(Decimal("0.00"), ge=0, description="Hypothetical spending cuts")
    increased_monthly_savings: Optional[Decimal] = Field(Decimal("0.00"), ge=0, description="Extra amount diverted to savings")
    one_time_large_purchase: Optional[Decimal] = Field(Decimal("0.00"), ge=0, description="Immediate one-time purchase amount")
    projection_months: int = Field(6, ge=1, le=60, description="Projection timeframe in months")


class SimulationResult(BaseModel):
    baseline_monthly_income: Decimal
    baseline_monthly_expenses: Decimal
    baseline_monthly_surplus: Decimal
    
    simulated_monthly_expenses: Decimal
    simulated_monthly_surplus: Decimal
    monthly_surplus_delta: Decimal
    
    projected_savings_after_timeline: Decimal
    baseline_savings_after_timeline: Decimal
    savings_impact_difference: Decimal
    
    warnings: List[str]
    insights: List[str]
    assumption_disclaimer: str = (
        "Notice: This simulation is an educational projection based solely on your provided parameters and past averages. "
        "It does not alter your actual transaction data or account balance."
    )
