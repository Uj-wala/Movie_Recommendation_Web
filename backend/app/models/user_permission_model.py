from sqlalchemy import (
    ForeignKey,
    Boolean,
    UniqueConstraint
)

from sqlalchemy.orm import (
    Mapped,
    mapped_column,
    relationship
)

from app.core.base_model import BaseModel
from app.core.database import Base


class UserPermission(
    Base,
    BaseModel
):
    __tablename__ = "user_permissions"

    __table_args__ = (
        UniqueConstraint(
            "user_id",
            "permission_id",
            name="uq_user_permission"
        ),
    )

    user_id: Mapped[str] = mapped_column(
        ForeignKey("users.id"),
        nullable=False
    )

    permission_id: Mapped[str] = mapped_column(
        ForeignKey("permissions.id"),
        nullable=False
    )

    is_granted: Mapped[bool] = mapped_column(
        Boolean,
        default=True,
        nullable=False
    )

    user = relationship(
        "User",
        back_populates="user_permissions"
    )

    permission = relationship(
        "Permission",
        back_populates="user_permissions"
    )