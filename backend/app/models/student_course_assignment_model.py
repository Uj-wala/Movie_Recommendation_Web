from typing import TYPE_CHECKING

from sqlalchemy import (
    ForeignKey,
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
    from app.models.student_profile_model import StudentProfile
    from app.models.user_model import User


class StudentCourseAssignment(
    Base,
    BaseModel
):
    __tablename__ = "student_course_assignments"

    __table_args__ = (
        UniqueConstraint(
            "student_profile_id",
            "course_id",
            name="uq_student_course_assignment",
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

    assigned_by: Mapped[str] = mapped_column(
        ForeignKey("users.id"),
        nullable=False,
    )

    # Relationships

    student: Mapped["StudentProfile"] = relationship(
        "StudentProfile",
        back_populates="course_assignments",
    )

    course: Mapped["Course"] = relationship(
        "Course",
        back_populates="student_assignments",
    )

    assigned_user: Mapped["User"] = relationship(
        "User",
        foreign_keys=[assigned_by],
    )