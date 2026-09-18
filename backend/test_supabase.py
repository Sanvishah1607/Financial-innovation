#!/usr/bin/env python3
"""
FinGuard — Supabase Connection Verification Script
Tests database connectivity (SQLAlchemy PostgreSQL / SQLite) and Supabase API keys.

Usage:
    cd backend
    python test_supabase.py
"""

import sys
from app.core.config import settings

def check_supabase_connection():
    print("=" * 60)
    print("      FinGuard Backend — Supabase Connection Tester")
    print("=" * 60)
    print(f"Project Name : {settings.PROJECT_NAME}")
    print(f"Environment  : {settings.ENVIRONMENT}")
    print("-" * 60)

    # 1. Inspect Settings
    db_url = settings.DATABASE_URL
    is_postgres = "postgres" in db_url.lower()
    is_sqlite = db_url.startswith("sqlite")

    print(f"Database Mode : {'PostgreSQL (Supabase)' if is_postgres else 'SQLite (Local)'}")
    if is_postgres:
        # Mask password for security display
        masked_url = db_url
        if "@" in db_url and ":" in db_url.split("@")[0]:
            prefix, rest = db_url.split("@", 1)
            scheme_user = prefix.rsplit(":", 1)[0]
            masked_url = f"{scheme_user}:****@{rest}"
        print(f"Connection URI: {masked_url}")
    else:
        print(f"Connection URI: {db_url}")

    print(f"Supabase URL  : {settings.SUPABASE_URL or '(Not set yet in .env)'}")
    print(f"Supabase Key  : {'Set (Hidden)' if settings.SUPABASE_KEY else '(Not set yet in .env)'}")
    print("-" * 60)

    # 2. Test SQLAlchemy Database Connection
    print("▶ Testing SQLAlchemy Database Connection...")
    try:
        from app.db.session import engine, Base
        from sqlalchemy import text

        with engine.connect() as conn:
            result = conn.execute(text("SELECT 1;")).scalar()
            if result == 1:
                print("  ✅ Database connection SUCCESSFUL! (Executed: SELECT 1)")
            else:
                print(f"  ⚠️ Unexpected query result: {result}")

        # Automatically create or verify tables
        print("▶ Checking tables in database...")
        import app.models.financial  # registers models with Base.metadata
        Base.metadata.create_all(bind=engine)
        table_names = list(Base.metadata.tables.keys())
        print(f"  ✅ Managed tables verified: {', '.join(table_names)}")

    except Exception as e:
        print(f"  ❌ Database connection FAILED:")
        print(f"     Error: {e}")
        print("\n💡 Troubleshooting Tips:")
        print("  1. Make sure your Supabase project is active (not paused).")
        print("  2. In Supabase Dashboard -> Project Settings -> Database -> Connection string (URI).")
        print("  3. Make sure to replace [YOUR-PASSWORD] with your actual database password.")
        print("  4. Ensure '?sslmode=require' is included at the end of the URL.")
        return False

    # 3. Test Supabase Python SDK Client
    if settings.SUPABASE_URL and settings.SUPABASE_KEY:
        print("-" * 60)
        print("▶ Testing Supabase SDK Client...")
        try:
            from app.db.supabase import get_supabase_client
            client = get_supabase_client()
            if client:
                print("  ✅ Supabase client initialized successfully!")
            else:
                print("  ⚠️ Supabase client returned None. Please check credentials.")
        except Exception as e:
            print(f"  ⚠️ Supabase SDK warning: {e}")
    else:
        print("-" * 60)
        print("ℹ️  Note: SUPABASE_URL and SUPABASE_KEY are optional if connecting via DATABASE_URL.")
        print("   If you want Supabase Auth token verification, add them to backend/.env.")

    print("=" * 60)
    print("🎉 All checks finished!")
    print("=" * 60)
    return True

if __name__ == "__main__":
    success = check_supabase_connection()
    sys.exit(0 if success else 1)
