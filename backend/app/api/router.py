# FinShield Master API v1 Router
# Consolidates all modular feature controllers into /api/v1 prefix

from fastapi import APIRouter
from app.api.routes import (
    health,
    auth,
    transactions,
    budgets,
    savings,
    analytics,
    intelligence,
    simulator,
    fraud,
    copilot,
)

api_router = APIRouter(prefix="/api/v1")

# Register individual feature routers
api_router.include_router(health.router, tags=["Health"])
api_router.include_router(auth.router, prefix="/auth", tags=["Authentication"])
api_router.include_router(transactions.router, prefix="/transactions", tags=["Transactions"])
api_router.include_router(budgets.router, prefix="/budgets", tags=["Budgets"])
api_router.include_router(savings.router, prefix="/savings", tags=["Savings Goals"])
api_router.include_router(analytics.router, prefix="/analytics", tags=["Financial Analytics"])
api_router.include_router(intelligence.router, prefix="/intelligence", tags=["Financial Intelligence Engine"])
api_router.include_router(simulator.router, prefix="/simulator", tags=["What-If Simulator"])
api_router.include_router(fraud.router, prefix="/fraud", tags=["Scam Awareness Engine"])
api_router.include_router(copilot.router, prefix="/copilot", tags=["AI Financial Copilot"])
