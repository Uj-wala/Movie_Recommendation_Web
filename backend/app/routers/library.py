from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session, selectinload

from app.core.database import get_db
from app.core.dependencies import get_current_user
from app.models.favorite import Favorite, Watchlist
from app.models.movie import Movie
from app.models.user import User
from app.schemas.movie import MovieListItem

router = APIRouter(tags=["library"])


def _movies(db: Session, model, user: User):
    rows = (
        db.query(model)
        .filter(model.user_id == user.id)
        .options(selectinload(model.movie).selectinload(Movie.genres))
        .order_by(model.created_at.desc())
        .all()
    )
    return [r.movie for r in rows if r.movie]


# ── Favorites ────────────────────────────────────────────────────────────────
@router.get("/favorites", response_model=list[MovieListItem])
def list_favorites(db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    return _movies(db, Favorite, user)


@router.post("/favorites/{movie_id}", status_code=201)
def add_favorite(movie_id: str, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    return _toggle_add(db, Favorite, user, movie_id, "Movie already in favorites")


@router.delete("/favorites/{movie_id}", status_code=204)
def remove_favorite(movie_id: str, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    _remove(db, Favorite, user, movie_id)


# ── Watchlist ────────────────────────────────────────────────────────────────
@router.get("/watchlist", response_model=list[MovieListItem])
def list_watchlist(db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    return _movies(db, Watchlist, user)


@router.post("/watchlist/{movie_id}", status_code=201)
def add_watchlist(movie_id: str, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    return _toggle_add(db, Watchlist, user, movie_id, "Movie already in watchlist")


@router.delete("/watchlist/{movie_id}", status_code=204)
def remove_watchlist(movie_id: str, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    _remove(db, Watchlist, user, movie_id)


def _toggle_add(db: Session, model, user: User, movie_id: str, dup_msg: str):
    if not db.query(Movie).filter(Movie.id == movie_id).first():
        raise HTTPException(404, "Movie not found")
    if db.query(model).filter(model.user_id == user.id, model.movie_id == movie_id).first():
        raise HTTPException(409, dup_msg)
    db.add(model(user_id=user.id, movie_id=movie_id))
    db.commit()
    return {"message": "Added"}


def _remove(db: Session, model, user: User, movie_id: str):
    row = db.query(model).filter(model.user_id == user.id, model.movie_id == movie_id).first()
    if not row:
        raise HTTPException(404, "Not found")
    db.delete(row)
    db.commit()
