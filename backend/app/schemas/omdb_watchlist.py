from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field


class OmdbWatchlistCreate(BaseModel):
    movie_id: str = Field(min_length=1, max_length=20)
    movie_title: str = Field(min_length=1, max_length=255)
    poster: str | None = None
    genre: str | None = None
    year: str | None = None


class OmdbWatchlistResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    movie_id: str
    movie_title: str
    poster: str | None
    genre: str | None
    year: str | None
    created_at: datetime
