from datetime import datetime

from sqlalchemy import DateTime, ForeignKey, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.base_model import UUIDMixin
from app.core.database import Base


class RecentlyViewed(Base, UUIDMixin):
    __tablename__ = "recently_viewed"

    user_id: Mapped[str] = mapped_column(
        String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True
    )
    imdb_id: Mapped[str] = mapped_column(String(20), nullable=False, index=True)
    movie_title: Mapped[str] = mapped_column(String(255), nullable=False)
    viewed_at: Mapped[datetime] = mapped_column(
        DateTime, default=datetime.utcnow, nullable=False, index=True
    )

    user = relationship("User", back_populates="recently_viewed")
