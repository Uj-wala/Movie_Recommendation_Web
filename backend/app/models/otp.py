from datetime import datetime

from sqlalchemy import Boolean, DateTime, Enum, ForeignKey, Integer, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.base_model import BaseModel
from app.core.database import Base
from app.core.enums import OTPChannel, OTPType


class OTPVerification(Base, BaseModel):
    __tablename__ = "otp_verifications"

    user_id: Mapped[str] = mapped_column(
        String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True
    )
    otp_code: Mapped[str] = mapped_column(String(6), nullable=False, index=True)
    otp_type: Mapped[OTPType] = mapped_column(Enum(OTPType), nullable=False)
    channel: Mapped[OTPChannel] = mapped_column(Enum(OTPChannel), nullable=False)
    expires_at: Mapped[datetime] = mapped_column(DateTime, nullable=False, index=True)
    is_used: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    attempts: Mapped[int] = mapped_column(Integer, default=0, nullable=False)

    user = relationship("User", back_populates="otps")
