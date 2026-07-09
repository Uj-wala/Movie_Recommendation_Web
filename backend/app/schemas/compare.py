from pydantic import BaseModel


class ComparedMovie(BaseModel):
    movie_id: str
    title: str
    poster: str | None = None
    year: str | None = None
    genre: str | None = None
    runtime: str | None = None
    director: str | None = None
    cast: str | None = None
    plot: str | None = None
    imdb_rating: float | None = None
    user_average_rating: float = 0.0
    total_reviews: int = 0


class ComparisonResponse(BaseModel):
    movie1: ComparedMovie
    movie2: ComparedMovie
    comparison_summary: list[str]
