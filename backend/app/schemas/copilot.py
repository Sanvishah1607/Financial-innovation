# FinShield AI Financial Copilot Schemas
# Context-grounded financial mentor backed by verified user data and NVIDIA AI

from typing import Optional, List, Dict, Any
from pydantic import BaseModel, Field


class CopilotQuestionRequest(BaseModel):
    question: str = Field(..., min_length=2, max_length=1000, description="User's financial query")
    context_month: Optional[str] = Field(None, description="Optional target month in YYYY-MM format")


class CopilotAnswerResponse(BaseModel):
    question: str
    answer: str
    grounded_metrics: Dict[str, Any]  # The real calculations and data supporting the answer
    suggested_followups: List[str]
    ai_provider: str  # 'NVIDIA NIM (Llama 3.2)' or 'FinShield Deterministic Engine'
    disclaimer: str = (
        "Educational Notice: Responses are generated based on your recorded transactions and educational heuristics. "
        "FinShield does not provide certified financial, legal, or investment advice."
    )
