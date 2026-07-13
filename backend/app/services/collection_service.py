from fastapi import HTTPException, status
from sqlalchemy import func, or_
from sqlalchemy.orm import Session, selectinload

from app.models.collection import Collection, CollectionMovie
from app.models.movie import Movie
from app.models.user import User
from app.schemas.collection import CollectionCreate, CollectionMovieCreate, CollectionUpdate


def _collection_for_user(db: Session, user_id: str, collection_id: str) -> Collection:
    collection = (
        db.query(Collection)
        .options(selectinload(Collection.movies))
        .filter(Collection.id == collection_id, Collection.user_id == user_id)
        .first()
    )
    if not collection:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Collection not found")
    return collection


def _ensure_unique_name(
    db: Session, user_id: str, name: str, exclude_collection_id: str | None = None
) -> None:
    q = db.query(Collection).filter(
        Collection.user_id == user_id,
        func.lower(Collection.name) == name.lower(),
    )
    if exclude_collection_id:
        q = q.filter(Collection.id != exclude_collection_id)
    if q.first():
        raise HTTPException(status.HTTP_409_CONFLICT, "Collection name already exists")


def list_collections(db: Session, user_id: str) -> list[Collection]:
    return (
        db.query(Collection)
        .options(selectinload(Collection.movies))
        .filter(Collection.user_id == user_id)
        .order_by(Collection.updated_at.desc(), Collection.created_at.desc())
        .all()
    )


def _with_public_collection_loaders(query):
    return query.join(User, Collection.user_id == User.id).options(
        selectinload(Collection.movies),
        selectinload(Collection.user),
    )


def create_collection(db: Session, user_id: str, data: CollectionCreate) -> Collection:
    name = data.name.strip()
    _ensure_unique_name(db, user_id, name)
    collection = Collection(
        user_id=user_id,
        name=name,
        description=data.description,
        visibility=data.visibility,
    )
    db.add(collection)
    db.commit()
    db.refresh(collection)
    return collection


def get_collection(db: Session, user_id: str, collection_id: str) -> Collection:
    return _collection_for_user(db, user_id, collection_id)


def update_collection(
    db: Session, user_id: str, collection_id: str, data: CollectionUpdate
) -> Collection:
    collection = _collection_for_user(db, user_id, collection_id)
    fields = data.model_dump(exclude_unset=True)
    if "name" in fields and fields["name"] is not None:
        name = fields["name"].strip()
        _ensure_unique_name(db, user_id, name, exclude_collection_id=collection.id)
        collection.name = name
    if "description" in fields:
        collection.description = fields["description"]
    if "visibility" in fields and fields["visibility"] is not None:
        collection.visibility = fields["visibility"]
    db.commit()
    db.refresh(collection)
    return collection


def delete_collection(db: Session, user_id: str, collection_id: str) -> None:
    collection = _collection_for_user(db, user_id, collection_id)
    db.delete(collection)
    db.commit()


def add_movie(
    db: Session, user_id: str, collection_id: str, data: CollectionMovieCreate
) -> CollectionMovie:
    collection = _collection_for_user(db, user_id, collection_id)
    exists = (
        db.query(CollectionMovie)
        .filter(
            CollectionMovie.collection_id == collection.id,
            CollectionMovie.movie_id == data.movie_id,
        )
        .first()
    )
    if exists:
        raise HTTPException(status.HTTP_409_CONFLICT, "Movie already exists in this collection")

    payload = data.model_dump()
    if not payload.get("internal_movie_id"):
        internal_movie = db.query(Movie.id).filter(Movie.id == data.movie_id).first()
        if internal_movie:
            payload["internal_movie_id"] = internal_movie.id

    movie = CollectionMovie(collection_id=collection.id, **payload)
    db.add(movie)
    db.commit()
    db.refresh(movie)
    return movie


def remove_movie(db: Session, user_id: str, collection_id: str, movie_id: str) -> None:
    collection = _collection_for_user(db, user_id, collection_id)
    movie = (
        db.query(CollectionMovie)
        .filter(CollectionMovie.collection_id == collection.id, CollectionMovie.movie_id == movie_id)
        .first()
    )
    if not movie:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Movie not found in this collection")
    db.delete(movie)
    db.commit()


def movie_memberships(db: Session, user_id: str, movie_id: str) -> list[dict]:
    collections = list_collections(db, user_id)
    return [
        {
            "collection_id": collection.id,
            "name": collection.name,
            "contains_movie": any(movie.movie_id == movie_id for movie in collection.movies),
        }
        for collection in collections
    ]


def list_public_collections(db: Session, search: str | None = None) -> list[Collection]:
    query = _with_public_collection_loaders(db.query(Collection)).filter(Collection.visibility.is_(True))
    if search:
        term = f"%{search.strip()}%"
        query = query.filter(
            or_(
                Collection.name.ilike(term),
                User.full_name.ilike(term),
                User.username.ilike(term),
            )
        )
    return query.order_by(Collection.updated_at.desc(), Collection.created_at.desc()).all()


def search_public_collections(db: Session, query_text: str) -> list[Collection]:
    return list_public_collections(db, query_text)


def get_public_collection(db: Session, collection_id: str) -> Collection:
    collection = (
        db.query(Collection)
        .options(selectinload(Collection.movies), selectinload(Collection.user))
        .filter(Collection.id == collection_id, Collection.visibility.is_(True))
        .first()
    )
    if not collection:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Public collection not found")
    return collection
