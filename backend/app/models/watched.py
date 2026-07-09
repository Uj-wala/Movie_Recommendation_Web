from sqlalchemy import DateTime, Float, ForeignKey, String, UniqueConstraint, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.base_model import BaseModel
from app.core.database import Base


class WatchedMovie(Base, BaseModel):
    """A movie the user has marked as watched (OMDb imdb_id keyed), mirroring
    OmdbWatchlist. Marking a movie watched removes it from the watchlist."""

    __tablename__ = "watched_movies"
    __table_args__ = (
        UniqueConstraint("user_id", "movie_id", name="uq_watched_user_movie"),
    )

    user_id: Mapped[str] = mapped_column(
        String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True
    )
    movie_id: Mapped[str] = mapped_column(String(20), nullable=False, index=True)  # imdb id
    movie_title: Mapped[str] = mapped_column(String(255), nullable=False)
    poster: Mapped[str | None] = mapped_column(String(500), nullable=True)
    genre: Mapped[str | None] = mapped_column(String(255), nullable=True)
    imdb_rating: Mapped[float | None] = mapped_column(Float, nullable=True)
    watched_at: Mapped[object] = mapped_column(DateTime, server_default=func.now(), nullable=False)

    user = relationship("User", back_populates="watched_movies")
