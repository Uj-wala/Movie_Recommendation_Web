from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.models.omdb_watchlist import OmdbWatchlist
from app.schemas.omdb_watchlist import OmdbWatchlistCreate


def add(db: Session, user_id: str, data: OmdbWatchlistCreate) -> OmdbWatchlist:
    exists = (
        db.query(OmdbWatchlist)
        .filter(OmdbWatchlist.user_id == user_id, OmdbWatchlist.movie_id == data.movie_id)
        .first()
    )
    if exists:
        raise HTTPException(status.HTTP_409_CONFLICT, "Movie already exists in your watchlist")
    item = OmdbWatchlist(user_id=user_id, **data.model_dump())
    db.add(item)
    db.commit()
    db.refresh(item)
    return item


def list_items(db: Session, user_id: str) -> list[OmdbWatchlist]:
    return (
        db.query(OmdbWatchlist)
        .filter(OmdbWatchlist.user_id == user_id)
        .order_by(OmdbWatchlist.created_at.desc())
        .all()
    )


def remove(db: Session, user_id: str, movie_id: str) -> None:
    item = (
        db.query(OmdbWatchlist)
        .filter(OmdbWatchlist.user_id == user_id, OmdbWatchlist.movie_id == movie_id)
        .first()
    )
    if not item:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Movie not found in your watchlist")
    db.delete(item)
    db.commit()
