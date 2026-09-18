# FinShield Backend — AI-Powered Financial Safety & Decision Intelligence Platform 🛡️

Welcome to the **FinShield Backend** architecture! This platform is built using **Python 3**, **FastAPI**, **SQLAlchemy**, **Supabase PostgreSQL**, and **NVIDIA NIM (Llama 3.2)**, designed to be scalable, secure, modular, and beginner-friendly.

---

## 🏛️ Architecture Overview

The backend is built as a **Modular Monolith** designed for clear separation of concerns:

```text
backend/
├── app/
│   ├── main.py              # Application entry point, CORS, error handling
│   ├── api/
│   │   ├── router.py        # Master API v1 router (/api/v1)
│   │   └── routes/          # Feature route controllers
│   │       ├── health.py    # System health check
│   │       ├── auth.py      # Supabase Auth / Google OAuth
│   │       ├── transactions.py # CRUD, filtering, pagination
│   │       ├── budgets.py   # Monthly budgets & overspending alerts
│   │       ├── savings.py   # Goals & contribution milestones
│   │       ├── analytics.py # Income, expense, and trend aggregations
│   │       ├── intelligence.py # Anomaly detection & health score
│   │       ├── simulator.py # Pure What-If scenario projections
│   │       ├── fraud.py     # Educational Scam Awareness Engine
│   │       └── copilot.py   # Context-grounded AI Financial Copilot
│   ├── core/
│   │   ├── config.py        # Pydantic Settings loaded safely from .env
│   │   └── security.py      # Token verification & ownership enforcement
│   ├── db/
│   │   ├── session.py       # Engine & SessionLocal connection manager
│   │   └── supabase.py      # Cloud database client integration
│   ├── models/
│   │   └── financial.py     # SQLAlchemy ORM models (Decimal precision)
│   ├── schemas/             # Pydantic validation models
│   │   ├── common.py
│   │   ├── transaction.py
│   │   ├── budget.py
│   │   ├── savings.py
│   │   ├── analytics.py
│   │   ├── intelligence.py
│   │   ├── simulator.py
│   │   ├── scam.py
│   │   └── copilot.py
│   └── services/            # Business logic layer
│       ├── transaction_service.py
│       ├── budget_service.py
│       ├── savings_service.py
│       ├── analytics_service.py
│       ├── intelligence_service.py
│       ├── simulator_service.py
│       ├── scam_service.py
│       └── copilot_service.py
├── tests/                   # Automated Pytest suite (19 tests)
│   ├── test_health.py
│   ├── test_financial_apis.py
│   ├── test_intelligence_and_simulator.py
│   └── test_security_ownership.py
├── requirements.txt         # Pinned backend dependencies
├── .env.example             # Safe template for environment variables
└── README.md                # This guide
```

---

## 🚀 Quickstart Guide

### 1. Activate Environment & Install Packages
```bash
cd backend
source venv/bin/activate
pip install -r requirements.txt
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env` and configure your keys:
```bash
cp .env.example .env
```
Add your **`NVIDIA_API_KEY`** (starts with `nvapi-`) to enable the Llama 3.2 AI Copilot.

### 3. Start Development Server
```bash
uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```
Open **[http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)** to test all endpoints interactively in your browser.

---

## 🌐 Complete API Endpoint Map

| Category | Method | Endpoint | Description |
| :--- | :--- | :--- | :--- |
| **System** | `GET` | `/` | Root greeting and server status |
| **System** | `GET` | `/health` | System health check (service, version, env) |
| **System** | `GET` | `/api/v1/health` | Versioned v1 health check |
| **Auth** | `POST` | `/api/v1/auth/google` | Google OAuth 2.0 sign-in |
| **Auth** | `POST` | `/api/v1/auth/login` | Email/password login |
| **Auth** | `POST` | `/api/v1/auth/register` | Register new account |
| **Auth** | `GET` | `/api/v1/auth/me` | Fetch authenticated user profile |
| **Transactions**| `GET` | `/api/v1/transactions` | List transactions (filtering & pagination) |
| **Transactions**| `POST`| `/api/v1/transactions` | Record new transaction (`Decimal` amount) |
| **Transactions**| `GET` | `/api/v1/transactions/{id}` | Get single transaction |
| **Transactions**| `PUT` | `/api/v1/transactions/{id}` | Update transaction details |
| **Transactions**| `DELETE`| `/api/v1/transactions/{id}` | Remove transaction |
| **Budgets** | `GET` | `/api/v1/budgets` | Category budget spending & overspending alerts |
| **Budgets** | `POST`| `/api/v1/budgets` | Set or update monthly budget ceiling |
| **Budgets** | `DELETE`| `/api/v1/budgets/{id}` | Remove category budget |
| **Savings** | `GET` | `/api/v1/savings` | List goals with progress % & pacing |
| **Savings** | `POST`| `/api/v1/savings` | Create savings target |
| **Savings** | `POST`| `/api/v1/savings/{id}/contributions` | Deposit savings contribution |
| **Analytics** | `GET` | `/api/v1/analytics/summary` | Net balance, savings rate, category breakdown |
| **Intelligence**| `GET` | `/api/v1/intelligence/anomalies` | Statistical spending anomaly alerts |
| **Intelligence**| `GET` | `/api/v1/intelligence/recurring` | Detected periodic subscriptions |
| **Intelligence**| `GET` | `/api/v1/intelligence/health-score` | Educational wellness score (0-100) |
| **Simulator** | `POST`| `/api/v1/simulator/simulate` | What-If scenario cash-flow projection |
| **Scam Shield**| `POST`| `/api/v1/fraud/scan` | Audit message text for fraud/phishing |
| **Scam Shield**| `GET` | `/api/v1/fraud/tips` | Educational fraud prevention guidelines |
| **AI Copilot** | `POST`| `/api/v1/copilot/ask` | Grounded financial coaching with NVIDIA AI |

---

## 🧪 Running Automated Tests

Execute the 19 automated unit and integration tests:

```bash
PYTHONPATH=. pytest tests/ -v
```

Expected result:
```text
tests/test_financial_apis.py ........... PASSED
tests/test_health.py ................... PASSED
tests/test_intelligence_and_simulator.py PASSED
tests/test_security_ownership.py ....... PASSED
======================= 19 passed in 3.8s =======================
```
