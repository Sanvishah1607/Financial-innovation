# FinShield Database Session & Connection Manager
# Handles SQLAlchemy ORM Engine for SQLite (local dev) and Supabase PostgreSQL

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from app.core.config import settings

# Normalize connection string for SQLAlchemy (PostgreSQL / SQLite)
db_url = settings.DATABASE_URL
if db_url.startswith("postgres://"):
    db_url = db_url.replace("postgres://", "postgresql+psycopg2://", 1)
elif db_url.startswith("postgresql://") and not db_url.startswith("postgresql+"):
    db_url = db_url.replace("postgresql://", "postgresql+psycopg2://", 1)

# Configure connection args based on database engine
connect_args = {}
if db_url.startswith("sqlite"):
    connect_args = {"check_same_thread": False}

# Create engine with connection pooling
engine = create_engine(
    db_url,
    connect_args=connect_args,
    pool_pre_ping=True,
)

# Session factory for handling requests
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Declarative Base for ORM Models
Base = declarative_base()


def get_db():
    """FastAPI dependency that provides a transactional database session per request."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
