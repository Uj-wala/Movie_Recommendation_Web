from sqlalchemy import (
    String,
    ForeignKey
)
# from sqlalchemy import UUID
from sqlalchemy.orm import relationship, Mapped, mapped_column
 
from app.core.database import Base
from app.core.base_model import BaseModel
 
 
class ParentProfile(Base, BaseModel):
    __tablename__ = "parent_profiles"
 
    user_id: Mapped[str] = mapped_column(
        String(36),
        ForeignKey("users.id", ondelete="CASCADE"),
        unique=True,
        nullable=False
    )

    relationship_type: Mapped[str | None] = mapped_column(
        String(50),
        nullable=True
    )

    user = relationship(
        "User",
        back_populates="parent_profile"
    )

    children = relationship(
        "ParentChild",
        back_populates="parent_profile",
        cascade="all, delete-orphan"
    )