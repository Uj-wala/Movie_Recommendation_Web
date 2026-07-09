"""Side-by-side comparison of two OMDb movies.

Pulls details from OMDb and user rating stats from OmdbReview, then builds a
plain-language summary. No new tables — reuses the OMDb proxy and reviews.
"""
from sqlalchemy.orm import Session

from app.schemas.compare import ComparedMovie, ComparisonResponse
from app.services import omdb_review_service, omdb_service


def _na(value: str | None) -> str | None:
    return value if value and value != "N/A" else None


def _parse_rating(value: str | None) -> float | None:
    try:
        return float(value) if value and value != "N/A" else None
    except ValueError:
        return None


def _build_movie(db: Session, imdb_id: str) -> ComparedMovie:
    detail = omdb_service.movie_details(imdb_id)  # raises 404 if not found
    stats = omdb_review_service.rating_summary(db, imdb_id)
    return ComparedMovie(
        movie_id=imdb_id,
        title=detail.get("Title", ""),
        poster=_na(detail.get("Poster")),
        year=_na(detail.get("Year")),
        genre=_na(detail.get("Genre")),
        runtime=_na(detail.get("Runtime")),
        director=_na(detail.get("Director")),
        cast=_na(detail.get("Actors")),
        plot=_na(detail.get("Plot")),
        imdb_rating=_parse_rating(detail.get("imdbRating")),
        user_average_rating=stats["average_rating"],
        total_reviews=stats["total_reviews"],
    )


def _summarize(a: ComparedMovie, b: ComparedMovie) -> list[str]:
    summary: list[str] = []

    def line(metric: str, va, vb, unit: str = "") -> None:
        if va is None or vb is None or va == vb:
            if va is not None and va == vb:
                summary.append(f"{a.title} and {b.title} have the same {metric}.")
            return
        winner, loser = (a, b) if va > vb else (b, a)
        summary.append(f"{winner.title} has a higher {metric} than {loser.title}{unit}.")

    line("IMDb rating", a.imdb_rating, b.imdb_rating)
    line("user rating", a.user_average_rating or None, b.user_average_rating or None)

    if a.total_reviews != b.total_reviews:
        more = a if a.total_reviews > b.total_reviews else b
        less = b if more is a else a
        summary.append(f"{more.title} has more user reviews than {less.title}.")

    if not summary:
        summary.append("Both movies are closely matched.")
    return summary


def compare(db: Session, movie1: str, movie2: str) -> ComparisonResponse:
    m1 = _build_movie(db, movie1)
    m2 = _build_movie(db, movie2)
    return ComparisonResponse(movie1=m1, movie2=m2, comparison_summary=_summarize(m1, m2))
