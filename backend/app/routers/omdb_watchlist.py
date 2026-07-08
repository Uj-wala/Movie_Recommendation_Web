from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.dependencies import get_current_user
from app.models.user import User
from app.schemas.omdb_watchlist import OmdbWatchlistCreate, OmdbWatchlistResponse
from app.services import omdb_watchlist_service as svc

# Mounted at /omdb-watchlist so the existing catalog /watchlist keeps working.
router = APIRouter(prefix="/omdb-watchlist", tags=["omdb-watchlist"])


@router.post("", response_model=OmdbWatchlistResponse, status_code=201)
def add_to_watchlist(
    data: OmdbWatchlistCreate,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    """Add an OMDb movie to the watchlist. 409 if already present."""
    return svc.add(db, user.id, data)


@router.get("", response_model=list[OmdbWatchlistResponse])
def get_watchlist(db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    """The authenticated user's watchlist, newest first."""
    return svc.list_items(db, user.id)


@router.delete("/{movie_id}")
def remove_from_watchlist(
    movie_id: str,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    """Remove a movie from the watchlist by imdb id."""
    svc.remove(db, user.id, movie_id)
    return {"message": "Movie removed from watchlist successfully"}
