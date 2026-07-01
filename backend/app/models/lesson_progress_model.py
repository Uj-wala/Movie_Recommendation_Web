from typing import TYPE_CHECKING

from sqlalchemy import (
    Boolean,
    DateTime,
    ForeignKey,
    Integer,
    UniqueConstraint,
)
from sqlalchemy.orm import (
    Mapped,
    mapped_column,
    relationship,
)

from app.core.base_model import BaseModel
from app.core.database import Base
if TYPE_CHECKING:
    from app.models.lesson_model import Lesson
    from app.models.student_profile_model import StudentProfile


class LessonProgress(
    Base,
    BaseModel
):
    __tablename__ = "lesson_progress"
    __table_args__ = (
    UniqueConstraint(
        "student_profile_id",
        "lesson_id",
        name="uq_student_lesson_progress",
    ),
)

    student_profile_id: Mapped[str] = mapped_column(
        ForeignKey("student_profiles.id"),
        nullable=False,
    )

    lesson_id: Mapped[str] = mapped_column(
        ForeignKey("lessons.id"),
        nullable=False,
    )

    watch_percentage: Mapped[int] = mapped_column(
        Integer,
        default=0,
        nullable=False,
    )

    is_completed: Mapped[bool] = mapped_column(
        Boolean,
        default=False,
        nullable=False,
    )

    completed_at: Mapped[DateTime | None] = mapped_column(
        DateTime,
        nullable=True,
    )

    last_accessed_at: Mapped[DateTime | None] = mapped_column(
        DateTime,
        nullable=True,
    )

    time_spent_seconds: Mapped[int] = mapped_column(
        Integer,
        default=0,
        nullable=False,
    )

    # Relationships

    student: Mapped["StudentProfile"] = relationship(
        "StudentProfile",
        back_populates="lesson_progress",
    )

    lesson: Mapped["Lesson"] = relationship(
        "Lesson",
        back_populates="lesson_progress",
    )