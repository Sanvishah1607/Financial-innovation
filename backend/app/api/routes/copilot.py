# FinShield AI Financial Copilot API Router
# Context-grounded mentor synthesizing user data and NVIDIA AI

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.core.security import get_current_user_id
from app.services.copilot_service import CopilotService
from app.schemas.copilot import CopilotQuestionRequest, CopilotAnswerResponse

router = APIRouter()


@router.post("/ask", response_model=CopilotAnswerResponse, summary="Ask financial copilot")
def ask_financial_copilot(
    request: CopilotQuestionRequest,
    user_id: str = Depends(get_current_user_id),
    db: Session = Depends(get_db),
):
    """
    Get grounded financial answers backed strictly by your logged transactions
    and synthesized with NVIDIA AI.
    """
    return CopilotService.answer_question(db=db, user_id=user_id, request=request)
