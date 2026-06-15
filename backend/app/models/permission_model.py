from sqlalchemy import String
from sqlalchemy.orm import mapped_column, relationship

from app.core.base_model import BaseModel
from app.core.database import Base


class Permission(
    Base,
    BaseModel
):
    __tablename__ = "permissions"

    name = mapped_column(
        String(100),
        unique=True,
        nullable=False
    )

    description = mapped_column(
        String(255),
        nullable=True
    )

    role_permissions = relationship(
        "RolePermission",
        back_populates="permission",
        cascade="all, delete-orphan"
    )

    user_permissions = relationship(
        "UserPermission",
        back_populates="permission",
        cascade="all, delete-orphan"
    )