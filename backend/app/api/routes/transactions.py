# FinShield Transactions API Router
# Protected CRUD endpoints with filtering, search, and pagination

from decimal import Decimal
from datetime import date
from typing import Optional
from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.core.security import get_current_user_id
from app.services.transaction_service import TransactionService
from app.schemas.transaction import (
    TransactionCreate,
    TransactionUpdate,
    TransactionOut,
    PaginatedTransactions,
)

router = APIRouter()


@router.get("", response_model=PaginatedTransactions, summary="List user transactions")
def list_user_transactions(
    category: Optional[str] = Query(None, description="Filter by category (e.g. Needs, Wants)"),
    type: Optional[str] = Query(None, description="Filter by type: 'income' or 'expense'"),
    start_date: Optional[date] = Query(None, description="Filter from date (YYYY-MM-DD)"),
    end_date: Optional[date] = Query(None, description="Filter to date (YYYY-MM-DD)"),
    search: Optional[str] = Query(None, description="Search term in title or description"),
    page: int = Query(1, ge=1, description="Page number"),
    page_size: int = Query(20, ge=1, le=100, description="Items per page"),
    user_id: str = Depends(get_current_user_id),
    db: Session = Depends(get_db),
):
    """Retrieve paginated transactions with optional multi-parameter filtering."""
    items, total = TransactionService.list_transactions(
        db=db,
        user_id=user_id,
        category=category,
        tx_type=type,
        start_date=start_date,
        end_date=end_date,
        search=search,
        page=page,
        page_size=page_size,
    )
    total_pages = (total + page_size - 1) // page_size if total > 0 else 1
    return PaginatedTransactions(
        items=items,
        total=total,
        page=page,
        page_size=page_size,
        total_pages=total_pages,
    )


@router.post("", response_model=TransactionOut, status_code=status.HTTP_201_CREATED, summary="Create transaction")
def create_user_transaction(
    data: TransactionCreate,
    user_id: str = Depends(get_current_user_id),
    db: Session = Depends(get_db),
):
    """Record a new income or expense transaction."""
    return TransactionService.create_transaction(db=db, user_id=user_id, data=data)


@router.get("/{transaction_id}", response_model=TransactionOut, summary="Get transaction details")
def get_transaction_by_id(
    transaction_id: str,
    user_id: str = Depends(get_current_user_id),
    db: Session = Depends(get_db),
):
    """Fetch details of a specific transaction owned by the user."""
    return TransactionService.get_transaction(db=db, user_id=user_id, transaction_id=transaction_id)


@router.put("/{transaction_id}", response_model=TransactionOut, summary="Update transaction")
def update_user_transaction(
    transaction_id: str,
    data: TransactionUpdate,
    user_id: str = Depends(get_current_user_id),
    db: Session = Depends(get_db),
):
    """Update an existing transaction."""
    return TransactionService.update_transaction(db=db, user_id=user_id, transaction_id=transaction_id, data=data)


@router.delete("/{transaction_id}", status_code=status.HTTP_204_NO_CONTENT, summary="Delete transaction")
def delete_user_transaction(
    transaction_id: str,
    user_id: str = Depends(get_current_user_id),
    db: Session = Depends(get_db),
):
    """Permanently remove a transaction."""
    TransactionService.delete_transaction(db=db, user_id=user_id, transaction_id=transaction_id)
    return None
