from datetime import date, datetime

from pydantic import BaseModel, ConfigDict, EmailStr

from app.core.enums import Gender, NotificationType
from app.schemas.movie import GenreOut


class ProfileOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: str
    full_name: str
    username: str | None = None
    email: EmailStr
    phone_number: str | None = None
    country: str | None = None
    date_of_birth: date | None = None
    gender: Gender | None = None
    profile_image_url: str | None = None
    preferred_language: str
    email_notifications: bool
    is_admin: bool
    created_at: datetime
    favorite_genres: list[GenreOut] = []
    # counts populated by the service
    favorites_count: int = 0
    watchlist_count: int = 0
    reviews_count: int = 0
    watched_count: int = 0
    collections_count: int = 0


class StatsResponse(BaseModel):
    watched_count: int
    favorites_count: int
    watchlist_count: int
    reviews_count: int
    collections_count: int


class ProfileUpdate(BaseModel):
    full_name: str | None = None
    username: str | None = None
    phone_number: str | None = None
    country: str | None = None
    profile_image_url: str | None = None
    preferred_language: str | None = None
    email_notifications: bool | None = None
    favorite_genres: list[str] | None = None  # genre slugs


class NotificationOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: str
    type: NotificationType
    title: str
    message: str | None = None
    is_read: bool
    created_at: datetime


class AdminUserOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: str
    full_name: str
    email: EmailStr
    phone_number: str | None = None
    country: str | None = None
    is_admin: bool
    is_active: bool
    is_blocked: bool
    is_verified: bool
    created_at: datetime


class AdminStats(BaseModel):
    total_users: int
    total_movies: int
    total_reviews: int
    total_favorites: int
    total_genres: int
    total_actors: int
    total_directors: int
    trending_movies: int
    most_searched_movie: str | None = None
