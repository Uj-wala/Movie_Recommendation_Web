from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.dependencies import get_current_user
from app.models.user import User
from app.schemas.dashboard import (
    DashboardStatsResponse,
    GenreCount,
    MonthlyCount,
    RecentActivityResponse,
)
from app.services import dashboard_service as svc

router = APIRouter(prefix="/dashboard", tags=["dashboard"])


@router.get("", response_model=DashboardStatsResponse)
def get_dashboard(db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    """Headline statistics for the authenticated user's analytics dashboard."""
    return svc.get_dashboard_statistics(db, user.id)


@router.get("/genres", response_model=list[GenreCount])
def get_genres(db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    """Top 5 genres across the user's watched movies."""
    return svc.get_top_genres(db, user.id)


@router.get("/monthly", response_model=list[MonthlyCount])
def get_monthly(db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    """Movies watched per month over the last six months."""
    return svc.get_monthly_activity(db, user.id)


@router.get("/recent", response_model=RecentActivityResponse)
def get_recent(db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    """Recently watched movies, favorites, and reviews."""
    return svc.get_recent_activity(db, user.id)
