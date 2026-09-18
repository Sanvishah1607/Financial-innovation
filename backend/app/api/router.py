# FinGuard API v1 Master Router
# Consolidates all modular route controllers into /api/v1 prefix

from fastapi import APIRouter
from app.api.routes import health, auth, transactions, budgets, savings, education, fraud

api_router = APIRouter(prefix="/api/v1")

# Register individual feature routers
api_router.include_router(health.router, tags=["Health"])
api_router.include_router(auth.router, prefix="/auth", tags=["Auth"])
api_router.include_router(transactions.router, prefix="/transactions", tags=["Transactions"])
api_router.include_router(budgets.router, prefix="/budgets", tags=["Budgets"])
api_router.include_router(savings.router, prefix="/savings", tags=["Savings"])
api_router.include_router(education.router, prefix="/education", tags=["Education"])
api_router.include_router(fraud.router, prefix="/fraud", tags=["Fraud Awareness"])
