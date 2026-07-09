from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.models.omdb_watchlist import OmdbWatchlist
from app.models.watched import WatchedMovie
from app.schemas.watched import WatchedCreate


def mark_as_watched(db: Session, user_id: str, data: WatchedCreate) -> WatchedMovie:
    """Save a watched record and remove the movie from the watchlist if present.
    409 if the movie is already in the user's watched history."""
    exists = (
        db.query(WatchedMovie)
        .filter(WatchedMovie.user_id == user_id, WatchedMovie.movie_id == data.movie_id)
        .first()
    )
    if exists:
        raise HTTPException(status.HTTP_409_CONFLICT, "Movie already exists in watched history")

    # Automatic watchlist management: one action, one API call from the client.
    db.query(OmdbWatchlist).filter(
        OmdbWatchlist.user_id == user_id, OmdbWatchlist.movie_id == data.movie_id
    ).delete()

    item = WatchedMovie(user_id=user_id, **data.model_dump())
    db.add(item)
    db.commit()
    db.refresh(item)
    return item


def get_watched_movies(db: Session, user_id: str) -> list[WatchedMovie]:
    return (
        db.query(WatchedMovie)
        .filter(WatchedMovie.user_id == user_id)
        .order_by(WatchedMovie.watched_at.desc())
        .all()
    )


def remove_watched_movie(db: Session, user_id: str, movie_id: str) -> None:
    item = (
        db.query(WatchedMovie)
        .filter(WatchedMovie.user_id == user_id, WatchedMovie.movie_id == movie_id)
        .first()
    )
    if not item:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Movie not found in watched history")
    db.delete(item)
    db.commit()


def get_watch_status(db: Session, user_id: str, movie_id: str) -> bool:
    return (
        db.query(WatchedMovie.id)
        .filter(WatchedMovie.user_id == user_id, WatchedMovie.movie_id == movie_id)
        .first()
        is not None
    )


def move_back_to_watchlist(db: Session, user_id: str, movie_id: str) -> OmdbWatchlist:
    """Optional: remove from watched history and re-add to the watchlist."""
    watched = (
        db.query(WatchedMovie)
        .filter(WatchedMovie.user_id == user_id, WatchedMovie.movie_id == movie_id)
        .first()
    )
    if not watched:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Movie not found in watched history")

    already = (
        db.query(OmdbWatchlist)
        .filter(OmdbWatchlist.user_id == user_id, OmdbWatchlist.movie_id == movie_id)
        .first()
    )
    if not already:
        db.add(
            OmdbWatchlist(
                user_id=user_id,
                movie_id=watched.movie_id,
                movie_title=watched.movie_title,
                poster=watched.poster,
                genre=watched.genre,
            )
        )
    db.delete(watched)
    db.commit()
    return already or (
        db.query(OmdbWatchlist)
        .filter(OmdbWatchlist.user_id == user_id, OmdbWatchlist.movie_id == movie_id)
        .first()
    )
