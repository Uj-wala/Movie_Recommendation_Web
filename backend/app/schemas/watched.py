from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field


class WatchedCreate(BaseModel):
    movie_id: str = Field(min_length=1, max_length=20)
    movie_title: str = Field(min_length=1, max_length=255)
    poster: str | None = None
    genre: str | None = None
    imdb_rating: float | None = None


class WatchedResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    movie_id: str
    movie_title: str
    poster: str | None
    genre: str | None
    imdb_rating: float | None
    watched_at: datetime


class WatchStatusResponse(BaseModel):
    is_watched: bool
