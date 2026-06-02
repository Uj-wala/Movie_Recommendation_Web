from sqlalchemy.orm import Session

from app.models.user_model import User


class UserRepository:

    @staticmethod
    def get_by_email(
        db: Session,
        email: str
    ):
        return (
            db.query(User)
            .filter(User.email == email)
            .first()
        )

    @staticmethod
    def get_by_phone(
        db: Session,
        phone_number: str
    ):
        return (
            db.query(User)
            .filter(User.phone_number == phone_number)
            .first()
        )

    @staticmethod
    def get_by_id(
        db: Session,
        user_id: str
    ):
        return (
            db.query(User)
            .filter(User.id == user_id)
            .first()
        )

    @staticmethod
    def create_user(
        db: Session,
        user: User
    ):
        db.add(user)
        db.commit()
        db.refresh(user)

        return user

    @staticmethod
    def update_user(
        db: Session,
        user: User
    ):
        db.commit()
        db.refresh(user)

        return user