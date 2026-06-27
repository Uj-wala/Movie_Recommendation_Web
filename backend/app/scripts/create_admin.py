from sqlalchemy import func
from sqlalchemy.orm import Session

from app.core.config import settings
from app.core.database import SessionLocal
from app.core.security import hash_password
from app.core.security import hash_security_answer
from app.core.enums import (
    SecurityQuestion,
)

from app.models.user_model import User
from app.models.country_model import Country
from app.models.role_model import Role


def create_admin() -> bool:

    if not settings.ADMIN_EMAIL or not settings.ADMIN_PASSWORD:
        print(
            "Admin provisioning skipped: ADMIN_EMAIL and ADMIN_PASSWORD are required"
        )
        return False

    db: Session = SessionLocal()

    try:
        admin_email = settings.ADMIN_EMAIL.strip().lower()

        admin_role = (
            db.query(Role)
            .filter(func.lower(Role.name) == "admin")
            .first()
        )

        if not admin_role:
            raise RuntimeError("Admin role not found. Seed roles before creating admin.")

        country = (
            db.query(Country)
            .filter(
                func.upper(Country.iso_code)
                == settings.ADMIN_COUNTRY_ISO_CODE.strip().upper()
            )
            .first()
        )

        if not country:
            raise RuntimeError(
                f"Country record not found: {settings.ADMIN_COUNTRY_ISO_CODE}"
            )

        existing_admin = (
            db.query(User)
            .filter(func.lower(User.email) == admin_email)
            .first()
        )

        if existing_admin:
            if existing_admin.role_id != admin_role.id:
                existing_admin.role_id = admin_role.id
                db.commit()
                print("Existing admin account assigned to the admin role")
            else:
                print("Admin account already exists")

            return False

        admin = User(
            full_name=settings.ADMIN_FULL_NAME,
            email=admin_email,
            phone_number=settings.ADMIN_PHONE_NUMBER,
            country_id=country.id,
            password_hash=hash_password(settings.ADMIN_PASSWORD),
            role_id=admin_role.id,
            security_question=(SecurityQuestion.FAVORITE_COUNTRY),
            security_answer_hash=(
                hash_security_answer(settings.ADMIN_SECURITY_ANSWER)
                if settings.ADMIN_SECURITY_ANSWER
                else None
            ),
            is_verified=True,
            is_active=True,
            profile_completed=True,
            failed_login_attempts=0,
        )

        db.add(admin)

        db.commit()

        db.refresh(admin)

        print("Admin account created successfully")
        return True

    except Exception as exception:

        db.rollback()

        print(f"Failed to create admin: {exception}")

        raise

    finally:

        db.close()


if __name__ == "__main__":
    create_admin()
