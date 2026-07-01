from typing import TYPE_CHECKING

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
if TYPE_CHECKING:
    from app.models.course_model import Course


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
    
    courses: Mapped[list["Course"]] = relationship(
    "Course",
    foreign_keys="Course.instructor_teacher_profile_id",
    back_populates="instructor",
    )