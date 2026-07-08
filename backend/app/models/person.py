from sqlalchemy import String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.base_model import BaseModel
from app.core.database import Base
from app.models.associations import movie_actors


class Actor(Base, BaseModel):
    __tablename__ = "actors"

    name: Mapped[str] = mapped_column(String(255), index=True, nullable=False)
    photo_url: Mapped[str | None] = mapped_column(String(500), nullable=True)
    bio: Mapped[str | None] = mapped_column(Text, nullable=True)

    movies = relationship("Movie", secondary=movie_actors, back_populates="cast")


class Director(Base, BaseModel):
    __tablename__ = "directors"

    name: Mapped[str] = mapped_column(String(255), index=True, nullable=False)
    photo_url: Mapped[str | None] = mapped_column(String(500), nullable=True)
    bio: Mapped[str | None] = mapped_column(Text, nullable=True)

    movies = relationship("Movie", back_populates="director")
