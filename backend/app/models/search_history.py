from datetime import datetime

from sqlalchemy import DateTime, ForeignKey, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.base_model import UUIDMixin
from app.core.database import Base


class SearchHistory(Base, UUIDMixin):
    __tablename__ = "search_history"

    user_id: Mapped[str] = mapped_column(
        String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True
    )
    keyword: Mapped[str] = mapped_column(String(255), nullable=False)
    # Python-side default gives microsecond precision so "newest first" ordering is
    # reliable even for multiple searches within the same second (SQLite stores
    # server-side timestamps at second granularity).
    searched_at: Mapped[datetime] = mapped_column(
        DateTime, default=datetime.utcnow, nullable=False, index=True
    )

    user = relationship("User", back_populates="search_history")
