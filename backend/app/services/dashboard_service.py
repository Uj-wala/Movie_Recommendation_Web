from sqlalchemy.orm import Session

from app.models.favorite import Favorite
from app.services import history_service


def count_favorites(db: Session, user_id: str) -> int:
    return db.query(Favorite).filter(Favorite.user_id == user_id).count()


def get_dashboard(db: Session, user_id: str) -> dict:
    """Personalized stats for the logged-in user."""
    return {
        "total_favorites": count_favorites(db, user_id),
        "total_searches": history_service.count_searches(db, user_id),
        "recent_searches": history_service.recent_keywords(db, user_id, limit=3),
    }
