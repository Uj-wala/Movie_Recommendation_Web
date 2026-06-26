from sqlalchemy import String
from sqlalchemy.orm import mapped_column, relationship

from app.core.base_model import BaseModel
from app.core.database import Base


class Role(
    Base,
    BaseModel
):
    __tablename__ = "roles"

    name = mapped_column(
        String(50),
        unique=True,
        nullable=False
    )

    description = mapped_column(
        String(255),
        nullable=True
    )
    
    users = relationship(
        "User",
        back_populates="role"
    )

    role_permissions = relationship(
        "RolePermission",
        back_populates="role",
        cascade="all, delete-orphan"
    )