from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field


class CollectionCreate(BaseModel):
    name: str = Field(min_length=1, max_length=120)
    description: str | None = Field(default=None, max_length=1000)


class CollectionUpdate(BaseModel):
    name: str | None = Field(default=None, min_length=1, max_length=120)
    description: str | None = Field(default=None, max_length=1000)


class CollectionMovieCreate(BaseModel):
    movie_id: str = Field(min_length=1, max_length=64)
    movie_title: str = Field(min_length=1, max_length=255)
    poster: str | None = None
    genre: str | None = None
    year: str | None = None


class CollectionMovieResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    movie_id: str
    movie_title: str
    poster: str | None
    genre: str | None
    year: str | None
    created_at: datetime


class CollectionResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    name: str
    description: str | None
    created_at: datetime
    updated_at: datetime
    movies: list[CollectionMovieResponse] = []


class MovieCollectionStatus(BaseModel):
    collection_id: str
    name: str
    contains_movie: bool
