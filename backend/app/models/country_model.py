from sqlalchemy import String, Boolean
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base
from app.core.base_model import BaseModel


class Country(Base, BaseModel):
    __tablename__ = "countries"

    name: Mapped[str] = mapped_column(
        String(100),
        nullable=False,
        unique=True
    )

    iso_code: Mapped[str] = mapped_column(
        String(2),
        nullable=False,
        unique=True,
        index=True
    )

    phone_code: Mapped[str] = mapped_column(
        String(10),
        nullable=False
    )

    default_language: Mapped[str] = mapped_column(
        String(10),
        nullable=False,
        default="en"
    )

    is_active: Mapped[bool] = mapped_column(
        Boolean,
        default=True
    )

    users = relationship(
        "User",
        back_populates="country"
    )