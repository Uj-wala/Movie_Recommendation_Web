from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.dependencies import get_current_user
from app.models.movie import Movie
from app.models.review import Review
from app.models.user import User
from app.schemas.movie import ReviewCreate, ReviewOut, ReviewUpdate

router = APIRouter(prefix="/reviews", tags=["reviews"])


def _out(review: Review) -> ReviewOut:
    data = ReviewOut.model_validate(review)
    data.user_name = review.user.full_name if review.user else None
    return data


@router.get("/mine", response_model=list[ReviewOut])
def my_reviews(db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    reviews = (
        db.query(Review)
        .filter(Review.user_id == user.id)
        .order_by(Review.created_at.desc())
        .all()
    )
    return [_out(r) for r in reviews]


@router.get("/movie/{movie_id}", response_model=list[ReviewOut])
def movie_reviews(movie_id: str, db: Session = Depends(get_db)):
    reviews = (
        db.query(Review)
        .filter(Review.movie_id == movie_id)
        .order_by(Review.created_at.desc())
        .all()
    )
    return [_out(r) for r in reviews]


@router.post("", response_model=ReviewOut, status_code=201)
def create_review(
    data: ReviewCreate, db: Session = Depends(get_db), user: User = Depends(get_current_user)
):
    if not 1 <= data.rating <= 10:
        raise HTTPException(400, "Rating must be between 1 and 10")
    if not db.query(Movie).filter(Movie.id == data.movie_id).first():
        raise HTTPException(404, "Movie not found")
    if db.query(Review).filter(Review.user_id == user.id, Review.movie_id == data.movie_id).first():
        raise HTTPException(409, "You already reviewed this movie")
    review = Review(
        user_id=user.id, movie_id=data.movie_id, rating=data.rating, comment=data.comment
    )
    db.add(review)
    db.commit()
    db.refresh(review)
    return _out(review)


@router.put("/{review_id}", response_model=ReviewOut)
def update_review(
    review_id: str,
    data: ReviewUpdate,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    review = db.query(Review).filter(Review.id == review_id).first()
    if not review:
        raise HTTPException(404, "Review not found")
    if review.user_id != user.id:
        raise HTTPException(403, "Not your review")
    if data.rating is not None:
        if not 1 <= data.rating <= 10:
            raise HTTPException(400, "Rating must be between 1 and 10")
        review.rating = data.rating
    if data.comment is not None:
        review.comment = data.comment
    db.commit()
    db.refresh(review)
    return _out(review)


@router.delete("/{review_id}", status_code=204)
def delete_review(
    review_id: str, db: Session = Depends(get_db), user: User = Depends(get_current_user)
):
    review = db.query(Review).filter(Review.id == review_id).first()
    if not review:
        raise HTTPException(404, "Review not found")
    if review.user_id != user.id and not user.is_admin:
        raise HTTPException(403, "Not allowed")
    db.delete(review)
    db.commit()
