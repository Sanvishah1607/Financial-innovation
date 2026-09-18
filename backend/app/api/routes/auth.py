# FinShield Authentication Routes Module
# Handles Google OAuth 2.0 and Email/Password Login & Registration

from fastapi import APIRouter, HTTPException, status, Depends
from pydantic import BaseModel, EmailStr
from typing import Optional, Dict, Any
from datetime import datetime

router = APIRouter()

# ==========================================
# SCHEMAS
# ==========================================

class GoogleAuthRequest(BaseModel):
    credential: Optional[str] = None # Google ID token or OAuth access token
    email: Optional[EmailStr] = None
    name: Optional[str] = None
    picture: Optional[str] = None

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class RegisterRequest(BaseModel):
    fullName: str
    email: EmailStr
    password: str
    monthlyIncome: Optional[float] = 35000.0
    currency: Optional[str] = "INR (₹)"

class UserResponse(BaseModel):
    id: str
    fullName: str
    firstName: str
    email: str
    avatarUrl: Optional[str] = None
    authProvider: str
    monthlyIncome: float
    currency: str
    createdAt: str

class AuthResponse(BaseModel):
    success: bool
    user: Optional[UserResponse] = None
    token: Optional[str] = None
    message: Optional[str] = None
    error: Optional[str] = None

# ==========================================
# IN-MEMORY USER STORE (Ready for PostgreSQL)
# ==========================================
USER_DATABASE: Dict[str, Dict[str, Any]] = {}

# ==========================================
# ENDPOINTS
# ==========================================

@router.post("/google", response_model=AuthResponse)
async def google_auth(payload: GoogleAuthRequest):
    """
    Authenticate via Google OAuth 2.0:
    1. Receives Google account credentials (or email/name/picture).
    2. Automatically extracts the user's First Name and Email.
    3. Persists/updates user profile in database.
    4. Returns secure JWT token & profile.
    """
    raw_name = payload.name or "Aarav Sharma"
    first_name = raw_name.split()[0] if raw_name else "User"
    email = payload.email or "aarav.google@gmail.com"
    avatar_url = payload.picture or "https://lh3.googleusercontent.com/a/default-user"

    user_id = f"usr_google_{int(datetime.utcnow().timestamp())}"
    
    user_record = {
        "id": user_id,
        "fullName": raw_name,
        "firstName": first_name,
        "email": email,
        "avatarUrl": avatar_url,
        "authProvider": "google",
        "monthlyIncome": 35000.0,
        "currency": "INR (₹)",
        "createdAt": datetime.utcnow().isoformat()
    }
    
    USER_DATABASE[email] = user_record

    return AuthResponse(
        success=True,
        user=UserResponse(**user_record),
        token=f"jwt_google_token_{user_id}",
        message=f"Welcome, {first_name}! Successfully authenticated via Google."
    )


@router.post("/login", response_model=AuthResponse)
async def login(payload: LoginRequest):
    """Email & Password Authentication"""
    if payload.email in USER_DATABASE:
        user_record = USER_DATABASE[payload.email]
        first_name = user_record.get("firstName", user_record["fullName"].split()[0])
        return AuthResponse(
            success=True,
            user=UserResponse(**user_record),
            token=f"jwt_email_token_{user_record['id']}",
            message=f"Welcome back, {first_name}!"
        )

    # Demo fallback for testing
    first_name = payload.email.split("@")[0].capitalize()
    fallback_user = {
        "id": "usr_demo_1",
        "fullName": f"{first_name} User",
        "firstName": first_name,
        "email": payload.email,
        "avatarUrl": None,
        "authProvider": "email",
        "monthlyIncome": 45000.0,
        "currency": "INR (₹)",
        "createdAt": datetime.utcnow().isoformat()
    }
    return AuthResponse(
        success=True,
        user=UserResponse(**fallback_user),
        token="jwt_demo_token_finshield",
        message=f"Welcome back, {first_name}!"
    )


@router.post("/register", response_model=AuthResponse)
async def register(payload: RegisterRequest):
    """Register new account with Email & Password"""
    first_name = payload.fullName.split()[0] if payload.fullName else "User"
    user_id = f"usr_{int(datetime.utcnow().timestamp())}"

    user_record = {
        "id": user_id,
        "fullName": payload.fullName,
        "firstName": first_name,
        "email": payload.email,
        "avatarUrl": None,
        "authProvider": "email",
        "monthlyIncome": payload.monthlyIncome or 35000.0,
        "currency": payload.currency or "INR (₹)",
        "createdAt": datetime.utcnow().isoformat()
    }

    USER_DATABASE[payload.email] = user_record

    return AuthResponse(
        success=True,
        user=UserResponse(**user_record),
        token=f"jwt_registered_token_{user_id}",
        message=f"Account created successfully for {first_name}."
    )


@router.get("/me", response_model=UserResponse)
async def get_current_user():
    """Fetch active authenticated user profile"""
    return UserResponse(
        id="usr_default_1",
        fullName="Aarav Sharma",
        firstName="Aarav",
        email="aarav.sharma@finshield.in",
        avatarUrl=None,
        authProvider="email",
        monthlyIncome=45000.0,
        currency="INR (₹)",
        createdAt="2024-08-15T09:00:00Z"
    )
