from pydantic import BaseModel


class DashboardResponse(BaseModel):
    total_favorites: int
    total_searches: int
    recent_searches: list[str]
