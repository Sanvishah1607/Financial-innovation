# FinGuard REST API Specification 📡

Base URL: `http://localhost:8000`

---

## 1. Core System Endpoints

### `GET /`
Returns root server welcome information.
* **Status**: 200 OK
* **Response**:
  ```json
  {
    "message": "Welcome to FinGuard API"
  }
  ```

### `GET /health`
Returns backend health status.
* **Status**: 200 OK
* **Response**:
  ```json
  {
    "status": "healthy",
    "service": "finguard-backend"
  }
  ```

---

## 2. API v1 Placeholder Endpoints (`/api/v1`)

| Method | Endpoint | Description | Status |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/v1/health` | API v1 Health Check | Implemented |
| `GET` | `/api/v1/auth` | User Authentication Placeholder | Scaffold (TODO) |
| `POST` | `/api/v1/auth/login` | Login Placeholder | Scaffold (TODO) |
| `GET` | `/api/v1/transactions` | List Transactions Placeholder | Scaffold (TODO) |
| `POST` | `/api/v1/transactions` | Create Transaction Placeholder | Scaffold (TODO) |
| `GET` | `/api/v1/budgets` | List Monthly Budgets Placeholder | Scaffold (TODO) |
| `POST` | `/api/v1/budgets` | Set Budget Limit Placeholder | Scaffold (TODO) |
| `GET` | `/api/v1/savings` | Get Savings Targets Placeholder | Scaffold (TODO) |
| `POST` | `/api/v1/savings/calculate`| Savings Calculation Placeholder | Scaffold (TODO) |
| `GET` | `/api/v1/education` | List Financial Guides Placeholder | Scaffold (TODO) |
| `POST` | `/api/v1/fraud/check` | Fraud Indicator Rule Scan Placeholder | Scaffold (TODO) |

---

## 3. How to Add a New Route (For Neev & Sanvi)

1. Open `backend/app/api/routes/<feature_name>.py`.
2. Define a Pydantic schema in `backend/app/schemas/` for input validation.
3. Write your FastAPI endpoint:
   ```python
   from fastapi import APIRouter
   from app.schemas.common import ApiResponse

   router = APIRouter()

   @router.get("/example", response_model=ApiResponse)
   def get_example():
       return {"status": "success", "message": "Example endpoint working"}
   ```
4. If it's a new route file, register it in `backend/app/api/router.py`.
5. Run `pytest` in `backend/` to verify.
