from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models.genre import Genre
from app.models.movie import Movie
from app.models.person import Actor, Director
from app.schemas.movie import GenreOut, MovieListItem, PersonOut

router = APIRouter(tags=["catalog"])


@router.get("/genres", response_model=list[GenreOut])
def list_genres(db: Session = Depends(get_db)):
    return db.query(Genre).order_by(Genre.name).all()


@router.get("/actors", response_model=list[PersonOut])
def list_actors(db: Session = Depends(get_db), search: str | None = None):
    q = db.query(Actor)
    if search:
        q = q.filter(Actor.name.ilike(f"%{search}%"))
    return q.order_by(Actor.name).limit(60).all()


@router.get("/directors", response_model=list[PersonOut])
def list_directors(db: Session = Depends(get_db), search: str | None = None):
    q = db.query(Director)
    if search:
        q = q.filter(Director.name.ilike(f"%{search}%"))
    return q.order_by(Director.name).limit(60).all()


@router.get("/search")
def search(db: Session = Depends(get_db), q: str = Query(..., min_length=1)):
    """Unified live search across movies, actors, directors and genres."""
    like = f"%{q}%"
    movies = db.query(Movie).filter(Movie.title.ilike(like)).limit(8).all()
    actors = db.query(Actor).filter(Actor.name.ilike(like)).limit(5).all()
    directors = db.query(Director).filter(Director.name.ilike(like)).limit(5).all()
    genres = db.query(Genre).filter(Genre.name.ilike(like)).limit(5).all()
    return {
        "movies": [MovieListItem.model_validate(m) for m in movies],
        "actors": [PersonOut.model_validate(a) for a in actors],
        "directors": [PersonOut.model_validate(d) for d in directors],
        "genres": [GenreOut.model_validate(g) for g in genres],
    }
