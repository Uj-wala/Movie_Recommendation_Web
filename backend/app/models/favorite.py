from sqlalchemy import ForeignKey, String, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.base_model import BaseModel
from app.core.database import Base


class Favorite(Base, BaseModel):
    __tablename__ = "favorites"
    __table_args__ = (
        UniqueConstraint("user_id", "movie_id", name="uq_favorite_user_movie"),
    )

    user_id: Mapped[str] = mapped_column(
        String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True
    )
    movie_id: Mapped[str] = mapped_column(
        String(36), ForeignKey("movies.id", ondelete="CASCADE"), nullable=False, index=True
    )

    user = relationship("User", back_populates="favorites")
    movie = relationship("Movie")


class Watchlist(Base, BaseModel):
    __tablename__ = "watchlist"
    __table_args__ = (
        UniqueConstraint("user_id", "movie_id", name="uq_watchlist_user_movie"),
    )

    user_id: Mapped[str] = mapped_column(
        String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True
    )
    movie_id: Mapped[str] = mapped_column(
        String(36), ForeignKey("movies.id", ondelete="CASCADE"), nullable=False, index=True
    )

    user = relationship("User", back_populates="watchlist")
    movie = relationship("Movie")
