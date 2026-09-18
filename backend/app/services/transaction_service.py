# FinShield Transaction Service Layer
# Enforces strict user isolation, Decimal amounts, filtering, and pagination

from decimal import Decimal
from datetime import date
from typing import Optional, List, Tuple
from sqlalchemy.orm import Session
from sqlalchemy import func
from fastapi import HTTPException, status

from app.models.financial import Transaction
from app.schemas.transaction import TransactionCreate, TransactionUpdate


class TransactionService:
    @staticmethod
    def create_transaction(db: Session, user_id: str, data: TransactionCreate) -> Transaction:
        """Create a new income or expense transaction strictly tied to the authenticated user."""
        transaction = Transaction(
            user_id=user_id,
            title=data.title.strip(),
            amount=data.amount,
            type=data.type,
            category=data.category.strip(),
            transaction_date=data.transaction_date,
            description=data.description.strip() if data.description else None,
            is_recurring=data.is_recurring,
        )
        db.add(transaction)
        db.commit()
        db.refresh(transaction)
        return transaction

    @staticmethod
    def get_transaction(db: Session, user_id: str, transaction_id: str) -> Transaction:
        """Fetch a specific transaction with strict ownership verification."""
        tx = db.query(Transaction).filter(
            Transaction.id == transaction_id,
            Transaction.user_id == user_id,
        ).first()
        if not tx:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Transaction not found or access unauthorized",
            )
        return tx

    @staticmethod
    def list_transactions(
        db: Session,
        user_id: str,
        category: Optional[str] = None,
        tx_type: Optional[str] = None,
        start_date: Optional[date] = None,
        end_date: Optional[date] = None,
        search: Optional[str] = None,
        page: int = 1,
        page_size: int = 20,
    ) -> Tuple[List[Transaction], int]:
        """List transactions for authenticated user with multi-field filtering and pagination."""
        query = db.query(Transaction).filter(Transaction.user_id == user_id)

        if category:
            query = query.filter(func.lower(Transaction.category) == category.strip().lower())
        if tx_type:
            query = query.filter(Transaction.type == tx_type.strip().lower())
        if start_date:
            query = query.filter(Transaction.transaction_date >= start_date)
        if end_date:
            query = query.filter(Transaction.transaction_date <= end_date)
        if search:
            search_filter = f"%{search.strip().lower()}%"
            query = query.filter(
                func.lower(Transaction.title).like(search_filter)
                | func.lower(Transaction.description).like(search_filter)
            )

        total = query.count()
        items = (
            query.order_by(Transaction.transaction_date.desc(), Transaction.created_at.desc())
            .offset((page - 1) * page_size)
            .limit(page_size)
            .all()
        )
        return items, total

    @staticmethod
    def update_transaction(
        db: Session, user_id: str, transaction_id: str, data: TransactionUpdate
    ) -> Transaction:
        """Update transaction fields with ownership protection."""
        tx = TransactionService.get_transaction(db, user_id, transaction_id)

        if data.title is not None:
            tx.title = data.title.strip()
        if data.amount is not None:
            tx.amount = data.amount
        if data.type is not None:
            tx.type = data.type
        if data.category is not None:
            tx.category = data.category.strip()
        if data.transaction_date is not None:
            tx.transaction_date = data.transaction_date
        if data.description is not None:
            tx.description = data.description.strip()
        if data.is_recurring is not None:
            tx.is_recurring = data.is_recurring

        db.commit()
        db.refresh(tx)
        return tx

    @staticmethod
    def delete_transaction(db: Session, user_id: str, transaction_id: str) -> None:
        """Permanently delete a transaction belonging to the authenticated user."""
        tx = TransactionService.get_transaction(db, user_id, transaction_id)
        db.delete(tx)
        db.commit()
