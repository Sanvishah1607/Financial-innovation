# Automated Health & Core Endpoint Tests
# Authored by Sanvi for FinGuard Backend

from fastapi.testclient import TestClient
from main import app

client = TestClient(app)


def test_root_endpoint():
    """Verify root endpoint returns welcome message."""
    response = client.get("/")
    assert response.status_code == 200
    assert response.json() == {"message": "Welcome to FinTech Core API"}


def test_health_check_endpoint():
    """Verify health check returns healthy status."""
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert data["service"] == "fintech-backend"


def test_dashboard_api():
    """Verify /api/dashboard returns financial metrics and recent transactions."""
    response = client.get("/api/dashboard")
    assert response.status_code == 200
    data = response.json()
    assert "checking_balance" in data
    assert "vault_savings" in data
    assert "budget_breakdown" in data
