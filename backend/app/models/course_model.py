from datetime import datetime
from enum import Enum as PyEnum
from typing import TYPE_CHECKING

from sqlalchemy import (
    Boolean,
    DateTime,
    Enum,
    ForeignKey,
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
    from app.models.user_model import User
    from app.models.teacher_profile_model import TeacherProfile
    from app.models.subject_model import Subject
    from app.models.coursemodule_model import CourseModule
    from app.models.course_visibility_model import CourseVisibility
    from app.models.student_course_assignment_model import StudentCourseAssignment
    from app.models.course_progress_model import CourseProgress


class CourseDifficulty(
    str,
    PyEnum
):
    BEGINNER = "BEGINNER"
    INTERMEDIATE = "INTERMEDIATE"
    ADVANCED = "ADVANCED"


class CourseStatus(
    str,
    PyEnum
):
    DRAFT = "DRAFT"
    PUBLISHED = "PUBLISHED"
    UNPUBLISHED = "UNPUBLISHED"


class Course(
    Base,
    BaseModel
):
    __tablename__ = "courses"

    created_by: Mapped[str] = mapped_column(
        ForeignKey("users.id"),
        nullable=False,
    )

    instructor_teacher_profile_id: Mapped[str | None] = mapped_column(
        ForeignKey("teacher_profiles.id"),
        nullable=True,
    )

    subject_id: Mapped[str] = mapped_column(
        ForeignKey("subjects.id"),
        nullable=False,
    )

    title: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
    )

    description: Mapped[str | None] = mapped_column(
        Text,
        nullable=True,
    )

    thumbnail_url: Mapped[str | None] = mapped_column(
        String(500),
        nullable=True,
    )

    difficulty_level: Mapped[CourseDifficulty] = mapped_column(
        Enum(CourseDifficulty),
        nullable=False,
    )

    status: Mapped[CourseStatus] = mapped_column(
        Enum(CourseStatus),
        default=CourseStatus.DRAFT,
        nullable=False,
    )

    published_at: Mapped[datetime | None] = mapped_column(
        DateTime,
        nullable=True,
    )

    is_active: Mapped[bool] = mapped_column(
        Boolean,
        default=True,
        nullable=False,
    )

    # Relationships

    creator: Mapped["User"] = relationship(
        "User",
        foreign_keys=[created_by],
        back_populates="created_courses",
    )

    instructor: Mapped["TeacherProfile"] = relationship(
        "TeacherProfile",
        foreign_keys=[instructor_teacher_profile_id],
        back_populates="courses",
    )

    subject: Mapped["Subject"] = relationship(
        "Subject",
        back_populates="courses",
    )

    modules: Mapped[list["CourseModule"]] = relationship(
        "CourseModule",
        back_populates="course",
        cascade="all, delete-orphan",
    )

    visibility: Mapped["CourseVisibility"] = relationship(
        "CourseVisibility",
        back_populates="course",
        uselist=False,
        cascade="all, delete-orphan",
    )

    student_assignments: Mapped[list["StudentCourseAssignment"]] = relationship(
        "StudentCourseAssignment",
        back_populates="course",
        cascade="all, delete-orphan",
    )

    course_progress: Mapped[list["CourseProgress"]] = relationship(
        "CourseProgress",
        back_populates="course",
        cascade="all, delete-orphan",
    )