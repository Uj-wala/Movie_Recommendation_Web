from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy import or_
from sqlalchemy.orm import Session, selectinload

from app.core.database import get_db
from app.core.dependencies import get_current_user
from app.models.genre import Genre
from app.models.movie import Movie
from app.models.user import User
from app.schemas.movie import MovieDetail, MovieListItem

router = APIRouter(prefix="/movies", tags=["movies"])


def _base(db: Session):
    return db.query(Movie).options(selectinload(Movie.genres))


def _category(db: Session, column, limit: int):
    return _base(db).filter(column == True).order_by(Movie.popularity.desc()).limit(limit).all()  # noqa: E712


@router.get("", response_model=list[MovieListItem])
def list_movies(
    db: Session = Depends(get_db),
    search: str | None = None,
    genre: str | None = Query(None, description="genre slug"),
    sort: str = Query("popularity", pattern="^(popularity|rating|release_date|title)$"),
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=60),
):
    q = _base(db)
    if search:
        q = q.filter(Movie.title.ilike(f"%{search}%"))
    if genre:
        q = q.join(Movie.genres).filter(Genre.slug == genre)
    order = {
        "popularity": Movie.popularity.desc(),
        "rating": Movie.rating.desc(),
        "release_date": Movie.release_date.desc(),
        "title": Movie.title.asc(),
    }[sort]
    q = q.order_by(order).offset((page - 1) * page_size).limit(page_size)
    return q.all()


@router.get("/trending", response_model=list[MovieListItem])
def trending(db: Session = Depends(get_db), limit: int = Query(12, ge=1, le=40)):
    return _category(db, Movie.is_trending, limit)


@router.get("/popular", response_model=list[MovieListItem])
def popular(db: Session = Depends(get_db), limit: int = Query(12, ge=1, le=40)):
    return _category(db, Movie.is_popular, limit)


@router.get("/top-rated", response_model=list[MovieListItem])
def top_rated(db: Session = Depends(get_db), limit: int = Query(12, ge=1, le=40)):
    return _base(db).order_by(Movie.rating.desc()).limit(limit).all()


@router.get("/upcoming", response_model=list[MovieListItem])
def upcoming(db: Session = Depends(get_db), limit: int = Query(12, ge=1, le=40)):
    return _category(db, Movie.is_upcoming, limit)


@router.get("/now-playing", response_model=list[MovieListItem])
def now_playing(db: Session = Depends(get_db), limit: int = Query(12, ge=1, le=40)):
    return _category(db, Movie.is_now_playing, limit)


@router.get("/recommended", response_model=list[MovieListItem])
def recommended(
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
    limit: int = Query(12, ge=1, le=40),
):
    genre_ids = [g.id for g in user.favorite_genres]
    if not genre_ids:
        return _base(db).order_by(Movie.rating.desc()).limit(limit).all()
    return (
        _base(db)
        .join(Movie.genres)
        .filter(Genre.id.in_(genre_ids))
        .order_by(Movie.rating.desc())
        .distinct()
        .limit(limit)
        .all()
    )


@router.get("/{id_or_slug}", response_model=MovieDetail)
def get_movie(id_or_slug: str, db: Session = Depends(get_db)):
    movie = (
        db.query(Movie)
        .options(
            selectinload(Movie.genres),
            selectinload(Movie.cast),
            selectinload(Movie.director),
        )
        .filter(or_(Movie.id == id_or_slug, Movie.slug == id_or_slug))
        .first()
    )
    if not movie:
        raise HTTPException(404, "Movie not found")
    return movie


@router.get("/{id_or_slug}/related", response_model=list[MovieListItem])
def related(id_or_slug: str, db: Session = Depends(get_db), limit: int = Query(8, ge=1, le=20)):
    movie = db.query(Movie).filter(or_(Movie.id == id_or_slug, Movie.slug == id_or_slug)).first()
    if not movie:
        raise HTTPException(404, "Movie not found")
    genre_ids = [g.id for g in movie.genres]
    if not genre_ids:
        return []
    return (
        _base(db)
        .join(Movie.genres)
        .filter(Genre.id.in_(genre_ids), Movie.id != movie.id)
        .order_by(Movie.popularity.desc())
        .distinct()
        .limit(limit)
        .all()
    )
