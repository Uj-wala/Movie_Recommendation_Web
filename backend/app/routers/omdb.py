from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.dependencies import get_optional_user
from app.models.user import User
from app.services import history_service, omdb_service

# Mounted at /omdb (not /movies) so the existing DB-backed catalog keeps working.
router = APIRouter(prefix="/omdb", tags=["omdb"])


@router.get("/search")
def search(
    search: str = Query(..., min_length=1, description="Search term"),
    page: int = Query(1, ge=1, le=100),
    db: Session = Depends(get_db),
    user: User | None = Depends(get_optional_user),
):
    results = omdb_service.search_movies(search, page)
    # Auto-record search history for signed-in users (only on the first page).
    if user and page == 1:
        history_service.record_search(db, user.id, search)
    return results


@router.get("/{imdb_id}")
def details(imdb_id: str):
    return omdb_service.movie_details(imdb_id)
