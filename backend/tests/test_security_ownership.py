# FinShield Security, Ownership Isolation, and Validation Test Suite

from datetime import date
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

USER_A_HEADER = {"Authorization": "Bearer dev-user-alice"}
USER_B_HEADER = {"Authorization": "Bearer dev-user-bob"}


def test_unauthorized_access_fails():
    """Verify accessing protected routes without Bearer token returns 401."""
    # Transactions
    resp = client.get("/api/v1/transactions")
    assert resp.status_code == 401
    assert "token is required" in resp.json()["error"].lower()

    # Budgets
    resp = client.get("/api/v1/budgets")
    assert resp.status_code == 401

    # Analytics
    resp = client.get("/api/v1/analytics/summary")
    assert resp.status_code == 401


def test_user_ownership_isolation():
    """Verify that User A's data is strictly inaccessible to User B."""
    # 1. User A creates a transaction
    tx_resp = client.post(
        "/api/v1/transactions",
        json={
            "title": "Alice Confidential Medical",
            "amount": "2500.00",
            "type": "expense",
            "category": "Medical",
            "transaction_date": str(date.today()),
        },
        headers=USER_A_HEADER,
    )
    assert tx_resp.status_code == 201
    alice_tx_id = tx_resp.json()["id"]

    # 2. User B attempts to access Alice's transaction -> Must return 404
    bob_get_resp = client.get(f"/api/v1/transactions/{alice_tx_id}", headers=USER_B_HEADER)
    assert bob_get_resp.status_code == 404

    # 3. User B attempts to delete Alice's transaction -> Must return 404
    bob_del_resp = client.delete(f"/api/v1/transactions/{alice_tx_id}", headers=USER_B_HEADER)
    assert bob_del_resp.status_code == 404

    # 4. User A can still retrieve the transaction
    alice_check = client.get(f"/api/v1/transactions/{alice_tx_id}", headers=USER_A_HEADER)
    assert alice_check.status_code == 200
    assert alice_check.json()["title"] == "Alice Confidential Medical"


def test_request_validation_structured_error():
    """Verify invalid payloads trigger structured 422 JSON errors with clear field information."""
    invalid_tx = {
        "title": "",  # Empty title violates min_length=1
        "amount": "-150.00",  # Negative amount violates gt=0
        "type": "unsupported_type",  # Violates 'income' or 'expense'
        "category": "Needs",
    }
    resp = client.post("/api/v1/transactions", json=invalid_tx, headers=USER_A_HEADER)
    assert resp.status_code == 422
    err_body = resp.json()
    assert err_body["status_code"] == 422
    assert "details" in err_body
    assert len(err_body["details"]) >= 1
