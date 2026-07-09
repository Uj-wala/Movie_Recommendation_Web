from sqlalchemy import ForeignKey, String, Text, UniqueConstraint
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

    user = relationship("User", back_populates="collections")
    movies = relationship(
        "CollectionMovie",
        back_populates="collection",
        cascade="all, delete-orphan",
        order_by="CollectionMovie.created_at.desc()",
    )


class CollectionMovie(Base, BaseModel):
    __tablename__ = "collection_movies"
    __table_args__ = (
        UniqueConstraint("collection_id", "movie_id", name="uq_collection_movies_collection_movie"),
    )

    collection_id: Mapped[str] = mapped_column(
        String(36), ForeignKey("collections.id", ondelete="CASCADE"), nullable=False, index=True
    )
    movie_id: Mapped[str] = mapped_column(String(64), nullable=False, index=True)
    movie_title: Mapped[str] = mapped_column(String(255), nullable=False)
    poster: Mapped[str | None] = mapped_column(String(500), nullable=True)
    genre: Mapped[str | None] = mapped_column(String(255), nullable=True)
    year: Mapped[str | None] = mapped_column(String(20), nullable=True)

    collection = relationship("Collection", back_populates="movies")
