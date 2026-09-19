# FinShield Backend Configuration
# Uses pydantic-settings to safely load settings from environment variables

from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import List, Optional


class Settings(BaseSettings):
    PROJECT_NAME: str = "FinGuard API"
    PROJECT_DESCRIPTION: str = "FinGuard — Smart Personal Finance & Secure Digital Transactions Backend API"
    VERSION: str = "1.0.0"
    ENVIRONMENT: str = "development"
    DEBUG: bool = True
    HOST: str = "127.0.0.1"
    PORT: int = 8000
    
    # CORS Origins (React Vite Frontend)
    CORS_ORIGINS: List[str] = [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ]
    
    # Database Configuration (PostgreSQL / SQLite fallback)
    DATABASE_URL: str = "sqlite:///./finshield.db"
    SUPABASE_URL: str = ""
    SUPABASE_KEY: str = ""
    
    # Google OAuth 2.0 Credentials (Get from https://console.cloud.google.com/apis/credentials)
    GOOGLE_CLIENT_ID: str = "your-google-client-id.apps.googleusercontent.com"
    GOOGLE_CLIENT_SECRET: str = "your-google-client-secret"
    
    # NVIDIA AI (NIM) API Configuration (Primary LLM Provider)
    # Get free key at: https://build.nvidia.com
    NVIDIA_API_KEY: Optional[str] = ""
    NVIDIA_BASE_URL: str = "https://integrate.api.nvidia.com/v1"
    NVIDIA_MODEL: str = "meta/llama-3.2-11b-vision-instruct"

    # Optional Fallback AI API Keys
    GEMINI_API_KEY: Optional[str] = ""
    OPENAI_API_KEY: Optional[str] = ""
    
    SECRET_KEY: str = "finshield-super-secret-jwt-key-2026"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 # 24 hours

    model_config = SettingsConfigDict(env_file=".env", extra="ignore")


settings = Settings()
