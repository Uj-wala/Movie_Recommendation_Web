from datetime import datetime

from pydantic import BaseModel


class DashboardStatsResponse(BaseModel):
    watched_count: int
    favorites_count: int
    watchlist_count: int
    reviews_count: int
    collections_count: int
    total_searches: int


class GenreCount(BaseModel):
    genre: str
    count: int


class MonthlyCount(BaseModel):
    month: str
    count: int


class RecentWatched(BaseModel):
    title: str
    poster: str | None = None
    watched_date: datetime


class RecentFavorite(BaseModel):
    title: str
    poster: str | None = None


class RecentReview(BaseModel):
    movie_title: str
    rating: int
    created_at: datetime


class RecentActivityResponse(BaseModel):
    recent_watched: list[RecentWatched]
    recent_favorites: list[RecentFavorite]
    recent_reviews: list[RecentReview]
