# FinGuard — Smart Personal Finance & Secure Digital Transactions 🛡️

**FinGuard** is a clean, modern, beginner-friendly FinTech web application designed to empower students and young adults to manage daily finances, budget transparently, set savings targets, and spot digital fraud risks.

---

## 🛠️ Technology Stack

| Layer | Technology | Purpose |
| :--- | :--- | :--- |
| **Frontend** | React (Vite) + React Router | Single Page Application with clean modular routing |
| **Styling** | Vanilla CSS (FinTech Design System) | Accessible blue/slate palette, glassmorphism cards, responsive |
| **Backend** | Python 3 + FastAPI + Uvicorn | High-performance REST API with automatic Swagger docs |
| **Validation** | Pydantic | Request/response data validation |
| **Database** | Supabase (PostgreSQL) | Managed cloud relational database (placeholder setup) |
| **Testing** | Pytest + FastAPI TestClient | Backend endpoint verification |
| **Version Control** | Git + GitHub | Single shared branch (`main`) |

---

## 📁 Project Structure Overview

```text
FinGuard/
├── frontend/             # React + Vite client
│   ├── src/
│   │   ├── components/   # Reusable UI widgets (Button, Card, Input, EmptyState...)
│   │   ├── layouts/      # MainLayout, Navbar, Sidebar, Footer
│   │   ├── pages/        # Dashboard, Transactions, Budget, Savings, Fraud, Education...
│   │   ├── services/     # API fetch client
│   │   └── styles/       # Design system CSS
│   └── package.json
├── backend/              # FastAPI Python server
│   ├── app/
│   │   ├── api/routes/   # Modular route controllers (health, auth, transactions...)
│   │   ├── core/         # Settings and security configs
│   │   ├── db/           # Supabase connection placeholder
│   │   └── main.py       # FastAPI application entry point
│   ├── tests/            # Pytest test suite
│   └── requirements.txt
├── database/             # PostgreSQL schema and migration scripts
│   └── schema.sql
├── docs/                 # Architectural, API, and feature specs
│   ├── API.md
│   ├── ARCHITECTURE.md
│   └── FEATURES.md
├── CONTRIBUTING.md       # Safe Git workflow guide for the main branch
└── README.md
```

---

## 🚀 Quickstart Guide

### 1. Run the Backend API
```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# Start FastAPI server on port 8000
uvicorn app.main:app --reload --port 8000
```
* **Root API**: [http://localhost:8000/](http://localhost:8000/)
* **Health Check**: [http://localhost:8000/health](http://localhost:8000/health)
* **Interactive Swagger Docs**: [http://localhost:8000/docs](http://localhost:8000/docs)

### 2. Run the Frontend App
```bash
cd frontend
npm install

# Start Vite dev server on port 5173
npm run dev
```
* **Dashboard App**: [http://localhost:5173](http://localhost:5173)

### 3. Run Backend Automated Tests
```bash
cd backend
source venv/bin/activate
pytest -v
```

---

## ⚠️ Current Project Status & Limitations
* **Scaffold Phase**: This is an empty, working architectural scaffold.
* **No Real Financial Processing**: Does not connect to real bank accounts, UPI PINs, or live payment gateways.
* **Placeholder Handlers**: Endpoints return structured `{ "message": "... coming soon" }` payloads with `TODO` markers.
* **Safe Collaboration**: Refer to [`CONTRIBUTING.md`](./CONTRIBUTING.md) before pushing code.
