from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.dependencies import get_current_user
from app.models.user import User
from app.schemas.recommendation import (
    GenrePreference,
    RecommendationResponse,
)
from app.services import preference_service, recommendation_service

router = APIRouter(tags=["recommendations"])


@router.get("/recommendations", response_model=RecommendationResponse)
def get_recommendations(db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    """Personalized recommendations from the user's searches and views (max 10)."""
    return RecommendationResponse(recommended_movies=recommendation_service.generate(db, user.id))


@router.get("/preferences", response_model=list[GenrePreference])
def get_preferences(db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    """The user's genre preference scores, highest first."""
    return [
        GenrePreference(genre=p.genre, score=round(p.preference_score, 1))
        for p in preference_service.list_preferences(db, user.id)
    ]
