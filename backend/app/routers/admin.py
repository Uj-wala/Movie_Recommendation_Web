from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session, selectinload

from app.core.database import get_db
from app.core.dependencies import require_admin
from app.models.favorite import Favorite
from app.models.genre import Genre
from app.models.movie import Movie
from app.models.person import Actor, Director
from app.models.review import Review
from app.models.user import User
from app.schemas.movie import MovieCreate, MovieDetail, ReviewOut
from app.schemas.user import AdminStats, AdminUserOut
from app.services import history_service
from app.utils.slug import slugify

router = APIRouter(prefix="/admin", tags=["admin"], dependencies=[Depends(require_admin)])


@router.get("/stats", response_model=AdminStats)
def stats(db: Session = Depends(get_db)):
    top = history_service.trending(db, limit=1)
    return AdminStats(
        total_users=db.query(User).count(),
        total_movies=db.query(Movie).count(),
        total_reviews=db.query(Review).count(),
        total_favorites=db.query(Favorite).count(),
        total_genres=db.query(Genre).count(),
        total_actors=db.query(Actor).count(),
        total_directors=db.query(Director).count(),
        trending_movies=db.query(Movie).filter(Movie.is_trending == True).count(),  # noqa: E712
        most_searched_movie=top[0]["keyword"] if top else None,
    )


# ── Users ────────────────────────────────────────────────────────────────────
@router.get("/users", response_model=list[AdminUserOut])
def list_users(db: Session = Depends(get_db), search: str | None = None):
    q = db.query(User)
    if search:
        like = f"%{search}%"
        q = q.filter((User.full_name.ilike(like)) | (User.email.ilike(like)))
    return q.order_by(User.created_at.desc()).limit(200).all()


@router.post("/users/{user_id}/block", response_model=AdminUserOut)
def set_block(user_id: str, blocked: bool = True, db: Session = Depends(get_db)):
    user = _get_user(db, user_id)
    user.is_blocked = blocked
    db.commit()
    db.refresh(user)
    return user


# ── Movies ───────────────────────────────────────────────────────────────────
@router.post("/movies", response_model=MovieDetail, status_code=201)
def create_movie(data: MovieCreate, db: Session = Depends(get_db)):
    movie = Movie(
        title=data.title,
        slug=slugify(data.title, db),
        overview=data.overview,
        poster_url=data.poster_url,
        backdrop_url=data.backdrop_url,
        trailer_url=data.trailer_url,
        release_date=data.release_date,
        runtime=data.runtime,
        language=data.language,
        rating=data.rating,
    )
    if data.genre_slugs:
        movie.genres = db.query(Genre).filter(Genre.slug.in_(data.genre_slugs)).all()
    db.add(movie)
    db.commit()
    db.refresh(movie)
    return _movie_detail(db, movie.id)


@router.put("/movies/{movie_id}", response_model=MovieDetail)
def update_movie(movie_id: str, data: MovieCreate, db: Session = Depends(get_db)):
    movie = db.query(Movie).filter(Movie.id == movie_id).first()
    if not movie:
        raise HTTPException(404, "Movie not found")
    for key in ("title", "overview", "poster_url", "backdrop_url", "trailer_url",
                "release_date", "runtime", "language", "rating"):
        setattr(movie, key, getattr(data, key))
    if data.genre_slugs is not None:
        movie.genres = db.query(Genre).filter(Genre.slug.in_(data.genre_slugs)).all()
    db.commit()
    return _movie_detail(db, movie.id)


@router.delete("/movies/{movie_id}", status_code=204)
def delete_movie(movie_id: str, db: Session = Depends(get_db)):
    movie = db.query(Movie).filter(Movie.id == movie_id).first()
    if not movie:
        raise HTTPException(404, "Movie not found")
    db.delete(movie)
    db.commit()


# ── Review moderation ────────────────────────────────────────────────────────
@router.get("/reviews", response_model=list[ReviewOut])
def list_reviews(db: Session = Depends(get_db)):
    reviews = db.query(Review).order_by(Review.created_at.desc()).limit(200).all()
    out = []
    for r in reviews:
        item = ReviewOut.model_validate(r)
        item.user_name = r.user.full_name if r.user else None
        out.append(item)
    return out


@router.delete("/reviews/{review_id}", status_code=204)
def delete_review(review_id: str, db: Session = Depends(get_db)):
    review = db.query(Review).filter(Review.id == review_id).first()
    if not review:
        raise HTTPException(404, "Review not found")
    db.delete(review)
    db.commit()


def _get_user(db: Session, user_id: str) -> User:
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(404, "User not found")
    return user


def _movie_detail(db: Session, movie_id: str) -> Movie:
    return (
        db.query(Movie)
        .options(selectinload(Movie.genres), selectinload(Movie.cast), selectinload(Movie.director))
        .filter(Movie.id == movie_id)
        .first()
    )
