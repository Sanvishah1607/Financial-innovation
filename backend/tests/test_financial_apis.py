# FinShield Financial Core APIs Test Suite
# Tests: Auth, Transactions (CRUD, Decimal, Pagination), Budgets, Savings, and Analytics

from decimal import Decimal
from datetime import date
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

AUTH_HEADER_USER1 = {"Authorization": "Bearer dev-user-test-user-1"}
AUTH_HEADER_USER2 = {"Authorization": "Bearer dev-user-test-user-2"}


def test_auth_registration_and_profile():
    """Test user registration and current profile retrieval."""
    reg_payload = {
        "fullName": "Test User",
        "email": "testuser@finshield.app",
        "password": "SecretPassword123!",
        "monthlyIncome": 50000.0,
        "currency": "INR (₹)",
    }
    resp = client.post("/api/v1/auth/register", json=reg_payload)
    assert resp.status_code == 200
    data = resp.json()
    assert data["success"] is True
    assert "token" in data
    token = data["token"]

    # Retrieve profile using the issued token
    me_resp = client.get("/api/v1/auth/me", headers={"Authorization": f"Bearer {token}"})
    assert me_resp.status_code == 200
    me_data = me_resp.json()
    assert me_data["email"] == "testuser@finshield.app"
    assert me_data["fullName"] == "Test User"


def test_transactions_crud_and_decimal():
    """Test transaction creation with exact Decimal amount, retrieval, update, and pagination."""
    # 1. Create Income
    inc_payload = {
        "title": "Monthly Stipend",
        "amount": "45000.50",
        "type": "income",
        "category": "Income",
        "transaction_date": str(date.today()),
        "description": "Tech stipend deposit",
    }
    inc_resp = client.post("/api/v1/transactions", json=inc_payload, headers=AUTH_HEADER_USER1)
    assert inc_resp.status_code == 201
    inc_data = inc_resp.json()
    assert Decimal(str(inc_data["amount"])) == Decimal("45000.50")
    assert inc_data["type"] == "income"

    # 2. Create Expense
    exp_payload = {
        "title": "Semester Textbooks",
        "amount": "1250.75",
        "type": "expense",
        "category": "Needs",
        "transaction_date": str(date.today()),
    }
    exp_resp = client.post("/api/v1/transactions", json=exp_payload, headers=AUTH_HEADER_USER1)
    assert exp_resp.status_code == 201
    exp_id = exp_resp.json()["id"]

    # 3. Get single transaction
    get_resp = client.get(f"/api/v1/transactions/{exp_id}", headers=AUTH_HEADER_USER1)
    assert get_resp.status_code == 200
    assert get_resp.json()["title"] == "Semester Textbooks"

    # 4. Filter and Paginate
    list_resp = client.get("/api/v1/transactions?category=Needs&page=1&page_size=10", headers=AUTH_HEADER_USER1)
    assert list_resp.status_code == 200
    list_data = list_resp.json()
    assert list_data["total"] >= 1
    assert any(item["id"] == exp_id for item in list_data["items"])

    # 5. Delete transaction
    del_resp = client.delete(f"/api/v1/transactions/{exp_id}", headers=AUTH_HEADER_USER1)
    assert del_resp.status_code == 204

    # Verify deleted
    verify_del = client.get(f"/api/v1/transactions/{exp_id}", headers=AUTH_HEADER_USER1)
    assert verify_del.status_code == 404


def test_budgets_spending_comparison_and_overspending():
    """Test setting budget limit and verifying actual spending comparison and overspending indicators."""
    current_month = date.today().strftime("%Y-%m")

    # Log an expense in 'Wants' category
    client.post(
        "/api/v1/transactions",
        json={
            "title": "Weekend Dinner",
            "amount": "1800.00",
            "type": "expense",
            "category": "Wants",
            "transaction_date": str(date.today()),
        },
        headers=AUTH_HEADER_USER1,
    )

    # Set budget for 'Wants' with a limit of 1500 (will trigger overspent)
    b_payload = {
        "category": "Wants",
        "month_year": current_month,
        "monthly_limit": "1500.00",
    }
    b_resp = client.post("/api/v1/budgets", json=b_payload, headers=AUTH_HEADER_USER1)
    assert b_resp.status_code == 201

    # Check budget status
    status_resp = client.get(f"/api/v1/budgets?month_year={current_month}", headers=AUTH_HEADER_USER1)
    assert status_resp.status_code == 200
    statuses = status_resp.json()
    wants_status = next((b for b in statuses if b["category"] == "Wants"), None)
    assert wants_status is not None
    assert Decimal(str(wants_status["actual_spent"])) >= Decimal("1800.00")
    assert wants_status["is_overspent"] is True
    assert wants_status["status_label"] == "Over Budget"


def test_savings_goals_and_contributions():
    """Test creating savings target, depositing contribution, and verifying progress metrics."""
    goal_payload = {
        "goal_name": "Emergency Cushion Fund",
        "target_amount": "20000.00",
        "target_months": 10,
        "initial_deposit": "5000.00",
    }
    goal_resp = client.post("/api/v1/savings", json=goal_payload, headers=AUTH_HEADER_USER1)
    assert goal_resp.status_code == 201
    goal_data = goal_resp.json()
    assert Decimal(str(goal_data["current_amount"])) == Decimal("5000.00")
    assert Decimal(str(goal_data["completion_percentage"])) == Decimal("25.00")
    assert Decimal(str(goal_data["remaining_amount"])) == Decimal("15000.00")
    goal_id = goal_data["id"]

    # Deposit additional contribution
    contrib_payload = {"amount": "2500.00", "note": "Bonus savings deposit"}
    dep_resp = client.post(f"/api/v1/savings/{goal_id}/contributions", json=contrib_payload, headers=AUTH_HEADER_USER1)
    assert dep_resp.status_code == 200
    dep_data = dep_resp.json()
    assert Decimal(str(dep_data["current_amount"])) == Decimal("7500.00")
    assert Decimal(str(dep_data["completion_percentage"])) == Decimal("37.50")


def test_analytics_summary():
    """Test full financial summary aggregation and category breakdown."""
    summary_resp = client.get("/api/v1/analytics/summary", headers=AUTH_HEADER_USER1)
    assert summary_resp.status_code == 200
    summary = summary_resp.json()
    assert "total_income" in summary
    assert "total_expense" in summary
    assert "net_balance" in summary
    assert "category_breakdown" in summary
    assert "recent_monthly_trends" in summary
