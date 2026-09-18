# FinShield Core Financial ORM Models
# Built for Supabase PostgreSQL with local SQLite fallback
# All monetary fields use Numeric(10, 2) to maintain exact Decimal precision

import uuid
from datetime import datetime, date
from decimal import Decimal
from sqlalchemy import (
    Column,
    String,
    Numeric,
    Boolean,
    Date,
    DateTime,
    Integer,
    ForeignKey,
    Text,
    Index,
    Uuid,
)
from sqlalchemy.orm import relationship
from app.db.session import Base


def generate_uuid() -> str:
    """Helper to generate standard UUID strings for cross-database compatibility."""
    return str(uuid.uuid4())


class User(Base):
    """User profile mapped to Supabase Auth user ID."""
    __tablename__ = "profiles"

    id = Column(Uuid(as_uuid=False), primary_key=True, default=generate_uuid)
    email = Column(String(255), unique=True, index=True, nullable=False)
    full_name = Column(String(150), default="FinShield User")
    monthly_income = Column(Numeric(10, 2), default=Decimal("35000.00"), nullable=False)
    currency = Column(String(10), default="INR (₹)", nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    transactions = relationship("Transaction", back_populates="user", cascade="all, delete-orphan")
    budgets = relationship("Budget", back_populates="user", cascade="all, delete-orphan")
    savings_goals = relationship("SavingsGoal", back_populates="user", cascade="all, delete-orphan")


class Transaction(Base):
    """User transactions for income, expense tracking, and anomaly detection."""
    __tablename__ = "transactions"

    id = Column(Uuid(as_uuid=False), primary_key=True, default=generate_uuid)
    user_id = Column(Uuid(as_uuid=False), ForeignKey("profiles.id", ondelete="CASCADE"), nullable=False, index=True)
    title = Column(String(120), nullable=False)
    amount = Column(Numeric(10, 2), nullable=False)
    type = Column(String(20), default="expense", nullable=False)  # 'income' or 'expense'
    category = Column(String(50), nullable=False)  # 'Needs', 'Wants', 'Savings', 'Income'
    transaction_date = Column(Date, default=date.today, nullable=False, index=True)
    description = Column(Text, nullable=True)
    is_recurring = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="transactions")

    __table_args__ = (
        Index("ix_transactions_user_date", "user_id", "transaction_date"),
        Index("ix_transactions_user_category", "user_id", "category"),
    )


class Budget(Base):
    """Monthly spending budgets per user and category."""
    __tablename__ = "budgets"

    id = Column(Uuid(as_uuid=False), primary_key=True, default=generate_uuid)
    user_id = Column(Uuid(as_uuid=False), ForeignKey("profiles.id", ondelete="CASCADE"), nullable=False, index=True)
    category = Column(String(50), nullable=False)  # 'Needs', 'Wants', 'Overall', etc.
    month_year = Column(String(7), nullable=False, index=True)  # Format: 'YYYY-MM'
    monthly_limit = Column(Numeric(10, 2), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="budgets")

    __table_args__ = (
        Index("ix_budgets_user_month_cat", "user_id", "month_year", "category", unique=True),
    )


class SavingsGoal(Base):
    """Financial savings targets set by users."""
    __tablename__ = "savings_goals"

    id = Column(Uuid(as_uuid=False), primary_key=True, default=generate_uuid)
    user_id = Column(Uuid(as_uuid=False), ForeignKey("profiles.id", ondelete="CASCADE"), nullable=False, index=True)
    goal_name = Column(String(120), nullable=False)
    target_amount = Column(Numeric(10, 2), nullable=False)
    current_amount = Column(Numeric(10, 2), default=Decimal("0.00"), nullable=False)
    target_months = Column(Integer, default=12, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="savings_goals")
    contributions = relationship("SavingsContribution", back_populates="goal", cascade="all, delete-orphan")


class SavingsContribution(Base):
    """Individual monetary deposits made toward a specific savings goal."""
    __tablename__ = "savings_contributions"

    id = Column(Uuid(as_uuid=False), primary_key=True, default=generate_uuid)
    goal_id = Column(Uuid(as_uuid=False), ForeignKey("savings_goals.id", ondelete="CASCADE"), nullable=False, index=True)
    user_id = Column(Uuid(as_uuid=False), ForeignKey("profiles.id", ondelete="CASCADE"), nullable=False, index=True)
    amount = Column(Numeric(10, 2), nullable=False)
    note = Column(String(255), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    goal = relationship("SavingsGoal", back_populates="contributions")
