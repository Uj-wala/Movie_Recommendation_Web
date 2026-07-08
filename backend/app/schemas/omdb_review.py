from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field, field_validator


class OmdbReviewCreate(BaseModel):
    imdb_id: str = Field(min_length=1, max_length=20)
    movie_title: str = Field(min_length=1, max_length=255)
    rating: int = Field(ge=1, le=5)
    review: str = Field(min_length=1)

    @field_validator("review")
    @classmethod
    def review_not_blank(cls, v: str) -> str:
        if not v.strip():
            raise ValueError("Review cannot be empty or whitespace only")
        return v.strip()


class OmdbReviewUpdate(BaseModel):
    rating: int = Field(ge=1, le=5)
    review: str = Field(min_length=1)

    @field_validator("review")
    @classmethod
    def review_not_blank(cls, v: str) -> str:
        if not v.strip():
            raise ValueError("Review cannot be empty or whitespace only")
        return v.strip()


class OmdbReviewResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    user_name: str
    movie_title: str
    imdb_id: str
    rating: int
    review: str
    created_at: datetime
    updated_at: datetime


class OmdbReviewPage(BaseModel):
    page: int
    limit: int
    total: int
    data: list[OmdbReviewResponse]


class MovieRatingSummary(BaseModel):
    average_rating: float
    total_reviews: int
