# FinShield Backend Configuration
# Uses pydantic-settings to safely load settings from environment variables

from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import List, Optional


class Settings(BaseSettings):
    PROJECT_NAME: str = "FinShield API"
    VERSION: str = "1.0.0"
    ENVIRONMENT: str = "development"
    DEBUG: bool = True
    
    # CORS Origins (React Vite Frontend)
    CORS_ORIGINS: List[str] = [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ]
    
    # Database Configuration (PostgreSQL / SQLite fallback)
    DATABASE_URL: str = "sqlite:///./fintech_database.db"
    SUPABASE_URL: str = ""
    SUPABASE_KEY: str = ""
    
    # Google OAuth 2.0 Credentials (Get from https://console.cloud.google.com/apis/credentials)
    GOOGLE_CLIENT_ID: str = "your-google-client-id.apps.googleusercontent.com"
    GOOGLE_CLIENT_SECRET: str = "your-google-client-secret"
    
    # AI API Keys (For Scam Shield & AI Financial Insights)
    GEMINI_API_KEY: Optional[str] = ""
    OPENAI_API_KEY: Optional[str] = ""
    
    # JWT Security
    SECRET_KEY: str = "finshield-super-secret-jwt-key-2026"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 # 24 hours

    model_config = SettingsConfigDict(env_file=".env", extra="ignore")


settings = Settings()
