# FinShield Scam Awareness & Digital Fraud Router
# Educational pattern-matching text safety analyzer

from typing import List, Dict
from fastapi import APIRouter
from app.services.scam_service import ScamService
from app.schemas.scam import ScamScanRequest, ScamScanResponse

router = APIRouter()


@router.post("/scan", response_model=ScamScanResponse, summary="Audit message for scam indicators")
def scan_message_for_fraud(request: ScamScanRequest):
    """
    Analyzes suspicious SMS, chat, or email content for urgency lures,
    phishing domains, and credential harvesting threats.
    """
    return ScamService.audit_message(request)


@router.get("/tips", summary="Educational digital safety guidelines")
def get_fraud_prevention_tips() -> List[Dict[str, str]]:
    """Educational rules of thumb for protecting personal finances online."""
    return [
        {
            "id": "1",
            "rule": "PINs Are Exclusively for Outgoing Payments",
            "explanation": "You NEVER need to scan a QR code or enter your UPI PIN to receive money. PIN entry releases funds from your account.",
        },
        {
            "id": "2",
            "rule": "Beware of False Urgency",
            "explanation": "Messages threatening that your bank account, SIM, or electricity will be disconnected within 24 hours are designed to panic you into making rash decisions.",
        },
        {
            "id": "3",
            "rule": "Never Download Unknown APKs or Remote Screenshare Apps",
            "explanation": "Fraudsters pose as customer support and ask victims to install remote-desktop software like AnyDesk or APK files that capture banking credentials.",
        },
        {
            "id": "4",
            "rule": "Verify Through Official Channels",
            "explanation": "Always independently look up your financial institution's customer service number from their official website or the back of your card.",
        },
    ]
