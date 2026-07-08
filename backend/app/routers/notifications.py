from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.dependencies import get_current_user
from app.models.user import User
from app.schemas.user import NotificationOut
from app.services import notification_service

router = APIRouter(prefix="/notifications", tags=["notifications"])


@router.get("", response_model=list[NotificationOut])
def list_notifications(db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    """The user's notifications, newest first."""
    return notification_service.list_for_user(db, user.id)


@router.get("/unread-count")
def unread_count(db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    return {"count": notification_service.unread_count(db, user.id)}


# PUT is the documented verb; POST kept as an alias for the existing frontend call.
@router.put("/read-all")
def mark_all_read(db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    count = notification_service.mark_all_read(db, user.id)
    return {"message": f"Marked {count} notifications as read"}


@router.put("/{notification_id}/read", status_code=204)
@router.post("/{notification_id}/read", status_code=204)
def mark_read(
    notification_id: str, db: Session = Depends(get_db), user: User = Depends(get_current_user)
):
    notification_service.mark_read(db, user.id, notification_id)
