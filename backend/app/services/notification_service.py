"""Centralized notification creation + queries.

`create()` is the single choke point through which every notification is made,
regardless of trigger. This is where a future delivery mechanism (WebSocket push,
SSE, FCM, email) would emit — callers never change, only this function does.
"""
from sqlalchemy.orm import Session

from app.core.enums import NotificationType
from app.models.notification import Notification


def create(
    db: Session,
    user_id: str,
    type: NotificationType,
    title: str,
    message: str | None = None,
    *,
    dedupe_unread: bool = False,
) -> Notification | None:
    """Create a notification for a user. When dedupe_unread is set, skips creation
    if the user already has an unread notification of the same type."""
    if dedupe_unread:
        existing = (
            db.query(Notification)
            .filter(
                Notification.user_id == user_id,
                Notification.type == type,
                Notification.is_read == False,  # noqa: E712
            )
            .first()
        )
        if existing:
            return None

    notif = Notification(user_id=user_id, type=type, title=title, message=message)
    db.add(notif)
    db.commit()
    db.refresh(notif)
    # Future: emit over WebSocket / push here — a single, delivery-agnostic hook.
    return notif


def list_for_user(db: Session, user_id: str, limit: int = 50) -> list[Notification]:
    return (
        db.query(Notification)
        .filter(Notification.user_id == user_id)
        .order_by(Notification.created_at.desc())
        .limit(limit)
        .all()
    )


def unread_count(db: Session, user_id: str) -> int:
    return (
        db.query(Notification)
        .filter(Notification.user_id == user_id, Notification.is_read == False)  # noqa: E712
        .count()
    )


def mark_read(db: Session, user_id: str, notification_id: str) -> None:
    db.query(Notification).filter(
        Notification.id == notification_id, Notification.user_id == user_id
    ).update({"is_read": True})
    db.commit()


def mark_all_read(db: Session, user_id: str) -> int:
    count = (
        db.query(Notification)
        .filter(Notification.user_id == user_id, Notification.is_read == False)  # noqa: E712
        .update({"is_read": True})
    )
    db.commit()
    return count
