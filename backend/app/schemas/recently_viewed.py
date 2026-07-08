from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field


class RecentlyViewedCreate(BaseModel):
    imdb_id: str = Field(min_length=1, max_length=20)
    movie_title: str = Field(min_length=1, max_length=255)
    # Genre string from the OMDb detail (e.g. "Action, Sci-Fi"); used to bump
    # the user's genre preference scores. Optional so views still record without it.
    genre: str | None = None


class RecentlyViewedResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    imdb_id: str
    movie_title: str
    viewed_at: datetime
