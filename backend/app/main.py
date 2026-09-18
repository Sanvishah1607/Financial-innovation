# FinGuard - FastAPI Application Entry Point
# Developed by Neev & Sanvi for FinTech Hackathon

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.api.router import api_router
from app.schemas.common import RootResponse, HealthResponse

# Initialize FastAPI Application
app = FastAPI(
    title=settings.PROJECT_NAME,
    description="FinGuard — Smart Personal Finance & Secure Digital Transactions Backend API",
    version=settings.VERSION,
)

# Configure CORS for frontend communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount API v1 Routes
app.include_router(api_router)


# Root Endpoint
@app.get("/", response_model=RootResponse, tags=["Root"])
def root():
    """Root endpoint welcoming users to FinGuard API."""
    return {
        "message": "Welcome to FinGuard API"
    }


# Health Check Endpoint
@app.get("/health", response_model=HealthResponse, tags=["Health"])
def health_check():
    """System-level health check endpoint."""
    return {
        "status": "healthy",
        "service": "finguard-backend"
    }
