from sqlalchemy.orm import Session

from app.core.database import SessionLocal
from app.models.role_model import Role


ROLES = [
    {
        "name": "admin",
        "description": "System administrator with full access"
    },
    {
        "name": "student",
        "description": "Student user"
    },
    {
        "name": "teacher",
        "description": "Teacher user"
    },
    {
        "name": "parent",
        "description": "Parent user"
    }
]


def seed_roles():
    db: Session = SessionLocal()

    try:
        for role_data in ROLES:

            existing_role = (
                db.query(Role)
                .filter(
                    Role.name == role_data["name"]
                )
                .first()
            )

            if existing_role:
                print(
                    f"Role already exists: {role_data['name']}"
                )
                continue

            role = Role(
                name=role_data["name"],
                description=role_data["description"]
            )

            db.add(role)

        db.commit()

        print("Roles seeded successfully")

    except Exception as e:
        db.rollback()
        print(f"Role seeding failed: {e}")
        raise

    finally:
        db.close()


if __name__ == "__main__":
    seed_roles()