from typing import TYPE_CHECKING

from sqlalchemy import (
    Boolean,
    Enum,
    ForeignKey,
    Integer,
    String,
    Text,
)
from sqlalchemy.orm import (
    Mapped,
    mapped_column,
    relationship,
)

from app.core.base_model import BaseModel
from app.core.database import Base

from enum import Enum as PyEnum

if TYPE_CHECKING:
    from app.models.coursemodule_model import CourseModule
    from app.models.lesson_content_model import LessonContent
    from app.models.lesson_progress_model import LessonProgress


class LessonType(
    str,
    PyEnum
):
    VIDEO = "VIDEO"
    PDF = "PDF"
    TEXT = "TEXT"


class Lesson(
    Base,
    BaseModel
):
    __tablename__ = "lessons"

    module_id: Mapped[str] = mapped_column(
        ForeignKey("course_modules.id"),
        nullable=False,
    )

    lesson_title: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
    )

    lesson_description: Mapped[str | None] = mapped_column(
        Text,
        nullable=True,
    )

    lesson_type: Mapped[LessonType] = mapped_column(
        Enum(LessonType),
        nullable=False,
    )

    duration_minutes: Mapped[int] = mapped_column(
        Integer,
        nullable=True,
    )

    display_order: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
    )

    is_preview: Mapped[bool] = mapped_column(
        Boolean,
        default=False,
        nullable=False,
    )

    # Relationships

    module: Mapped["CourseModule"] = relationship(
        "CourseModule",
        back_populates="lessons",
    )

    lesson_content: Mapped["LessonContent"] = relationship(
        "LessonContent",
        back_populates="lesson",
        uselist=False,
        cascade="all, delete-orphan",
    )

    lesson_progress: Mapped[list["LessonProgress"]] = relationship(
        "LessonProgress",
        back_populates="lesson",
        cascade="all, delete-orphan",
    )