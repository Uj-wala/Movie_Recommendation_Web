from sqlalchemy import Column, ForeignKey, String, Table

from app.core.database import Base

movie_genres = Table(
    "movie_genres",
    Base.metadata,
    Column("movie_id", String(36), ForeignKey("movies.id", ondelete="CASCADE"), primary_key=True),
    Column("genre_id", String(36), ForeignKey("genres.id", ondelete="CASCADE"), primary_key=True),
)

user_genres = Table(
    "user_genres",
    Base.metadata,
    Column("user_id", String(36), ForeignKey("users.id", ondelete="CASCADE"), primary_key=True),
    Column("genre_id", String(36), ForeignKey("genres.id", ondelete="CASCADE"), primary_key=True),
)

movie_actors = Table(
    "movie_actors",
    Base.metadata,
    Column("movie_id", String(36), ForeignKey("movies.id", ondelete="CASCADE"), primary_key=True),
    Column("actor_id", String(36), ForeignKey("actors.id", ondelete="CASCADE"), primary_key=True),
)
