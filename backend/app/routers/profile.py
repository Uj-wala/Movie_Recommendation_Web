from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.dependencies import get_current_user
from app.models.collection import Collection
from app.models.favorite import Favorite, Watchlist
from app.models.genre import Genre
from app.models.review import Review
from app.models.user import User
from app.models.watched import WatchedMovie
from app.schemas.user import ProfileOut, ProfileUpdate, StatsResponse

router = APIRouter(tags=["profile"])


def _stats(db: Session, user_id: str) -> StatsResponse:
    return StatsResponse(
        watched_count=db.query(WatchedMovie).filter(WatchedMovie.user_id == user_id).count(),
        favorites_count=db.query(Favorite).filter(Favorite.user_id == user_id).count(),
        watchlist_count=db.query(Watchlist).filter(Watchlist.user_id == user_id).count(),
        reviews_count=db.query(Review).filter(Review.user_id == user_id).count(),
        collections_count=db.query(Collection).filter(Collection.user_id == user_id).count(),
    )


def _profile_out(db: Session, user: User) -> ProfileOut:
    out = ProfileOut.model_validate(user)
    stats = _stats(db, user.id)
    out.favorites_count = stats.favorites_count
    out.watchlist_count = stats.watchlist_count
    out.reviews_count = stats.reviews_count
    out.watched_count = stats.watched_count
    out.collections_count = stats.collections_count
    return out


@router.get("/profile", response_model=ProfileOut)
def get_profile(db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    return _profile_out(db, user)


@router.get("/profile/stats", response_model=StatsResponse)
def get_profile_stats(db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    """Activity counts for the profile dashboard, computed on demand."""
    return _stats(db, user.id)


@router.put("/profile", response_model=ProfileOut)
def update_profile(
    data: ProfileUpdate, db: Session = Depends(get_db), user: User = Depends(get_current_user)
):
    fields = data.model_dump(exclude_unset=True)
    genre_slugs = fields.pop("favorite_genres", None)
    for key, value in fields.items():
        setattr(user, key, value)
    if genre_slugs is not None:
        user.favorite_genres = db.query(Genre).filter(Genre.slug.in_(genre_slugs)).all()
    db.commit()
    db.refresh(user)
    return _profile_out(db, user)
