from sqlalchemy.orm import Session

from app.core.database import SessionLocal
from app.core.security import hash_password
from app.core.security import hash_security_answer
from app.core.enums import (
    UserRole,
    SecurityQuestion,
)

from app.models.user_model import User
from app.models.country_model import Country


def create_admin():

    db: Session = SessionLocal()

    try:

        existing_admin = db.query(User).filter(User.email == "admin@aipeta.com").first()

        if existing_admin:
            print("Admin already exists")
            return

        country = db.query(Country).filter(Country.iso_code == "IN").first()

        if not country:
            raise Exception("India country record not found")

        admin = User(
            full_name="System Administrator",
            email="admin@aipeta.com",
            phone_number="9999999999",
            country_id=country.id,
            password_hash=hash_password("Admin@123"),
            role=UserRole.ADMIN,
            security_question=(SecurityQuestion.FAVORITE_COUNTRY),
            security_answer_hash=hash_security_answer("India"),
            is_verified=True,
            is_active=True,
            profile_completed=True,
            failed_login_attempts=0,
        )

        db.add(admin)

        db.commit()

        db.refresh(admin)

        print(f"Admin created successfully. ID: {admin.id}")

    except Exception as exception:

        db.rollback()

        print(f"Failed to create admin: {exception}")

        raise

    finally:

        db.close()


if __name__ == "__main__":
    create_admin()
