from fastapi import HTTPException, status
from sqlalchemy import func
from sqlalchemy.orm import Session

from app.models.omdb_review import OmdbReview
from app.models.user import User
from app.schemas.omdb_review import (
    OmdbReviewCreate,
    OmdbReviewResponse,
    OmdbReviewUpdate,
)


def to_response(r: OmdbReview) -> OmdbReviewResponse:
    return OmdbReviewResponse(
        id=r.id,
        user_name=r.user.full_name,
        movie_title=r.movie_title,
        imdb_id=r.imdb_id,
        rating=r.rating,
        review=r.review,
        created_at=r.created_at,
        updated_at=r.updated_at,
    )


def create(db: Session, user: User, data: OmdbReviewCreate) -> OmdbReview:
    exists = (
        db.query(OmdbReview)
        .filter(OmdbReview.user_id == user.id, OmdbReview.imdb_id == data.imdb_id)
        .first()
    )
    if exists:
        raise HTTPException(status.HTTP_409_CONFLICT, "You have already reviewed this movie")
    review = OmdbReview(
        user_id=user.id,
        imdb_id=data.imdb_id,
        movie_title=data.movie_title,
        rating=data.rating,
        review=data.review,
    )
    db.add(review)
    db.commit()
    db.refresh(review)
    return review


def list_for_movie(db: Session, imdb_id: str, page: int, limit: int) -> tuple[list[OmdbReview], int]:
    base = db.query(OmdbReview).filter(OmdbReview.imdb_id == imdb_id)
    total = base.count()
    rows = (
        base.order_by(OmdbReview.created_at.desc())
        .offset((page - 1) * limit)
        .limit(limit)
        .all()
    )
    return rows, total


def _get_owned(db: Session, review_id: str, user: User) -> OmdbReview:
    review = db.query(OmdbReview).filter(OmdbReview.id == review_id).first()
    if not review:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Review not found")
    if review.user_id != user.id:
        raise HTTPException(status.HTTP_403_FORBIDDEN, "You can only modify your own review")
    return review


def update(db: Session, review_id: str, user: User, data: OmdbReviewUpdate) -> OmdbReview:
    review = _get_owned(db, review_id, user)
    review.rating = data.rating
    review.review = data.review
    db.commit()
    db.refresh(review)
    return review


def delete(db: Session, review_id: str, user: User) -> None:
    review = _get_owned(db, review_id, user)
    db.delete(review)
    db.commit()


def rating_summary(db: Session, imdb_id: str) -> dict:
    avg, total = (
        db.query(func.avg(OmdbReview.rating), func.count(OmdbReview.id))
        .filter(OmdbReview.imdb_id == imdb_id)
        .one()
    )
    return {"average_rating": round(float(avg), 2) if avg else 0.0, "total_reviews": total}
