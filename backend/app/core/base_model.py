import uuid

from sqlalchemy import String, DateTime, func
from sqlalchemy.orm import declared_attr, mapped_column


class UUIDMixin:

    @declared_attr
    def id(cls):

        return mapped_column(
            String(36),
            primary_key=True,
            default=lambda: str(uuid.uuid4())
        )


class TimestampMixin:

    @declared_attr
    def created_at(cls):

        return mapped_column(
            DateTime,
            server_default=func.now(),
            nullable=False
        )

    @declared_attr
    def updated_at(cls):

        return mapped_column(
            DateTime,
            server_default=func.now(),
            onupdate=func.now(),
            nullable=False
        )


class BaseModel(
    UUIDMixin,
    TimestampMixin
):
    pass