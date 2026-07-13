from datetime import date

from sqlalchemy import Boolean, Date, Float, ForeignKey, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.base_model import BaseModel
from app.core.database import Base
from app.models.associations import movie_actors, movie_genres


class Movie(Base, BaseModel):
    __tablename__ = "movies"

    title: Mapped[str] = mapped_column(String(255), index=True, nullable=False)
    slug: Mapped[str] = mapped_column(String(255), unique=True, index=True, nullable=False)
    overview: Mapped[str | None] = mapped_column(Text, nullable=True)
    poster_url: Mapped[str | None] = mapped_column(String(500), nullable=True)
    backdrop_url: Mapped[str | None] = mapped_column(String(500), nullable=True)
    trailer_url: Mapped[str | None] = mapped_column(String(500), nullable=True)

    release_date: Mapped[date | None] = mapped_column(Date, nullable=True)
    runtime: Mapped[int | None] = mapped_column(Integer, nullable=True)
    language: Mapped[str] = mapped_column(String(50), default="en", nullable=False)
    rating: Mapped[float] = mapped_column(Float, default=0.0, nullable=False)
    popularity: Mapped[float] = mapped_column(Float, default=0.0, nullable=False)

    director_id: Mapped[str | None] = mapped_column(
        String(36), ForeignKey("directors.id"), nullable=True, index=True
    )

    is_trending: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    is_popular: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    is_top_rated: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    is_upcoming: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    is_now_playing: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)

    director = relationship("Director", back_populates="movies")
    genres = relationship("Genre", secondary=movie_genres, back_populates="movies")
    cast = relationship("Actor", secondary=movie_actors, back_populates="movies")
    reviews = relationship("Review", back_populates="movie", cascade="all, delete-orphan")
    collection_entries = relationship("CollectionMovie", back_populates="movie")
