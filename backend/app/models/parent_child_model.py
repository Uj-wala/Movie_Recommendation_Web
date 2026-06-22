from sqlalchemy import ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base
from app.core.base_model import BaseModel


class ParentChild(Base, BaseModel):
    __tablename__ = "parent_children"

    parent_profile_id: Mapped[str] = mapped_column(
        ForeignKey("parent_profiles.id"),
        nullable=False
    )

    student_id: Mapped[str] = mapped_column(
        ForeignKey("users.id"),
        nullable=False
    )

    parent_profile = relationship(
        "ParentProfile",
        back_populates="children"
    )

    student = relationship(
        "User"
    )