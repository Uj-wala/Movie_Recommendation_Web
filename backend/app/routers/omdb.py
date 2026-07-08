from fastapi import APIRouter, Query

from app.services import omdb_service

# Mounted at /omdb (not /movies) so the existing DB-backed catalog keeps working.
router = APIRouter(prefix="/omdb", tags=["omdb"])


@router.get("/search")
def search(
    search: str = Query(..., min_length=1, description="Search term"),
    page: int = Query(1, ge=1, le=100),
):
    return omdb_service.search_movies(search, page)


@router.get("/{imdb_id}")
def details(imdb_id: str):
    return omdb_service.movie_details(imdb_id)
