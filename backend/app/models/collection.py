from sqlalchemy import Boolean, Float, ForeignKey, String, Text, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.base_model import BaseModel
from app.core.database import Base


class Collection(Base, BaseModel):
    __tablename__ = "collections"
    __table_args__ = (
        UniqueConstraint("user_id", "name", name="uq_collections_user_name"),
    )

    user_id: Mapped[str] = mapped_column(
        String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True
    )
    name: Mapped[str] = mapped_column(String(120), nullable=False)
    description: Mapped[str | None] = mapped_column(Text, nullable=True)
    visibility: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)

    user = relationship("User", back_populates="collections")
    movies = relationship(
        "CollectionMovie",
        back_populates="collection",
        cascade="all, delete-orphan",
        order_by="CollectionMovie.created_at.desc()",
    )

    @property
    def owner_name(self) -> str | None:
        return self.user.full_name if self.user else None

    @property
    def owner_username(self) -> str | None:
        return self.user.username if self.user else None

    @property
    def owner(self) -> str | None:
        if not self.user:
            return None
        return self.user.username or self.user.full_name

    @property
    def movie_count(self) -> int:
        return len(self.movies)


class CollectionMovie(Base, BaseModel):
    __tablename__ = "collection_movies"
    __table_args__ = (
        UniqueConstraint("collection_id", "movie_id", name="uq_collection_movies_collection_movie"),
    )

    collection_id: Mapped[str] = mapped_column(
        String(36), ForeignKey("collections.id", ondelete="CASCADE"), nullable=False, index=True
    )
    internal_movie_id: Mapped[str | None] = mapped_column(
        String(36), ForeignKey("movies.id", ondelete="SET NULL"), nullable=True, index=True
    )
    movie_id: Mapped[str] = mapped_column(String(64), nullable=False, index=True)
    movie_title: Mapped[str] = mapped_column(String(255), nullable=False)
    poster: Mapped[str | None] = mapped_column(String(500), nullable=True)
    genre: Mapped[str | None] = mapped_column(String(255), nullable=True)
    year: Mapped[str | None] = mapped_column(String(20), nullable=True)
    imdb_rating: Mapped[float | None] = mapped_column(Float, nullable=True)

    collection = relationship("Collection", back_populates="movies")
    movie = relationship("Movie", back_populates="collection_entries")
