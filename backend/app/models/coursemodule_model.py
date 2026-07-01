from typing import TYPE_CHECKING

from sqlalchemy import (
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
if TYPE_CHECKING:
    from app.models.course_model import Course
    from app.models.lesson_model import Lesson


class CourseModule(
    Base,
    BaseModel
):
    __tablename__ = "course_modules"

    course_id: Mapped[str] = mapped_column(
        ForeignKey("courses.id"),
        nullable=False,
    )

    module_name: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
    )

    description: Mapped[str | None] = mapped_column(
        Text,
        nullable=True,
    )

    display_order: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
    )

    # Relationships

    course: Mapped["Course"] = relationship(
        "Course",
        back_populates="modules",
    )

    lessons: Mapped[list["Lesson"]] = relationship(
        "Lesson",
        back_populates="module",
        cascade="all, delete-orphan",
    )