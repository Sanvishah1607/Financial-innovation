# FinShield Intelligence, Simulator, Scam Awareness & Copilot Test Suite

from decimal import Decimal
from datetime import date, timedelta
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)
AUTH_HEADER = {"Authorization": "Bearer dev-user-intel-user"}


def test_spending_anomaly_detection():
    """Verify statistical anomaly detection flags disproportionately high expenses."""
    # Seed 3 regular grocery expenses (~₹500)
    for i in range(3):
        client.post(
            "/api/v1/transactions",
            json={
                "title": f"Local Groceries {i}",
                "amount": "500.00",
                "type": "expense",
                "category": "Groceries",
                "transaction_date": str(date.today() - timedelta(days=i * 2)),
            },
            headers=AUTH_HEADER,
        )

    # Seed 1 massive anomaly in the same category (₹6500)
    client.post(
        "/api/v1/transactions",
        json={
            "title": "Bulk Import Store",
            "amount": "6500.00",
            "type": "expense",
            "category": "Groceries",
            "transaction_date": str(date.today()),
        },
        headers=AUTH_HEADER,
    )

    resp = client.get("/api/v1/intelligence/anomalies", headers=AUTH_HEADER)
    assert resp.status_code == 200
    report = resp.json()
    assert report["anomalies_detected_count"] >= 1
    flagged = report["possible_anomalies"][0]
    assert flagged["is_possible_anomaly"] is True
    assert flagged["category"] == "Groceries"
    assert "higher than your usual" in flagged["reason"]


def test_recurring_expense_detection():
    """Verify detection of repeated subscriptions and bills."""
    # Seed 3 recurring Netflix charges 30 days apart
    for i in range(3):
        client.post(
            "/api/v1/transactions",
            json={
                "title": "Netflix Streaming Subscription",
                "amount": "649.00",
                "type": "expense",
                "category": "Entertainment",
                "transaction_date": str(date.today() - timedelta(days=(2 - i) * 30)),
            },
            headers=AUTH_HEADER,
        )

    resp = client.get("/api/v1/intelligence/recurring", headers=AUTH_HEADER)
    assert resp.status_code == 200
    data = resp.json()
    assert len(data["detected_recurring_expenses"]) >= 1
    item = next((r for r in data["detected_recurring_expenses"] if "netflix" in r["title"].lower()), None)
    assert item is not None
    assert Decimal(str(item["estimated_amount"])) == Decimal("649.00")
    assert item["occurrence_count"] >= 2


def test_financial_health_score():
    """Verify educational 0-100 financial health score calculation with factor explanations."""
    resp = client.get("/api/v1/intelligence/health-score", headers=AUTH_HEADER)
    assert resp.status_code == 200
    score_data = resp.json()
    assert 0 <= score_data["overall_score"] <= 100
    assert len(score_data["factors"]) == 3
    assert "NOT a credit score" in score_data["disclaimer"]
    assert len(score_data["actionable_recommendations"]) > 0


def test_what_if_simulator_no_db_mutation():
    """Verify simulator calculates projections without creating or altering database records."""
    # Count transactions prior to simulation
    tx_before = client.get("/api/v1/transactions", headers=AUTH_HEADER).json()["total"]

    sim_payload = {
        "additional_monthly_expense": "2500.00",
        "reduced_monthly_spending": "1000.00",
        "increased_monthly_savings": "1500.00",
        "one_time_large_purchase": "10000.00",
        "projection_months": 12,
    }
    sim_resp = client.post("/api/v1/simulator/simulate", json=sim_payload, headers=AUTH_HEADER)
    assert sim_resp.status_code == 200
    sim_data = sim_resp.json()
    assert "simulated_monthly_expenses" in sim_data
    assert "monthly_surplus_delta" in sim_data
    assert "savings_impact_difference" in sim_data
    assert "does not alter your actual transaction data" in sim_data["assumption_disclaimer"]

    # Verify transaction count is identical
    tx_after = client.get("/api/v1/transactions", headers=AUTH_HEADER).json()["total"]
    assert tx_before == tx_after


def test_scam_awareness_engine():
    """Verify pattern matching detects urgency, OTP requests, and phishing links."""
    suspicious_message = {
        "message_text": "URGENT: Your SBI Bank account is blocked! Share OTP immediately or click bit.ly/reactivate-now to restore access.",
        "sender_info": "+91-9876543210",
    }
    resp = client.post("/api/v1/fraud/scan", json=suspicious_message)
    assert resp.status_code == 200
    result = resp.json()
    assert result["risk_level"] == "High Risk"
    assert result["risk_score_percentage"] >= 60
    assert len(result["detected_indicators"]) >= 2
    assert any("Credential" in i["indicator_type"] for i in result["detected_indicators"])
    assert any("Urgency" in i["indicator_type"] for i in result["detected_indicators"])


def test_copilot_question_with_grounded_data():
    """Verify copilot returns grounded metrics backed by actual user records."""
    q_payload = {"question": "What is my largest spending category?"}
    resp = client.post("/api/v1/copilot/ask", json=q_payload, headers=AUTH_HEADER)
    assert resp.status_code == 200
    ans_data = resp.json()
    assert "largest_category" in ans_data["grounded_metrics"]
    assert len(ans_data["answer"]) > 10
    assert "ai_provider" in ans_data
    assert "Educational Notice" in ans_data["disclaimer"]
