from sqlalchemy import ForeignKey, Integer, String, Text, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.base_model import BaseModel
from app.core.database import Base


class Review(Base, BaseModel):
    __tablename__ = "reviews"
    __table_args__ = (
        UniqueConstraint("user_id", "movie_id", name="uq_review_user_movie"),
    )

    user_id: Mapped[str] = mapped_column(
        String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True
    )
    movie_id: Mapped[str] = mapped_column(
        String(36), ForeignKey("movies.id", ondelete="CASCADE"), nullable=False, index=True
    )
    rating: Mapped[int] = mapped_column(Integer, nullable=False)  # 1-5
    comment: Mapped[str | None] = mapped_column(Text, nullable=True)

    user = relationship("User", back_populates="reviews")
    movie = relationship("Movie", back_populates="reviews")
