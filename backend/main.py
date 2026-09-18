import math
import re
from datetime import datetime, timedelta
from typing import List, Optional

from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from sqlalchemy import Column, Integer, String, Float, DateTime, Boolean, create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session

# ==========================================
# 1. DATABASE & ORM SETUP
# ==========================================
DATABASE_URL = "sqlite:///./fintech_database.db"

engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

class DBUser(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), default="Aarav Sharma")
    first_name = Column(String(50), default="Aarav")
    email = Column(String(120), unique=True, index=True, nullable=True)
    google_id = Column(String(120), nullable=True)
    avatar_url = Column(String(255), nullable=True)
    auth_provider = Column(String(20), default="email")
    monthly_income = Column(Float, default=35000.00)
    checking_balance = Column(Float, default=17550.00)
    vault_savings = Column(Float, default=24000.00)

class DBTransaction(Base):
    __tablename__ = "transactions"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, default=1)
    merchant = Column(String(120), nullable=False)
    amount = Column(Float, nullable=False)
    category = Column(String(50), nullable=False)  # Needs, Wants, Savings, Income
    roundup_amount = Column(Float, default=0.0)
    is_suspicious = Column(Boolean, default=False)
    flag_reason = Column(String(255), nullable=True)
    timestamp = Column(DateTime, default=datetime.utcnow)

Base.metadata.create_all(bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# ==========================================
# 2. SCHEMAS
# ==========================================
class TransactionCreate(BaseModel):
    merchant: str
    amount: float = Field(gt=0, description="Transaction amount in currency units")
    category: Optional[str] = None

class TransactionOut(BaseModel):
    id: int
    merchant: str
    amount: float
    category: str
    roundup_amount: float
    is_suspicious: bool
    flag_reason: Optional[str]
    timestamp: datetime

    class Config:
        from_attributes = True

class ScamScanRequest(BaseModel):
    message_text: str = Field(..., description="SMS, WhatsApp, or email content to audit for fraud")
    sender: Optional[str] = "Unknown"

class ScamScanResponse(BaseModel):
    risk_level: str  # SAFE, SUSPICIOUS, HIGH_RISK
    scam_probability_pct: int
    red_flags: List[str]
    human_advice: str

class AlternativeCreditResponse(BaseModel):
    score: int
    tier: str
    cashflow_runway_days: int
    savings_consistency_pct: float
    factors: List[str]
    actionable_tips: List[str]

class GoogleAuthRequest(BaseModel):
    credential: Optional[str] = None
    email: Optional[str] = None
    name: Optional[str] = None
    picture: Optional[str] = None

class AuthResponse(BaseModel):
    success: bool
    user: Optional[dict] = None
    token: Optional[str] = None
    message: Optional[str] = None
    error: Optional[str] = None

# ==========================================
# 3. HELPER BUSINESS LOGIC
# ==========================================
CATEGORY_RULES = {
    "Needs": ["grocery", "rent", "electricity", "water", "transit", "pharmacy", "medical", "books", "tuition"],
    "Wants": ["netflix", "starbucks", "swiggy", "zomato", "steam", "cinema", "uber", "dining", "club", "shopping"],
    "Savings": ["sip", "mutual fund", "gold", "deposit", "emergency"]
}

SCAM_TRIGGERS = [
    (r"(account.*blocked|suspended|deactivated|kyc expired|pan link)", "Urgency & Account Impersonation Threat"),
    (r"(click here|bit\.ly|tinyurl|tiny\.cc|cutt\.ly|update-bank|secure-login)", "Suspicious unverified redirect URL"),
    (r"(share otp|enter pin|cvv|give password)", "Critical Credential Harvesting"),
    (r"(won lottery|guaranteed cashback|credited bonus|prize pool)", "Unrealistic financial lure"),
    (r"(scan qr to receive|pay.*1.*rupee to verify)", "Reverse QR code payment trap")
]

def auto_classify_merchant(merchant: str) -> str:
    m_lower = merchant.lower()
    for category, keywords in CATEGORY_RULES.items():
        if any(kw in m_lower for kw in keywords):
            return category
    return "Wants"

def compute_spare_change(amount: float) -> float:
    ceiling = math.ceil(amount)
    return round(ceiling - amount, 2) if (ceiling - amount) > 0 else 0.0

# ==========================================
# 4. FASTAPI APP INITIALIZATION & CORS
# ==========================================
app = FastAPI(
    title="Human-Centric FinTech Core",
    description="Backend supporting budget autonomy, fraud detection, and alternative credit for young adults",
    version="1.0.0"
)

# Enable CORS for Vite frontend running on default ports
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173", "*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {"message": "Welcome to FinTech Core API"}

@app.get("/health")
def health():
    return {"status": "healthy", "service": "fintech-backend"}

# Startup Seed: Ensures your React frontend dashboard has realistic charts upon first launch
@app.on_event("startup")
def seed_initial_demo_data():
    db = SessionLocal()
    user = db.query(DBUser).first()
    if not user:
        user = DBUser(name="Jordan Alex", monthly_income=3200.00, checking_balance=1580.40, vault_savings=310.60)
        db.add(user)
        db.commit()

        sample_txs = [
            ("Campus Supermarket", 42.30, "Needs", 3),
            ("Zomato Cafe", 18.25, "Wants", 2),
            ("Semester Textbooks", 115.00, "Needs", 4),
            ("Steam Gaming Store", 24.50, "Wants", 1),
            ("Metro SmartCard Refill", 30.00, "Needs", 1),
            ("Micro SIP Deposit", 50.00, "Savings", 0),
        ]
        now = datetime.utcnow()
        for merchant, amt, cat, days_ago in sample_txs:
            tx = DBTransaction(
                user_id=user.id,
                merchant=merchant,
                amount=amt,
                category=cat,
                roundup_amount=compute_spare_change(amt),
                timestamp=now - timedelta(days=days_ago)
            )
            db.add(tx)
        db.commit()
    db.close()

# ==========================================
# 5. AUTHENTICATION & GOOGLE OAUTH ENDPOINTS
# ==========================================

@app.post("/api/v1/auth/google", response_model=AuthResponse)
@app.post("/api/auth/google", response_model=AuthResponse)
def handle_google_authentication(payload: GoogleAuthRequest, db: Session = Depends(get_db)):
    """
    Handles Google OAuth sign-in / sign-up:
    Extracts name, first name, email, avatar from Google token/payload,
    persists in SQLite / PostgreSQL database, and returns user session.
    """
    raw_name = payload.name or "Aarav Sharma"
    first_name = raw_name.split()[0] if raw_name else "User"
    email = payload.email or "aarav.google@gmail.com"
    avatar = payload.picture or "https://lh3.googleusercontent.com/a/default-user"

    # Find or create user in database
    user = db.query(DBUser).filter(DBUser.email == email).first()
    if not user:
        user = DBUser(
            name=raw_name,
            first_name=first_name,
            email=email,
            avatar_url=avatar,
            auth_provider="google",
            monthly_income=35000.0,
            checking_balance=17550.0,
            vault_savings=24000.0
        )
        db.add(user)
        db.commit()
        db.refresh(user)

    return AuthResponse(
        success=True,
        user={
            "id": f"usr_{user.id}",
            "fullName": user.name,
            "firstName": user.first_name or first_name,
            "email": user.email,
            "avatarUrl": user.avatar_url,
            "authProvider": "google",
            "monthlyIncome": user.monthly_income,
            "currency": "INR (₹)",
            "checkingBalance": user.checking_balance,
            "vaultSavings": user.vault_savings
        },
        token=f"jwt_google_{user.id}_finshield",
        message=f"Welcome, {first_name}! Successfully authenticated via Google."
    )

@app.post("/api/v1/auth/login", response_model=AuthResponse)
@app.post("/api/auth/login", response_model=AuthResponse)
def handle_email_login(payload: dict, db: Session = Depends(get_db)):
    email = payload.get("email", "aarav@finshield.in")
    first_name = email.split("@")[0].capitalize()
    return AuthResponse(
        success=True,
        user={
            "id": "usr_1",
            "fullName": f"{first_name} User",
            "firstName": first_name,
            "email": email,
            "authProvider": "email",
            "monthlyIncome": 45000.0,
            "currency": "INR (₹)"
        },
        token="jwt_session_token_finshield",
        message=f"Welcome back, {first_name}!"
    )

@app.get("/api/dashboard")
def get_dashboard_summary(db: Session = Depends(get_db)):
    """Supplies high-level financial health and time-series data formatted for Recharts."""
    user = db.query(DBUser).first()
    transactions = db.query(DBTransaction).order_by(DBTransaction.timestamp.desc()).all()

    needs_total = sum(t.amount for t in transactions if t.category == "Needs")
    wants_total = sum(t.amount for t in transactions if t.category == "Wants")
    savings_total = sum(t.amount for t in transactions if t.category == "Savings") + user.vault_savings

    # Chart data structure for Recharts
    budget_breakdown = [
        {"name": "Needs", "spent": round(needs_total, 2), "recommended": round(user.monthly_income * 0.50, 2)},
        {"name": "Wants", "spent": round(wants_total, 2), "recommended": round(user.monthly_income * 0.30, 2)},
        {"name": "Savings", "spent": round(savings_total, 2), "recommended": round(user.monthly_income * 0.20, 2)},
    ]

    # Safe daily spending runway
    days_left_in_month = max(1, 30 - datetime.utcnow().day)
    safe_daily_spend = round((user.checking_balance * 0.6) / days_left_in_month, 2)

    return {
        "user_name": user.name,
        "checking_balance": round(user.checking_balance, 2),
        "vault_savings": round(user.vault_savings, 2),
        "monthly_income": user.monthly_income,
        "safe_daily_spend": safe_daily_spend,
        "budget_breakdown": budget_breakdown,
        "recent_transactions": [TransactionOut.from_orm(t) for t in transactions[:8]]
    }

@app.get("/api/transactions", response_model=List[TransactionOut])
def list_transactions(db: Session = Depends(get_db)):
    """Returns the full ledger of logged transactions."""
    return db.query(DBTransaction).order_by(DBTransaction.timestamp.desc()).all()

@app.post("/api/transactions", response_model=TransactionOut)
def record_transaction(payload: TransactionCreate, db: Session = Depends(get_db)):
    """Logs spending, checks velocity safety, and routes spare-change round-up into the vault."""
    user = db.query(DBUser).first()
    if not user:
        raise HTTPException(status_code=404, detail="User account missing.")

    # Guardrail: Check sufficient funds
    if payload.amount > user.checking_balance:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Declined: Transaction of ${payload.amount:.2f} exceeds your balance of ${user.checking_balance:.2f}."
        )

    # Anomaly Detection: Single purchase > 65% of total checking balance
    is_suspicious = False
    flag_reason = None
    if payload.amount > (user.checking_balance * 0.65) and payload.amount > 200:
        is_suspicious = True
        flag_reason = "Unusually high spending event compared to current liquid reserve."

    # Categorization and Spare-Change Round-Up
    category = payload.category or auto_classify_merchant(payload.merchant)
    roundup = compute_spare_change(payload.amount)

    # Balance state updates
    user.checking_balance -= payload.amount
    if roundup > 0 and user.checking_balance >= roundup:
        user.checking_balance -= roundup
        user.vault_savings += roundup

    new_tx = DBTransaction(
        user_id=user.id,
        merchant=payload.merchant,
        amount=payload.amount,
        category=category,
        roundup_amount=roundup,
        is_suspicious=is_suspicious,
        flag_reason=flag_reason
    )
    db.add(new_tx)
    db.commit()
    db.refresh(new_tx)
    return new_tx

@app.post("/api/security/scan-message", response_model=ScamScanResponse)
def scan_security_threat(payload: ScamScanRequest):
    """Audits unsolicited texts, payment requests, or QR memos for deceptive social engineering patterns."""
    text_lower = payload.message_text.lower()
    detected_flags = []

    for pattern, explanation in SCAM_TRIGGERS:
        if re.search(pattern, text_lower):
            detected_flags.append(explanation)

    flag_count = len(detected_flags)
    if flag_count >= 2:
        return ScamScanResponse(
            risk_level="HIGH_RISK",
            scam_probability_pct=92,
            red_flags=detected_flags,
            human_advice="🚨 Stop immediately. Do not click links or share PINs. Legitimate banks will never demand verification via external web links or urgency threats."
        )
    elif flag_count == 1:
        return ScamScanResponse(
            risk_level="SUSPICIOUS",
            scam_probability_pct=58,
            red_flags=detected_flags,
            human_advice="⚠️ Proceed with caution. Open the official banking app directly rather than clicking any incoming links."
        )
    return ScamScanResponse(
        risk_level="SAFE",
        scam_probability_pct=4,
        red_flags=[],
        human_advice="✅ No active fraud vectors found. Keep practicing verification before sending money."
    )

@app.get("/api/credit/alternative-score", response_model=AlternativeCreditResponse)
def evaluate_alternative_credit(db: Session = Depends(get_db)):
    """Computes a non-traditional credit score for students lacking formal bureau histories."""
    user = db.query(DBUser).first()
    transactions = db.query(DBTransaction).all()

    total_wants = sum(t.amount for t in transactions if t.category == "Wants")
    total_outflows = sum(t.amount for t in transactions) or 1.0
    wants_ratio = total_wants / total_outflows

    # Base starts at 350
    score = 350
    factors = []
    tips = []

    # 1. Savings Reserve Ratio
    vault_ratio = user.vault_savings / (user.monthly_income or 1.0)
    if vault_ratio >= 0.15:
        score += 180
        factors.append("Consistently maintains over 15% emergency reserve relative to income.")
    elif vault_ratio >= 0.05:
        score += 120
        factors.append("Moderate emergency savings reserve in place.")
    else:
        score += 60
        tips.append("Enable automatic round-ups to build your emergency vault above $300.")

    # 2. Spending Restraint (Impulse vs Essential)
    if wants_ratio <= 0.35:
        score += 170
        factors.append("Discretionary spending is well balanced within the 35% ceiling.")
    elif wants_ratio <= 0.50:
        score += 110
        factors.append("Discretionary spending is moderate.")
    else:
        score += 50
        tips.append("Lower non-essential wants spending below 40% of monthly outflows to boost your score.")

    # 3. Cashflow Runway
    avg_daily_burn = (total_outflows / 30) if total_outflows > 0 else 25.0
    runway_days = int(user.checking_balance / avg_daily_burn)
    if runway_days > 25:
        score += 150
        factors.append(f"Strong liquidity runway: ~{runway_days} days of living expenses on hand.")
    else:
        score += 90
        factors.append(f"Adequate short-term liquidity runway (~{runway_days} days).")

    final_score = min(850, score)
    tier = "Prime" if final_score >= 720 else "Fair / Emerging" if final_score >= 630 else "Building Foundation"

    return AlternativeCreditResponse(
        score=final_score,
        tier=tier,
        cashflow_runway_days=runway_days,
        savings_consistency_pct=round(min(100.0, (vault_ratio / 0.20) * 100), 1),
        factors=factors,
        actionable_tips=tips
    )

@app.post("/api/advisor/chat", response_model=ChatResponse)
def companion_chat(payload: ChatRequest, db: Session = Depends(get_db)):
    """Conversational mentor that provides empathetic, guilt-free financial coaching."""
    user = db.query(DBUser).first()
    msg = payload.message.lower()

    days_left = max(1, 30 - datetime.utcnow().day)
    safe_daily = round((user.checking_balance * 0.6) / days_left, 2)

    if any(w in msg for w in ["buy", "afford", "spend"]):
        if safe_daily >= 35.0:
            reply = f"You are in a healthy position, {user.name.split()[0]}! Your current cushion supports around ${safe_daily}/day for discretionary spending without straining your upcoming fixed commitments."
            nudge = "Set aside spare change from this purchase directly into your emergency vault."
        else:
            reply = f"Checking funds are tight this week (${user.checking_balance:.2f} remaining). Keeping non-essential purchases under ${safe_daily} today will keep your month stress-free."
            nudge = "Hold off on discretionary buys for 24 hours to re-evaluate."

    elif any(w in msg for w in ["invest", "sip", "stocks", "market"]):
        reply = "Investing does not require thousands of dollars to start. The simplest approach for young adults is consistent micro-SIPs ($5–$15 weekly in low-cost index funds or automated vaults) to let compounding do the heavy lifting."
        nudge = "Start a $10 weekly auto-deposit into a diversified index fund."

    elif any(w in msg for w in ["scam", "fraud", "suspicious", "otp"]):
        reply = "Always err on the side of caution! If anyone creates artificial urgency, asks for an OTP, or sends a payment link, disconnect and verify independently through your bank's official portal."
        nudge = "Paste the message into our Security Scanner tab for an immediate diagnostic check."

    else:
        reply = f"Hello {user.name.split()[0]}! You have ${user.checking_balance:.2f} available in checking and ${user.vault_savings:.2f} safely accumulated in your round-up vault. What's on your mind today?"
        nudge = "Check your 50/30/20 target breakdown on the main dashboard."

    return ChatResponse(reply=reply, safe_daily_spend=safe_daily, micro_nudge=nudge)

@app.get("/api/education/lessons")
def get_financial_lessons():
    """Interactive bite-sized financial literacy flashcards."""
    return [
        {
            "id": 1,
            "title": "Demystifying Credit: Cards vs. Debit",
            "read_time": "2 min",
            "takeaway": "Debit spends cash you already own. Credit is a 30-day interest-free loan that builds your future borrowing credibility—provided you pay the full balance every month."
        },
        {
            "id": 2,
            "title": "The Golden 50/30/20 Rule",
            "read_time": "3 min",
            "takeaway": "Split your income into 50% Essentials (rent, groceries), 30% Lifestyle (eating out, entertainment), and 20% Future Self (savings & investments)."
        },
        {
            "id": 3,
            "title": "Anatomy of Digital Payment Fraud",
            "read_time": "2 min",
            "takeaway": "Remember: You NEVER need to enter your UPI PIN or debit PIN to receive funds. PINs are exclusively authorization keys to release money."
        }
    ]
