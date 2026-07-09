from datetime import date, datetime

from pydantic import BaseModel, ConfigDict


class GenreOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: str
    name: str
    slug: str


class PersonOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: str
    name: str
    photo_url: str | None = None
    bio: str | None = None


class MovieListItem(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: str
    title: str
    slug: str
    poster_url: str | None = None
    backdrop_url: str | None = None
    release_date: date | None = None
    rating: float
    runtime: int | None = None
    genres: list[GenreOut] = []


class MovieDetail(MovieListItem):
    overview: str | None = None
    trailer_url: str | None = None
    language: str
    popularity: float
    director: PersonOut | None = None
    cast: list[PersonOut] = []


class ReviewOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: str
    user_id: str
    movie_id: str
    rating: int
    comment: str | None = None
    created_at: datetime
    user_name: str | None = None


class ReviewCreate(BaseModel):
    movie_id: str
    rating: int
    comment: str | None = None


class ReviewUpdate(BaseModel):
    rating: int | None = None
    comment: str | None = None


class MovieCreate(BaseModel):
    title: str
    overview: str | None = None
    poster_url: str | None = None
    backdrop_url: str | None = None
    trailer_url: str | None = None
    release_date: date | None = None
    runtime: int | None = None
    language: str = "en"
    rating: float = 0.0
    genre_slugs: list[str] = []
