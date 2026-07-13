from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field


class CollectionCreate(BaseModel):
    name: str = Field(min_length=1, max_length=120)
    description: str | None = Field(default=None, max_length=1000)
    visibility: bool = False


class CollectionUpdate(BaseModel):
    name: str | None = Field(default=None, min_length=1, max_length=120)
    description: str | None = Field(default=None, max_length=1000)
    visibility: bool | None = None


class CollectionMovieCreate(BaseModel):
    movie_id: str = Field(min_length=1, max_length=64)
    internal_movie_id: str | None = Field(default=None, max_length=36)
    movie_title: str = Field(min_length=1, max_length=255)
    poster: str | None = None
    genre: str | None = None
    year: str | None = None
    imdb_rating: float | None = None


class CollectionMovieResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    movie_id: str
    internal_movie_id: str | None
    movie_title: str
    poster: str | None
    genre: str | None
    year: str | None
    imdb_rating: float | None
    created_at: datetime


class CollectionResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    name: str
    description: str | None
    visibility: bool
    owner: str | None = None
    owner_name: str | None = None
    owner_username: str | None = None
    movie_count: int = 0
    created_at: datetime
    updated_at: datetime
    movies: list[CollectionMovieResponse] = []


class MovieCollectionStatus(BaseModel):
    collection_id: str
    name: str
    contains_movie: bool
