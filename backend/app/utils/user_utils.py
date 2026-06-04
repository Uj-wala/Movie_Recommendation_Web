# app/utils/user_utils.py

from sqlalchemy.orm import Session
from sqlalchemy import or_
from app.models.user_model import User


def get_user_by_identifier(db: Session, identifier: str):
    return (
        db.query(User)
        .filter(
            or_(
                User.email == identifier,
                User.phone_number == identifier
            )
        )
        .first()
    )