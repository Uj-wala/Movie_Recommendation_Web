"""Thin server-side proxy to the OMDb API.

The API key is read from settings and never leaves the backend. Endpoints call
these functions from sync `def` routes, so FastAPI runs the blocking urllib call
in a threadpool — fine for a proxy.

ponytail: stdlib urllib instead of httpx/requests — no extra dependency for a
few GET calls. Swap to httpx if you need async/connection pooling under load.
"""
import json
from urllib.error import URLError
from urllib.parse import urlencode
from urllib.request import urlopen

from fastapi import HTTPException

from app.core.config import settings


def _call(params: dict) -> dict:
    if not settings.OMDB_API_KEY:
        raise HTTPException(503, "OMDb integration is not configured (missing OMDB_API_KEY).")
    query = urlencode({**params, "apikey": settings.OMDB_API_KEY})
    try:
        with urlopen(f"{settings.OMDB_BASE_URL}?{query}", timeout=10) as resp:
            data = json.loads(resp.read())
    except URLError:
        raise HTTPException(502, "Could not reach the OMDb API.")
    except (ValueError, TimeoutError):
        raise HTTPException(502, "Invalid response from the OMDb API.")

    # OMDb signals failure via {"Response": "False", "Error": "..."} with HTTP 200.
    if data.get("Response") == "False":
        error = data.get("Error", "Unknown OMDb error")
        if "not found" in error.lower() or "movie not found" in error.lower():
            raise HTTPException(404, error)
        if "invalid api key" in error.lower():
            raise HTTPException(502, "OMDb API key is invalid.")
        if "limit reached" in error.lower():
            raise HTTPException(429, "OMDb daily request limit reached.")
        # "Too many results." / "Movie not found." for empty searches → treat as empty.
        return {"Search": [], "totalResults": "0", "Response": "True"}
    return data


def search_movies(search: str, page: int = 1) -> dict:
    """OMDb search (`s=`). Returns {results, total, page, total_pages} (10 per page)."""
    data = _call({"s": search, "page": page, "type": "movie"})
    total = int(data.get("totalResults", 0))
    return {
        "results": data.get("Search", []),
        "total": total,
        "page": page,
        "total_pages": max(1, -(-total // 10)),  # ceil, OMDb pages are 10 items
    }


def movie_details(imdb_id: str) -> dict:
    """Full movie record by IMDb id (`i=`), with full plot."""
    return _call({"i": imdb_id, "plot": "full"})
