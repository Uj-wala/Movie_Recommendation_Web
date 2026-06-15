from sqlalchemy import (
    String,
    ForeignKey,
    Text
)
# from sqlalchemy import UUID
from sqlalchemy.orm import relationship, Mapped, mapped_column

from app.core.database import Base
from app.core.base_model import BaseModel


class StudentProfile(Base, BaseModel):
    __tablename__ = "student_profiles"

    user_id: Mapped[str] = mapped_column(
        String(36),
        ForeignKey("users.id", ondelete="CASCADE"),
        unique=True,
        nullable=False
    )

    grade: Mapped[str] = mapped_column(
        String(50),
        nullable=False
    )

    school_name: Mapped[str] = mapped_column(
        String(255),
        nullable=True
    )

    workplace: Mapped[str | None] = mapped_column(
        String(255),
        nullable=True
    )
    
    learning_interests: Mapped[str | None] = mapped_column(
        Text,
        nullable=True
    )

    preferred_learning_style: Mapped[str | None] = mapped_column(
        String(100),
        nullable=True
    )

    user = relationship(
        "User",
        back_populates="student_profile"
    )