from datetime import datetime

from sqlalchemy import (
    String,
    Boolean,
    Integer,
    ForeignKey,
    DateTime,
    Enum
)
# from sqlalchemy import UUID
from sqlalchemy.orm import relationship, Mapped, mapped_column

from app.core.database import Base
from app.core.base_model import BaseModel
from app.core.enums import OTPType, OTPChannel


class OTPVerification(Base, BaseModel):
    __tablename__ = "otp_verifications"

    user_id: Mapped[str] = mapped_column(
        String(36),
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
        index=True
    )

    otp_code: Mapped[str] = mapped_column(
        String(6),
        nullable=False,
        index=True
    )

    otp_type: Mapped[OTPType] = mapped_column(
        Enum(OTPType),
        nullable=False
    )

    channel: Mapped[OTPChannel] = mapped_column(
    Enum(OTPChannel),
    nullable=False
)

    expires_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
        index=True
    )

    is_used: Mapped[bool] = mapped_column(
        Boolean,
        default=False
    )

    attempts: Mapped[int] = mapped_column(
        Integer,
        default=0
    )

    user = relationship(
        "User",
        back_populates="otps"
    )