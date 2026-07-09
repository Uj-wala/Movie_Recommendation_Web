from collections import Counter
from datetime import datetime

from sqlalchemy.orm import Session

from app.models.collection import Collection
from app.models.favorite import Favorite
from app.models.omdb_review import OmdbReview
from app.models.omdb_watchlist import OmdbWatchlist
from app.models.watched import WatchedMovie
from app.services import history_service

_MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
           "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]


def get_dashboard_statistics(db: Session, user_id: str) -> dict:
    """Six headline counts for the stats cards. Sourced from the live OMDb
    activity tables (watched/watchlist/reviews) plus catalog favorites."""
    return {
        "watched_count": db.query(WatchedMovie).filter(WatchedMovie.user_id == user_id).count(),
        "favorites_count": db.query(Favorite).filter(Favorite.user_id == user_id).count(),
        "watchlist_count": db.query(OmdbWatchlist).filter(OmdbWatchlist.user_id == user_id).count(),
        "reviews_count": db.query(OmdbReview).filter(OmdbReview.user_id == user_id).count(),
        "collections_count": db.query(Collection).filter(Collection.user_id == user_id).count(),
        "total_searches": history_service.count_searches(db, user_id),
    }


def get_top_genres(db: Session, user_id: str, limit: int = 5) -> list[dict]:
    """Top genres across watched movies. WatchedMovie.genre is a comma-separated
    OMDb string (e.g. "Action, Sci-Fi"), so split and tally in Python."""
    rows = db.query(WatchedMovie.genre).filter(WatchedMovie.user_id == user_id).all()
    counter: Counter = Counter()
    for (genre,) in rows:
        for part in (genre or "").split(","):
            part = part.strip()
            if part and part != "N/A":
                counter[part] += 1
    return [{"genre": g, "count": n} for g, n in counter.most_common(limit)]


def get_monthly_activity(db: Session, user_id: str, months: int = 6) -> list[dict]:
    """Watched counts for the last `months` calendar months, oldest first,
    including months with zero activity."""
    rows = db.query(WatchedMovie.watched_at).filter(WatchedMovie.user_id == user_id).all()
    counts: Counter = Counter()
    for (dt,) in rows:
        if dt:
            counts[(dt.year, dt.month)] += 1

    today = datetime.utcnow()
    y, m = today.year, today.month
    window: list[tuple[int, int]] = []
    for _ in range(months):
        window.append((y, m))
        m -= 1
        if m == 0:
            m, y = 12, y - 1
    window.reverse()
    return [{"month": _MONTHS[mm - 1], "count": counts.get((yy, mm), 0)} for yy, mm in window]


def get_recent_activity(db: Session, user_id: str, limit: int = 5) -> dict:
    watched = (
        db.query(WatchedMovie)
        .filter(WatchedMovie.user_id == user_id)
        .order_by(WatchedMovie.watched_at.desc())
        .limit(limit)
        .all()
    )
    favorites = (
        db.query(Favorite)
        .filter(Favorite.user_id == user_id)
        .order_by(Favorite.created_at.desc())
        .limit(limit)
        .all()
    )
    reviews = (
        db.query(OmdbReview)
        .filter(OmdbReview.user_id == user_id)
        .order_by(OmdbReview.created_at.desc())
        .limit(limit)
        .all()
    )
    return {
        "recent_watched": [
            {"title": w.movie_title, "poster": w.poster, "watched_date": w.watched_at}
            for w in watched
        ],
        "recent_favorites": [
            {"title": f.movie.title, "poster": f.movie.poster_url}
            for f in favorites
            if f.movie is not None
        ],
        "recent_reviews": [
            {"movie_title": r.movie_title, "rating": r.rating, "created_at": r.created_at}
            for r in reviews
        ],
    }
