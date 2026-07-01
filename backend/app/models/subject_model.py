from typing import TYPE_CHECKING

from sqlalchemy import String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base
from app.core.base_model import BaseModel
if TYPE_CHECKING:
    from app.models.course_model import Course


class Subject(Base, BaseModel):
    __tablename__ = "subjects"

    name: Mapped[str] = mapped_column(
        String(100),
        unique=True,
        nullable=False
    )
    description: Mapped[str | None] = mapped_column(
        String(255),
        nullable=True
    )
    
    teachers = relationship(
    "TeacherSubject",
    back_populates="subject",
    cascade="all, delete-orphan"
    )
    
    courses: Mapped[list["Course"]] = relationship(
    "Course",
    back_populates="subject",
    )