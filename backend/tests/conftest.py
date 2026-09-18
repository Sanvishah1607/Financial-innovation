# FinGuard Test Configuration & Database Isolation Fixture
# Runs all pytest suites against an isolated local SQLite database to prevent
# polluting the live Supabase production database.

import os
import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.db.session import Base, get_db
import app.models.financial  # Register all models
from app.main import app

TEST_DB_FILE = "./test_unit_suite.db"
TEST_DB_URL = f"sqlite:///{TEST_DB_FILE}"


@pytest.fixture(scope="session", autouse=True)
def setup_test_database():
    """Initializes a clean SQLite database for the test session and cleans it up afterward."""
    test_engine = create_engine(TEST_DB_URL, connect_args={"check_same_thread": False})
    Base.metadata.create_all(bind=test_engine)
    TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=test_engine)

    def override_get_db():
        db = TestingSessionLocal()
        try:
            yield db
        finally:
            db.close()

    # Override application dependency
    app.dependency_overrides[get_db] = override_get_db

    yield

    # Teardown
    Base.metadata.drop_all(bind=test_engine)
    if os.path.exists(TEST_DB_FILE):
        try:
            os.remove(TEST_DB_FILE)
        except OSError:
            pass
