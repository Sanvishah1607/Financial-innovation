# FinShield Digital Scam Awareness & Risk Assessment Schemas
# Strictly educational text safety analyzer

from typing import List, Optional
from pydantic import BaseModel, Field


class ScamScanRequest(BaseModel):
    message_text: str = Field(..., min_length=5, max_length=5000, description="SMS, email, or chat text to audit")
    sender_info: Optional[str] = Field("Unknown", max_length=150, description="Sender name, phone, or email handle")


class ScamIndicator(BaseModel):
    indicator_type: str  # e.g. 'Artificial Urgency', 'Credential Harvesting', 'Suspicious URL', 'Impersonation'
    matched_pattern: str
    explanation: str


class ScamScanResponse(BaseModel):
    risk_level: str  # 'Low / Safe', 'Moderate Suspicion', 'High Risk'
    risk_score_percentage: int  # 0 - 100
    detected_indicators: List[ScamIndicator]
    safety_recommendations: List[str]
    disclaimer: str = (
        "Educational Notice: This scanner uses pattern-matching rules for educational fraud awareness. "
        "It does not guarantee safety or definitively detect every scam. Never share OTPs, PINs, or passwords with anyone."
    )
