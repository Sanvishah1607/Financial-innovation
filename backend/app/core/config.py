# FinGuard Backend Configuration
# Uses pydantic-settings to safely load settings from environment variables

from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import List


class Settings(BaseSettings):
    PROJECT_NAME: str = "FinGuard API"
    VERSION: str = "1.0.0"
    ENVIRONMENT: str = "development"
    DEBUG: bool = True
    
    # CORS Origins (React Vite Frontend)
    CORS_ORIGINS: List[str] = [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ]
    
    # Supabase placeholders (TODO: Fill when database is connected)
    SUPABASE_URL: str = ""
    SUPABASE_KEY: str = ""
    
    # Security placeholders
    SECRET_KEY: str = "default-development-secret-key"
    ALGORITHM: str = "HS256"

    model_config = SettingsConfigDict(env_file=".env", extra="ignore")


settings = Settings()
