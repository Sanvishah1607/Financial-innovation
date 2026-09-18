# FinShield — AI-Powered Financial Safety & Decision Intelligence Platform
# FastAPI Application Entry Point

from fastapi import FastAPI, Request, HTTPException, status
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.db.session import engine, Base
from app.api.router import api_router
from app.schemas.common import RootResponse, HealthResponse

# Automatically initialize database schema if tables don't exist
Base.metadata.create_all(bind=engine)

# Initialize FastAPI Application
app = FastAPI(
    title=settings.PROJECT_NAME,
    description=settings.PROJECT_DESCRIPTION,
    version=settings.VERSION,
    docs_url="/docs",
    redoc_url="/redoc",
)

# Configure CORS for frontend communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Structured Error Handlers
@app.exception_handler(HTTPException)
async def http_exception_handler(request: Request, exc: HTTPException):
    """Custom handler for HTTP exceptions with structured JSON response."""
    return JSONResponse(
        status_code=exc.status_code,
        content={"error": exc.detail, "status_code": exc.status_code},
    )


@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    """Custom handler formatting input validation errors into beginner-friendly messages."""
    errors = []
    for err in exc.errors():
        field = " -> ".join(str(loc) for loc in err.get("loc", []))
        errors.append(f"{field}: {err.get('msg')}")
    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content={
            "error": "Request validation failed",
            "details": errors,
            "status_code": 422,
        },
    )


@app.exception_handler(Exception)
async def generic_exception_handler(request: Request, exc: Exception):
    """Custom fallback handler for uncaught server exceptions."""
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={
            "error": "An internal server error occurred",
            "status_code": 500,
        },
    )


# Mount API v1 Routes (/api/v1)
app.include_router(api_router)


# Root Endpoint
@app.get("/", response_model=RootResponse, tags=["Root"], status_code=status.HTTP_200_OK)
def root():
    """Root endpoint welcoming users and confirming that FinShield backend is running."""
    return {
        "message": "Welcome to FinShield API — Backend is running successfully",
        "status": "running",
        "app_name": settings.PROJECT_NAME,
    }


# Health Check Endpoint
@app.get("/health", response_model=HealthResponse, tags=["Health"], status_code=status.HTTP_200_OK)
def health_check():
    """System-level health check endpoint confirming backend status, app name, and health."""
    return {
        "status": "healthy",
        "app_name": settings.PROJECT_NAME,
        "service": "finshield-backend",
        "version": settings.VERSION,
        "environment": settings.ENVIRONMENT,
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "app.main:app",
        host=settings.HOST,
        port=settings.PORT,
        reload=settings.DEBUG,
    )
