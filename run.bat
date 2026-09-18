rem () { :;}; [ -z "$COMSPEC" ] && exec python3 run.py "$@"
@echo off
TITLE FinGuard Launcher
COLOR 0A

echo =================================================================
echo   FinGuard - Smart Personal Finance ^& Secure Transactions
echo   Full-Stack Launcher (FastAPI Backend + React Frontend)
echo =================================================================
echo.

if not exist "backend" (
    echo [ERROR] backend folder not found. Please run this script from the project root.
    pause
    exit /b 1
)

if not exist "frontend" (
    echo [ERROR] frontend folder not found. Please run this script from the project root.
    pause
    exit /b 1
)

echo [1/2] Starting FinGuard FastAPI Backend (Port 8000)...
start "FinGuard Backend (FastAPI)" cmd /k "cd backend && (if exist venv\Scripts\activate.bat (call venv\Scripts\activate.bat) else (echo [INFO] Using global python)) && uvicorn app.main:app --reload --host 127.0.0.1 --port 8000"

timeout /t 2 /nobreak >nul

echo [2/2] Starting FinGuard React Frontend (Port 5173)...
start "FinGuard Frontend (Vite)" cmd /k "cd frontend && npm run dev"

echo.
echo =================================================================
echo   Both services are starting in dedicated terminal windows!
echo.
echo   Frontend Application:  http://localhost:5173
echo   Backend API:           http://127.0.0.1:8000
echo   Interactive API Docs:  http://127.0.0.1:8000/docs
echo =================================================================
echo.
echo Press any key to close this launcher window (services will stay running).
pause >nul
