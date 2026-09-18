# FinGuard Supabase Client & Database Helper
# Provides Supabase SDK client for Auth, Realtime, and Storage integration

from typing import Optional
from app.core.config import settings

_supabase_client = None


def get_supabase_client():
    """
    Returns an initialized Supabase Python SDK Client.
    If SUPABASE_URL or SUPABASE_KEY are not configured, returns None.
    """
    global _supabase_client
    if _supabase_client is not None:
        return _supabase_client

    if not settings.SUPABASE_URL or not settings.SUPABASE_KEY:
        return None

    try:
        from supabase import create_client, Client
        _supabase_client = create_client(settings.SUPABASE_URL, settings.SUPABASE_KEY)
        return _supabase_client
    except Exception as e:
        print(f"⚠️ Warning: Could not initialize Supabase client: {e}")
        return None

