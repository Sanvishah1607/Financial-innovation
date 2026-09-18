# Health Check Endpoint
from fastapi import APIRouter, status
from app.schemas.common import HealthResponse
from app.core.config import settings

router = APIRouter()


@router.get("/health", response_model=HealthResponse, status_code=status.HTTP_200_OK)
def get_health():
    """Health check endpoint to verify backend service status under /api/v1."""
    return {
        "status": "healthy",
        "app_name": settings.PROJECT_NAME,
        "service": "finguard-backend",
        "version": settings.VERSION,
        "environment": settings.ENVIRONMENT,
    }
