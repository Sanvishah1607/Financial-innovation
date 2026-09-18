# FinShield Financial What-If Simulator API Router
# Pure hypothetical projections that never alter stored transaction data

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.core.security import get_current_user_id
from app.services.simulator_service import SimulatorService
from app.schemas.simulator import SimulationInput, SimulationResult

router = APIRouter()


@router.post("/simulate", response_model=SimulationResult, summary="Run what-if scenario simulation")
def run_financial_scenario_simulation(
    data: SimulationInput,
    user_id: str = Depends(get_current_user_id),
    db: Session = Depends(get_db),
):
    """
    Simulate financial outcomes based on hypothetical spending adjustments, 
    large purchases, or subscription changes without altering your actual data.
    """
    return SimulatorService.run_simulation(db=db, user_id=user_id, inputs=data)
