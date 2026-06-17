from sqlalchemy import (
    Integer,
    String,
    ForeignKey,
    Text
)
# from sqlalchemy import UUID
from sqlalchemy.orm import relationship, Mapped, mapped_column

from app.core.database import Base
from app.core.base_model import BaseModel


class TeacherProfile(Base, BaseModel):
    __tablename__ = "teacher_profiles"

    user_id: Mapped[str] = mapped_column(
        String(36),
        ForeignKey("users.id", ondelete="CASCADE"),
        unique=True,
        nullable=False
    )

    school_name: Mapped[str] = mapped_column(
        String(255),
        nullable=False
    )
    
    # sprint 2 additions
    years_of_experience: Mapped[str | None] = mapped_column(
    String(50),
    nullable=True,
    )

    qualification: Mapped[str | None] = mapped_column(
        String(255),
        nullable=True
    )

    bio: Mapped[str | None] = mapped_column(
        Text,
        nullable=True
    )

    user = relationship(
        "User",
        back_populates="teacher_profile"
    )
    
    subjects = relationship(
    "TeacherSubject",
    back_populates="teacher_profile",
    cascade="all, delete-orphan"
    )