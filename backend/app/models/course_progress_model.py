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
    from app.models.course_model import Course
    from app.models.lesson_model import Lesson
    from app.models.student_profile_model import StudentProfile


class CourseProgress(
    Base,
    BaseModel
):
    __tablename__ = "course_progress"

    __table_args__ = (
        UniqueConstraint(
            "student_profile_id",
            "course_id",
            name="uq_student_course_progress",
        ),
    )

    student_profile_id: Mapped[str] = mapped_column(
        ForeignKey("student_profiles.id"),
        nullable=False,
    )

    course_id: Mapped[str] = mapped_column(
        ForeignKey("courses.id"),
        nullable=False,
    )

    completed_lessons: Mapped[int] = mapped_column(
        Integer,
        default=0,
        nullable=False,
    )

    total_lessons: Mapped[int] = mapped_column(
        Integer,
        default=0,
        nullable=False,
    )

    progress_percentage: Mapped[int] = mapped_column(
        Integer,
        default=0,
        nullable=False,
    )

    last_accessed_lesson_id: Mapped[str | None] = mapped_column(
        ForeignKey("lessons.id"),
        nullable=True,
    )

    next_lesson_id: Mapped[str | None] = mapped_column(
        ForeignKey("lessons.id"),
        nullable=True,
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

    # Relationships

    student: Mapped["StudentProfile"] = relationship(
        "StudentProfile",
        back_populates="course_progress",
    )

    course: Mapped["Course"] = relationship(
        "Course",
        back_populates="course_progress",
    )

    last_accessed_lesson: Mapped["Lesson"] = relationship(
        "Lesson",
        foreign_keys=[last_accessed_lesson_id],
    )

    next_lesson: Mapped["Lesson"] = relationship(
        "Lesson",
        foreign_keys=[next_lesson_id],
    )