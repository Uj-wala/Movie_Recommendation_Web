from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.dependencies import get_current_user
from app.models.user import User
from app.schemas.omdb_review import (
    MovieRatingSummary,
    OmdbReviewCreate,
    OmdbReviewPage,
    OmdbReviewResponse,
    OmdbReviewUpdate,
)
from app.services import omdb_review_service as svc

# Mounted at /movie-reviews so the existing catalog /reviews keeps working.
router = APIRouter(prefix="/movie-reviews", tags=["movie-reviews"])


@router.post("", response_model=OmdbReviewResponse, status_code=201)
def create_review(
    data: OmdbReviewCreate,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    """Add a review (rating 1-5) for an OMDb movie. 409 if already reviewed."""
    return svc.to_response(svc.create(db, user, data))


@router.get("/{imdb_id}", response_model=OmdbReviewPage)
def get_reviews(
    imdb_id: str,
    db: Session = Depends(get_db),
    page: int = Query(1, ge=1),
    limit: int = Query(10, ge=1, le=50),
):
    """Paginated reviews for a movie, newest first."""
    rows, total = svc.list_for_movie(db, imdb_id, page, limit)
    return OmdbReviewPage(
        page=page, limit=limit, total=total, data=[svc.to_response(r) for r in rows]
    )


@router.get("/{imdb_id}/rating", response_model=MovieRatingSummary)
def movie_rating(imdb_id: str, db: Session = Depends(get_db)):
    """Average rating and review count for a movie."""
    return svc.rating_summary(db, imdb_id)


@router.put("/{review_id}", response_model=OmdbReviewResponse)
def update_review(
    review_id: str,
    data: OmdbReviewUpdate,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    """Update your own review. 403 if not the owner, 404 if missing."""
    return svc.to_response(svc.update(db, review_id, user, data))


@router.delete("/{review_id}")
def delete_review(
    review_id: str,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    """Delete your own review. 403 if not the owner."""
    svc.delete(db, review_id, user)
    return {"message": "Review deleted successfully"}
