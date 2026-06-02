from sqlalchemy import or_
from sqlalchemy.orm import Session
 
from app.models.user_model import User
 
 
def get_user_by_identifier(db: Session, identifier: str) -> User | None:
    return db.query(User).filter(
        or_(User.email == identifier, User.phone_number == identifier)
    ).first()
 
 
def get_user_by_id(db: Session, user_id: int) -> User | None:
    return db.query(User).filter(User.id == user_id).first()