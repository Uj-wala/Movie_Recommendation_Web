from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.dependencies import get_current_user
from app.models.user import User
from app.schemas.recently_viewed import RecentlyViewedCreate, RecentlyViewedResponse
from app.services import recently_viewed_service

router = APIRouter(prefix="/recently-viewed", tags=["recently-viewed"])


@router.post("", status_code=201)
def add_view(
    data: RecentlyViewedCreate,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    """Record that the user opened a movie's details (also bumps genre prefs)."""
    recently_viewed_service.record_view(db, user.id, data.imdb_id, data.movie_title, data.genre)
    return {"message": "View recorded"}


@router.get("", response_model=list[RecentlyViewedResponse])
def list_views(db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    """The user's recently viewed movies, newest first."""
    return recently_viewed_service.list_recent(db, user.id)
