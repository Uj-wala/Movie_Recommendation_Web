from pydantic import BaseModel, Field


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
    id: str
    genre: str
    score: float


class PreferenceCreate(BaseModel):
    genre: str = Field(min_length=1, max_length=80)
