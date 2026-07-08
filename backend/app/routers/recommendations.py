from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.dependencies import get_current_user
from app.models.user import User
from app.core.enums import NotificationType
from app.schemas.recommendation import (
    GenrePreference,
    RecommendationResponse,
)
from app.services import notification_service, preference_service, recommendation_service

router = APIRouter(tags=["recommendations"])


@router.get("/recommendations", response_model=RecommendationResponse)
def get_recommendations(db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    """Personalized recommendations from the user's searches and views (max 10)."""
    movies = recommendation_service.generate(db, user.id)
    if movies:
        # Notify once (deduped) that fresh recommendations are available.
        notification_service.create(
            db,
            user.id,
            NotificationType.RECOMMENDATION,
            "New recommendations for you",
            "We found movies we think you'll like based on your activity.",
            dedupe_unread=True,
        )
    return RecommendationResponse(recommended_movies=movies)


@router.get("/preferences", response_model=list[GenrePreference])
def get_preferences(db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    """The user's genre preference scores, highest first."""
    return [
        GenrePreference(genre=p.genre, score=round(p.preference_score, 1))
        for p in preference_service.list_preferences(db, user.id)
    ]
