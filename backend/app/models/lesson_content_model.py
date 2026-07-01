from typing import TYPE_CHECKING

from sqlalchemy import (
    ForeignKey,
    BigInteger,
    String,
    Text,
)
from sqlalchemy.orm import (
    Mapped,
    mapped_column,
    relationship,
)

from app.core.base_model import BaseModel
from app.core.database import Base
if TYPE_CHECKING:
    from app.models.lesson_model import Lesson


class LessonContent(
    Base,
    BaseModel
):
    __tablename__ = "lesson_contents"

    lesson_id: Mapped[str] = mapped_column(
        ForeignKey("lessons.id"),
        nullable=False,
    )

    content_url: Mapped[str | None] = mapped_column(
        String(1000),
        nullable=True,
    )

    text_content: Mapped[str | None] = mapped_column(
        Text,
        nullable=True,
    )

    original_file_name: Mapped[str | None] = mapped_column(
        String(255),
        nullable=True,
    )

    file_size: Mapped[int | None] = mapped_column(
        BigInteger,
        nullable=True,
    )

    mime_type: Mapped[str | None] = mapped_column(
        String(100),
        nullable=True,
    )

    # Relationships

    lesson: Mapped["Lesson"] = relationship(
        "Lesson",
        back_populates="lesson_content",
    )