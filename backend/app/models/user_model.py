from datetime import datetime
from sqlalchemy import (
    String,
    Boolean,
    Integer,
    DateTime,
    Enum,
    ForeignKey,
    UniqueConstraint,
    Index,
)
from sqlalchemy.orm import relationship, Mapped, mapped_column

from app.core.database import Base
from app.core.base_model import BaseModel
from app.core.enums import UserRole, SecurityQuestion


class User(Base, BaseModel):
    __tablename__ = "users"

    __table_args__ = (
        UniqueConstraint("country_id", "phone_number", name="uq_user_country_phone"),
        Index("ix_user_country_phone", "country_id", "phone_number"),
    )

    full_name: Mapped[str] = mapped_column(String(255), nullable=False)

    email: Mapped[str | None] = mapped_column(
        String(255), unique=True, index=True, nullable=True
    )

    phone_number: Mapped[str | None] = mapped_column(String(20), nullable=True)

    country_id: Mapped[str | None] = mapped_column(
        String(36), ForeignKey("countries.id"), nullable=True, index=True
    )

    password_hash: Mapped[str] = mapped_column(String(255), nullable=False)

    role: Mapped[UserRole] = mapped_column(Enum(UserRole), nullable=False)

    security_question: Mapped[SecurityQuestion] = mapped_column(
        Enum(SecurityQuestion), nullable=False
    )

    security_answer_hash: Mapped[str] = mapped_column(String(255), nullable=False)

    is_verified: Mapped[bool] = mapped_column(Boolean, default=False)

    is_active: Mapped[bool] = mapped_column(Boolean, default=True)

    profile_completed: Mapped[bool] = mapped_column(Boolean, default=False)

    failed_login_attempts: Mapped[int] = mapped_column(Integer, default=0)

    blocked_until: Mapped[datetime | None] = mapped_column(
        DateTime(timezone=True), nullable=True
    )

    last_login_at: Mapped[datetime | None] = mapped_column(
        DateTime(timezone=True), nullable=True
    )

    otps = relationship(
        "OTPVerification", back_populates="user", cascade="all, delete-orphan"
    )

    sessions = relationship(
        "UserSession", back_populates="user", cascade="all, delete-orphan"
    )

    student_profile = relationship(
        "StudentProfile",
        back_populates="user",
        uselist=False,
        cascade="all, delete-orphan",
    )

    teacher_profile = relationship(
        "TeacherProfile",
        back_populates="user",
        uselist=False,
        cascade="all, delete-orphan",
    )

    parent_profile = relationship(
        "ParentProfile",
        back_populates="user",
        uselist=False,
        cascade="all, delete-orphan",
    )

    country = relationship("Country", back_populates="users")
