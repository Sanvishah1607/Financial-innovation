# FinShield Digital Scam Awareness & Risk Analysis Service
# Rule-based educational pattern matcher for suspicious payment requests and phishing

import re
from typing import List, Tuple
from app.schemas.scam import ScamScanRequest, ScamScanResponse, ScamIndicator

# Educational Scam Pattern Detection Rules
SCAM_RULES: List[Tuple[str, str, str, int]] = [
    # (Regex pattern, Indicator Type, Explanation, Risk weight)
    (
        r"(account.*(blocked|suspended|deactivated|frozen)|kyc.*(expired|pending|verify)|pan.*link)",
        "Impersonation & Account Threat",
        "Scammers invoke urgent threats of account closure or frozen cards to induce panic.",
        30,
    ),
    (
        r"(share.*otp|enter.*pin|cvv|atm pin|upi pin|password|credential)",
        "Critical Credential Harvesting",
        "Legitimate banks never ask for your UPI PIN, ATM PIN, OTP, or CVV over SMS, chat, or phone.",
        40,
    ),
    (
        r"(bit\.ly|tinyurl|tiny\.cc|cutt\.ly|update-bank|secure-login|shorturl|\.apk|\.xyz)",
        "Unverified / Shortened Link",
        "Shortened URLs hide the actual destination and are frequently used to download malware or phishing pages.",
        25,
    ),
    (
        r"(scan.*qr.*(receive|credit|accept)|pay.*1.*(rupee|rs).*verify)",
        "Reverse Payment Trap",
        "You NEVER need to scan a QR code or enter a PIN to receive money. Scanning a QR code always sends money.",
        35,
    ),
    (
        r"(won.*lottery|guaranteed.*cashback|credited.*bonus|claim.*reward|prize.*pool)",
        "Unrealistic Financial Lure",
        "Promises of unexpected rewards, lotteries, or guaranteed cashback are classic advance-fee hooks.",
        20,
    ),
    (
        r"(within 24 hours|immediate action|urgent|expire today|last chance)",
        "Artificial Urgency",
        "Fraudsters rush victims to bypass logical decision-making and cross-checking.",
        15,
    ),
]


class ScamService:
    @staticmethod
    def audit_message(request: ScamScanRequest) -> ScamScanResponse:
        """
        Analyzes message text against educational threat patterns.
        Never stores payment credentials or messages.
        """
        text = request.message_text.lower()
        detected_indicators: List[ScamIndicator] = []
        accumulated_risk = 0

        for pattern, ind_type, explanation, weight in SCAM_RULES:
            match = re.search(pattern, text, re.IGNORECASE)
            if match:
                detected_indicators.append(
                    ScamIndicator(
                        indicator_type=ind_type,
                        matched_pattern=match.group(0),
                        explanation=explanation,
                    )
                )
                accumulated_risk += weight

        final_risk_score = min(100, accumulated_risk)

        if final_risk_score >= 60:
            risk_level = "High Risk"
            recommendations = [
                "Do NOT click any links, open attachments, or download APK files from this sender.",
                "Never share your OTP, PIN, password, or card details under any circumstances.",
                "If concerned about your account, contact your bank directly using the phone number on the back of your official debit/credit card.",
            ]
        elif final_risk_score >= 25:
            risk_level = "Moderate Suspicion"
            recommendations = [
                "Verify the sender's identity independently through the organization's official verified portal.",
                "Avoid using any phone numbers or links provided inside the message.",
            ]
        else:
            risk_level = "Low / Safe"
            recommendations = [
                "No standard high-risk fraud triggers detected.",
                "Always remain vigilant: remember that you never need to enter a PIN to receive incoming transfers.",
            ]

        return ScamScanResponse(
            risk_level=risk_level,
            risk_score_percentage=final_risk_score,
            detected_indicators=detected_indicators,
            safety_recommendations=recommendations,
        )
