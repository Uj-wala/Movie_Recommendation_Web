from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.dependencies import get_current_user
from app.models.user import User
from app.schemas.collection import (
    CollectionCreate,
    CollectionMovieCreate,
    CollectionMovieResponse,
    CollectionResponse,
    CollectionUpdate,
    MovieCollectionStatus,
)
from app.services import collection_service as svc

router = APIRouter(prefix="/collections", tags=["collections"])


@router.get("", response_model=list[CollectionResponse])
def list_collections(db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    return svc.list_collections(db, user.id)


@router.post("", response_model=CollectionResponse, status_code=201)
def create_collection(
    data: CollectionCreate,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    return svc.create_collection(db, user.id, data)


@router.get("/movie/{movie_id}", response_model=list[MovieCollectionStatus])
def get_movie_memberships(
    movie_id: str,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    return svc.movie_memberships(db, user.id, movie_id)


@router.get("/public", response_model=list[CollectionResponse])
def list_public_collections(
    search: str | None = Query(default=None, max_length=120),
    db: Session = Depends(get_db),
):
    return svc.list_public_collections(db, search)


@router.get("/public/{collection_id}", response_model=CollectionResponse)
def get_public_collection(collection_id: str, db: Session = Depends(get_db)):
    return svc.get_public_collection(db, collection_id)


@router.get("/search", response_model=list[CollectionResponse])
def search_collections(
    query: str = Query(..., min_length=1, max_length=120),
    db: Session = Depends(get_db),
):
    return svc.search_public_collections(db, query)


@router.get("/{collection_id}", response_model=CollectionResponse)
def get_collection(
    collection_id: str,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    return svc.get_collection(db, user.id, collection_id)


@router.put("/{collection_id}", response_model=CollectionResponse)
def update_collection(
    collection_id: str,
    data: CollectionUpdate,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    return svc.update_collection(db, user.id, collection_id, data)


@router.delete("/{collection_id}")
def delete_collection(
    collection_id: str,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    svc.delete_collection(db, user.id, collection_id)
    return {"message": "Collection deleted successfully"}


@router.post("/{collection_id}/movies", response_model=CollectionMovieResponse, status_code=201)
def add_movie_to_collection(
    collection_id: str,
    data: CollectionMovieCreate,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    return svc.add_movie(db, user.id, collection_id, data)


@router.delete("/{collection_id}/movies/{movie_id}")
def remove_movie_from_collection(
    collection_id: str,
    movie_id: str,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    svc.remove_movie(db, user.id, collection_id, movie_id)
    return {"message": "Movie removed from collection successfully"}
