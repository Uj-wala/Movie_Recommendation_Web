from sqlalchemy.orm import Session

from app.models.recently_viewed import RecentlyViewed
from app.services import preference_service


def record_view(db: Session, user_id: str, imdb_id: str, movie_title: str, genre: str | None) -> None:
    """Log a movie view and bump genre preferences. Skips consecutive duplicates."""
    try:
        last = (
            db.query(RecentlyViewed.imdb_id)
            .filter(RecentlyViewed.user_id == user_id)
            .order_by(RecentlyViewed.viewed_at.desc())
            .first()
        )
        if not last or last[0] != imdb_id:
            db.add(RecentlyViewed(user_id=user_id, imdb_id=imdb_id, movie_title=movie_title))
            db.commit()
    except Exception:
        db.rollback()
    # Viewing signals genre interest.
    preference_service.bump_genres(db, user_id, genre, weight=1.0)


def list_recent(db: Session, user_id: str, limit: int = 10) -> list[RecentlyViewed]:
    return (
        db.query(RecentlyViewed)
        .filter(RecentlyViewed.user_id == user_id)
        .order_by(RecentlyViewed.viewed_at.desc())
        .limit(limit)
        .all()
    )


def viewed_imdb_ids(db: Session, user_id: str) -> set[str]:
    rows = db.query(RecentlyViewed.imdb_id).filter(RecentlyViewed.user_id == user_id).all()
    return {r[0] for r in rows}


def recent_titles(db: Session, user_id: str, limit: int = 3) -> list[str]:
    return [r.movie_title for r in list_recent(db, user_id, limit)]
