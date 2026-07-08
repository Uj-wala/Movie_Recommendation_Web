from sqlalchemy import ForeignKey, String, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.base_model import BaseModel
from app.core.database import Base


class OmdbWatchlist(Base, BaseModel):
    """Server-persisted watchlist for OMDb (imdb_id) movies, separate from the
    catalog Watchlist which is keyed to internal movie UUIDs."""

    __tablename__ = "omdb_watchlist"
    __table_args__ = (
        UniqueConstraint("user_id", "movie_id", name="uq_omdb_watchlist_user_movie"),
    )

    user_id: Mapped[str] = mapped_column(
        String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True
    )
    movie_id: Mapped[str] = mapped_column(String(20), nullable=False, index=True)  # imdb id
    movie_title: Mapped[str] = mapped_column(String(255), nullable=False)
    poster: Mapped[str | None] = mapped_column(String(500), nullable=True)
    genre: Mapped[str | None] = mapped_column(String(255), nullable=True)
    year: Mapped[str | None] = mapped_column(String(20), nullable=True)

    user = relationship("User", back_populates="omdb_watchlist")
