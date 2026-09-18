# Health Check Endpoint
from fastapi import APIRouter
from app.schemas.common import HealthResponse

router = APIRouter()


@router.get("/health", response_model=HealthResponse)
def get_health():
    """Health check endpoint to verify backend service status."""
    return {
        "status": "healthy",
        "service": "finguard-backend"
    }
