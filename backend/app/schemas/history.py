from datetime import datetime

from pydantic import BaseModel, ConfigDict


class SearchHistoryResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    keyword: str
    searched_at: datetime


class TrendingSearch(BaseModel):
    keyword: str
    count: int
