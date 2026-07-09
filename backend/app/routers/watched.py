from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.dependencies import get_current_user
from app.models.user import User
from app.schemas.watched import WatchedCreate, WatchedResponse, WatchStatusResponse
from app.services import watched_service as svc

router = APIRouter(prefix="/watched", tags=["watched"])


@router.post("", response_model=WatchedResponse, status_code=201)
def mark_watched(
    data: WatchedCreate,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    """Mark a movie as watched. Removes it from the watchlist; 409 if already watched."""
    return svc.mark_as_watched(db, user.id, data)


@router.get("", response_model=list[WatchedResponse])
def watched_history(db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    """The authenticated user's watched history, newest first."""
    return svc.get_watched_movies(db, user.id)


@router.get("/status/{movie_id}", response_model=WatchStatusResponse)
def watch_status(
    movie_id: str,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    """Whether the given movie is in the user's watched history."""
    return WatchStatusResponse(is_watched=svc.get_watch_status(db, user.id, movie_id))


@router.delete("/{movie_id}")
def remove_watched(
    movie_id: str,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    """Remove a movie from watched history."""
    svc.remove_watched_movie(db, user.id, movie_id)
    return {"message": "Movie removed from watched history successfully"}


@router.post("/{movie_id}/move-to-watchlist")
def move_to_watchlist(
    movie_id: str,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    """Optional: move a watched movie back to the watchlist."""
    svc.move_back_to_watchlist(db, user.id, movie_id)
    return {"message": "Movie moved back to watchlist successfully"}
