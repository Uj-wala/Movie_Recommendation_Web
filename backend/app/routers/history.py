from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.dependencies import get_current_user
from app.models.user import User
from app.schemas.history import SearchHistoryResponse, TrendingSearch
from app.services import history_service

router = APIRouter(prefix="/history", tags=["history"])


@router.get("", response_model=list[SearchHistoryResponse])
def get_history(
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
    limit: int = Query(10, ge=1, le=50),
):
    """Return the logged-in user's most recent searches, newest first (default 10)."""
    return history_service.list_history(db, user.id, limit)


@router.get("/trending", response_model=list[TrendingSearch])
def trending_searches(
    db: Session = Depends(get_db),
    limit: int = Query(10, ge=1, le=50),
    _: User = Depends(get_current_user),
):
    """Most frequently searched keywords across all users."""
    return history_service.trending(db, limit)


@router.delete("")
def clear_history(db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    """Delete all of the logged-in user's search history."""
    count = history_service.clear_history(db, user.id)
    return {"message": f"Cleared {count} search history records"}
