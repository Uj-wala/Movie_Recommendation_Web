from sqlalchemy import ForeignKey, UniqueConstraint

from app.core.database import Base
from app.core.base_model import BaseModel

from sqlalchemy.orm import Mapped, mapped_column, relationship


class TeacherSubject(
    Base,
    BaseModel
):
    __tablename__ = "teacher_subjects"
    __table_args__ = (
    UniqueConstraint(
        "teacher_profile_id",
        "subject_id",
        name="uq_teacher_subject"
    ),
)

    teacher_profile_id: Mapped[str] = mapped_column(
        ForeignKey("teacher_profiles.id"),
        nullable=False
    )

    subject_id: Mapped[str] = mapped_column(
        ForeignKey("subjects.id"),
        nullable=False
    )
    
    teacher_profile = relationship(
        "TeacherProfile",
        back_populates="subjects"
    )

    subject = relationship(
        "Subject",
        back_populates="teachers"
    )