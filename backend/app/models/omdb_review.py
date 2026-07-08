from sqlalchemy import ForeignKey, Integer, String, Text, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.base_model import BaseModel
from app.core.database import Base


class OmdbReview(Base, BaseModel):
    """User reviews for OMDb (imdb_id) movies, separate from catalog Reviews which
    are keyed to internal movie UUIDs."""

    __tablename__ = "omdb_reviews"
    __table_args__ = (
        UniqueConstraint("user_id", "imdb_id", name="uq_omdb_review_user_movie"),
    )

    user_id: Mapped[str] = mapped_column(
        String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True
    )
    imdb_id: Mapped[str] = mapped_column(String(20), nullable=False, index=True)
    movie_title: Mapped[str] = mapped_column(String(255), nullable=False)
    rating: Mapped[int] = mapped_column(Integer, nullable=False)  # 1-5
    review: Mapped[str] = mapped_column(Text, nullable=False)

    user = relationship("User", back_populates="omdb_reviews")
