from enum import Enum as PyEnum
from typing import TYPE_CHECKING

from sqlalchemy import (
    Enum,
    ForeignKey,
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


class CourseVisibilityType(
    str,
    PyEnum
):
    ALL_STUDENTS = "ALL_STUDENTS"
    ASSIGNED_ONLY = "ASSIGNED_ONLY"
    GROUP = "GROUP"


class CourseVisibility(
    Base,
    BaseModel
):
    __tablename__ = "course_visibility"

    course_id: Mapped[str] = mapped_column(
        ForeignKey("courses.id"),
        nullable=False,
        unique=True,
    )

    visibility_type: Mapped[CourseVisibilityType] = mapped_column(
        Enum(CourseVisibilityType),
        nullable=False,
        default=CourseVisibilityType.ASSIGNED_ONLY,
    )

    # Relationships

    course: Mapped["Course"] = relationship(
        "Course",
        back_populates="visibility",
    )