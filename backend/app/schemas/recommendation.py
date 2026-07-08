from pydantic import BaseModel


class RecommendedMovie(BaseModel):
    imdb_id: str
    title: str
    genre: str | None = None
    poster: str | None = None
    reason: str
    score: int  # 0-100 confidence heuristic


class RecommendationResponse(BaseModel):
    recommended_movies: list[RecommendedMovie]


class GenrePreference(BaseModel):
    genre: str
    score: float
