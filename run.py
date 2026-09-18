#!/usr/bin/env python3
"""
FinGuard Full-Stack Launcher (macOS, Windows, Linux)
Runs FastAPI Backend (port 8000) and React Frontend (port 5173) simultaneously.
"""

import os
import sys
import subprocess
import time
import signal

ROOT_DIR = os.path.dirname(os.path.abspath(__file__))
BACKEND_DIR = os.path.join(ROOT_DIR, "backend")
FRONTEND_DIR = os.path.join(ROOT_DIR, "frontend")

processes = []

def cleanup(sig=None, frame=None):
    print("\nShutting down FinGuard services...")
    for p in processes:
        try:
            p.terminate()
        except Exception:
            pass
    print("Services stopped. Goodbye!")
    sys.exit(0)

signal.signal(signal.SIGINT, cleanup)
signal.signal(signal.SIGTERM, cleanup)

def get_python_exe():
    # Detect virtualenv python if available
    if sys.platform == "win32":
        venv_py = os.path.join(BACKEND_DIR, "venv", "Scripts", "python.exe")
    else:
        venv_py = os.path.join(BACKEND_DIR, "venv", "bin", "python")
    return venv_py if os.path.exists(venv_py) else sys.executable

def main():
    print("=" * 65)
    print("  FinGuard - Smart Personal Finance & Secure Transactions")
    print("  Full-Stack Launcher (FastAPI Backend + React Frontend)")
    print("=" * 65)
    print()

    py_exe = get_python_exe()

    # 1. Start Backend
    print("[1/2] Starting FastAPI Backend on http://127.0.0.1:8000...")
    backend_cmd = [
        py_exe, "-m", "uvicorn", "app.main:app",
        "--reload", "--host", "127.0.0.1", "--port", "8000"
    ]
    p_backend = subprocess.Popen(backend_cmd, cwd=BACKEND_DIR)
    processes.append(p_backend)

    time.sleep(2)

    # 2. Start Frontend
    print("[2/2] Starting React Vite Frontend on http://localhost:5173...")
    npm_cmd = "npm.cmd" if sys.platform == "win32" else "npm"
    p_frontend = subprocess.Popen([npm_cmd, "run", "dev"], cwd=FRONTEND_DIR)
    processes.append(p_frontend)

    print()
    print("=" * 65)
    print("  FinGuard is running!")
    print()
    print("  Frontend Application:  http://localhost:5173")
    print("  Backend API:           http://127.0.0.1:8000")
    print("  API Documentation:     http://127.0.0.1:8000/docs")
    print("=" * 65)
    print()
    print("Press [Ctrl + C] anytime to stop both services.\n")

    try:
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        cleanup()

if __name__ == "__main__":
    main()
