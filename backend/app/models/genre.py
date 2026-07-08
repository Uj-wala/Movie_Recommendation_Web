from sqlalchemy import String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.base_model import BaseModel
from app.core.database import Base
from app.models.associations import movie_genres


class Genre(Base, BaseModel):
    __tablename__ = "genres"

    name: Mapped[str] = mapped_column(String(100), unique=True, nullable=False)
    slug: Mapped[str] = mapped_column(String(100), unique=True, index=True, nullable=False)

    movies = relationship("Movie", secondary=movie_genres, back_populates="genres")
