#!/usr/bin/env bash

# =================================================================
# FinGuard - Smart Personal Finance & Secure Transactions
# Full-Stack Launcher for macOS and Linux
# =================================================================

set -e

PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$PROJECT_ROOT"

echo "================================================================="
echo "  FinGuard Full-Stack Launcher (FastAPI Backend + React Frontend)"
echo "================================================================="
echo ""

# Function to cleanly terminate background processes on Ctrl+C
cleanup() {
    echo ""
    echo "Shutting down FinGuard services..."
    if [ -n "$BACKEND_PID" ]; then
        kill "$BACKEND_PID" 2>/dev/null || true
    fi
    if [ -n "$FRONTEND_PID" ]; then
        kill "$FRONTEND_PID" 2>/dev/null || true
    fi
    echo "Services stopped. Goodbye!"
    exit 0
}

trap cleanup SIGINT SIGTERM EXIT

# 1. Start Backend
echo "[1/2] Starting FastAPI Backend on http://127.0.0.1:8000..."
cd "$PROJECT_ROOT/backend"
if [ -f "venv/bin/activate" ]; then
    source venv/bin/activate
fi
uvicorn app.main:app --reload --host 127.0.0.1 --port 8000 &
BACKEND_PID=$!

sleep 2

# 2. Start Frontend
echo "[2/2] Starting React Vite Frontend on http://localhost:5173..."
cd "$PROJECT_ROOT/frontend"
npm run dev &
FRONTEND_PID=$!

echo ""
echo "================================================================="
echo "  FinGuard is running!"
echo ""
echo "  Frontend Application:  http://localhost:5173"
echo "  Backend API:           http://127.0.0.1:8000"
echo "  API Documentation:     http://127.0.0.1:8000/docs"
echo "================================================================="
echo ""
echo "Press [Ctrl + C] in this window anytime to stop both services."

# Wait for background jobs
wait
