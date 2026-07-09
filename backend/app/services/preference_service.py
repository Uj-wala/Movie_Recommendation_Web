from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.models.user_preference import UserPreference


def bump_genres(db: Session, user_id: str, genre_string: str | None, weight: float = 1.0) -> None:
    """Increase preference scores for each genre in a comma-separated string
    (e.g. "Action, Sci-Fi"). Best-effort; never raises into the caller."""
    if not genre_string:
        return
    genres = [g.strip() for g in genre_string.split(",") if g.strip() and g.strip() != "N/A"]
    if not genres:
        return
    try:
        for genre in genres:
            pref = (
                db.query(UserPreference)
                .filter(UserPreference.user_id == user_id, UserPreference.genre == genre)
                .first()
            )
            if pref:
                pref.preference_score += weight
            else:
                db.add(UserPreference(user_id=user_id, genre=genre, preference_score=weight))
        db.commit()
    except Exception:
        db.rollback()


def add_preference(db: Session, user_id: str, genre: str) -> UserPreference:
    """Add a manual genre preference for the user. 409 if it already exists."""
    genre = genre.strip()
    exists = (
        db.query(UserPreference)
        .filter(UserPreference.user_id == user_id, UserPreference.genre == genre)
        .first()
    )
    if exists:
        raise HTTPException(status.HTTP_409_CONFLICT, "Genre already exists")
    pref = UserPreference(user_id=user_id, genre=genre, preference_score=1.0)
    db.add(pref)
    db.commit()
    db.refresh(pref)
    return pref


def remove_preference(db: Session, user_id: str, preference_id: str) -> None:
    pref = (
        db.query(UserPreference)
        .filter(UserPreference.id == preference_id, UserPreference.user_id == user_id)
        .first()
    )
    if not pref:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Preference not found")
    db.delete(pref)
    db.commit()


def list_preferences(db: Session, user_id: str) -> list[UserPreference]:
    return (
        db.query(UserPreference)
        .filter(UserPreference.user_id == user_id)
        .order_by(UserPreference.preference_score.desc())
        .all()
    )


def top_genres(db: Session, user_id: str, limit: int = 3) -> list[str]:
    return [p.genre for p in list_preferences(db, user_id)[:limit]]
