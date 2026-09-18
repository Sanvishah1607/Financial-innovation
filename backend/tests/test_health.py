# Automated Health & Core Endpoint Tests
# FinGuard Backend - Phase 1: Backend Foundation

from fastapi.testclient import TestClient
import pytest


def test_application_import():
    """Verify application imports successfully and has required attributes."""
    from app.main import app
    assert app is not None
    assert app.title == "FinGuard API"


def test_root_endpoint():
    """Verify GET / returns HTTP 200 with message confirming FinGuard backend is running."""
    from app.main import app
    client = TestClient(app)
    response = client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert "FinGuard" in data["message"]
    assert data["status"] == "running"
    assert data["app_name"] == "FinGuard API"


def test_health_check_endpoint():
    """Verify GET /health returns HTTP 200 with status, app name, and health metadata."""
    from app.main import app
    client = TestClient(app)
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert data["app_name"] == "FinGuard API"
    assert data["service"] == "finguard-backend"
    assert "version" in data
    assert "environment" in data


def test_api_v1_health_check_endpoint():
    """Verify GET /api/v1/health returns HTTP 200 for versioned health route."""
    from app.main import app
    client = TestClient(app)
    response = client.get("/api/v1/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert data["app_name"] == "FinGuard API"


def test_nonexistent_route_returns_404():
    """Verify invalid routes return 404 status code."""
    from app.main import app
    client = TestClient(app)
    response = client.get("/non-existent-endpoint")
    assert response.status_code == 404

