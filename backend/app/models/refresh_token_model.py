from datetime import datetime, timezone
 
from sqlalchemy import (
    Boolean,
    Column,
    DateTime,
    ForeignKey,
    Integer,
    String
)
from sqlalchemy.orm import relationship
 
from app.core.database import Base
 
 
class RefreshToken(Base):
    __tablename__ = "refresh_tokens"
 
    id = Column(
        Integer,
        primary_key=True,
        index=True
    )
 
    user_id = Column(
        String(36),
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
        index=True
    )
 
    token_hash = Column(
        String(64),
        nullable=False,
        unique=True,
        index=True
    )
 
    expires_at = Column(
        DateTime(timezone=True),
        nullable=False,
        index=True
    )
 
    revoked = Column(
        Boolean,
        default=False,
        nullable=False,
        index=True
    )
 
    created_at = Column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False
    )
 
    revoked_at = Column(
        DateTime(timezone=True),
        nullable=True
    )
 
    user = relationship(
        "User",
        back_populates="refresh_tokens"
    )
 