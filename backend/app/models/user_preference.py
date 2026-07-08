from sqlalchemy import Float, ForeignKey, String, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.base_model import UUIDMixin
from app.core.database import Base


class UserPreference(Base, UUIDMixin):
    __tablename__ = "user_preferences"
    __table_args__ = (
        UniqueConstraint("user_id", "genre", name="uq_user_preference_genre"),
    )

    user_id: Mapped[str] = mapped_column(
        String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True
    )
    genre: Mapped[str] = mapped_column(String(80), nullable=False)
    preference_score: Mapped[float] = mapped_column(Float, default=0.0, nullable=False)

    user = relationship("User", back_populates="preferences")
