from sqlalchemy import ForeignKey, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base
from app.core.base_model import BaseModel


class ParentChild(Base, BaseModel):
    __tablename__ = "parent_children"

    parent_profile_id: Mapped[str] = mapped_column(
        ForeignKey("parent_profiles.id"),
        nullable=False
    )

    student_reference_id: Mapped[str | None] = mapped_column(
        String(100),
        nullable=True
    )

    parent_profile = relationship(
        "ParentProfile",
        back_populates="children"
    )