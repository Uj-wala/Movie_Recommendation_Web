from datetime import datetime

from sqlalchemy import (
    String,
    ForeignKey,
    DateTime
)
# from sqlalchemy import UUID
from sqlalchemy.orm import relationship, Mapped, mapped_column

from app.core.database import Base
from app.core.base_model import BaseModel


class UserSession(Base, BaseModel):
    __tablename__ = "user_sessions"

    user_id: Mapped[str] = mapped_column(
        String(36),
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
        index=True
    )

    refresh_token: Mapped[str] = mapped_column(
        String(500),
        unique=True,
        nullable=False,
        index=True
    )

    device_info: Mapped[str | None] = mapped_column(
        String(255),
        nullable=True
    )

    ip_address: Mapped[str | None] = mapped_column(
        String(100),
        nullable=True
    )

    expires_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False
    )

    user = relationship(
        "User",
        back_populates="sessions"
    )