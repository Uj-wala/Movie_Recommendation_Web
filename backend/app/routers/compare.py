from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.schemas.compare import ComparisonResponse
from app.services import comparison_service

# /compare (not /movies/compare) to avoid the /movies/{id_or_slug} catch-all.
router = APIRouter(prefix="/compare", tags=["compare"])


@router.get("", response_model=ComparisonResponse)
def compare_movies(
    movie1: str = Query(..., min_length=1, description="First imdb id"),
    movie2: str = Query(..., min_length=1, description="Second imdb id"),
    db: Session = Depends(get_db),
):
    """Compare two OMDb movies side by side with an auto-generated summary."""
    if movie1 == movie2:
        raise HTTPException(400, "Please choose two different movies to compare.")
    return comparison_service.compare(db, movie1, movie2)
