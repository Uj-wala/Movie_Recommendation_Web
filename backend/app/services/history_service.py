from sqlalchemy import func
from sqlalchemy.orm import Session

from app.models.search_history import SearchHistory


def record_search(db: Session, user_id: str, keyword: str) -> None:
    """Best-effort log of a user's search. Never raises into the search request."""
    keyword = (keyword or "").strip()
    if not keyword:
        return
    try:
        db.add(SearchHistory(user_id=user_id, keyword=keyword))
        db.commit()
    except Exception:
        db.rollback()


def list_history(db: Session, user_id: str) -> list[SearchHistory]:
    return (
        db.query(SearchHistory)
        .filter(SearchHistory.user_id == user_id)
        .order_by(SearchHistory.searched_at.desc())
        .all()
    )


def clear_history(db: Session, user_id: str) -> int:
    deleted = (
        db.query(SearchHistory).filter(SearchHistory.user_id == user_id).delete()
    )
    db.commit()
    return deleted


def trending(db: Session, limit: int = 10) -> list[dict]:
    rows = (
        db.query(SearchHistory.keyword, func.count().label("count"))
        .group_by(SearchHistory.keyword)
        .order_by(func.count().desc())
        .limit(limit)
        .all()
    )
    return [{"keyword": k, "count": c} for k, c in rows]
