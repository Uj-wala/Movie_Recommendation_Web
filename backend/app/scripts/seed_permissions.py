from sqlalchemy.orm import Session

from app.core.database import SessionLocal
from app.models.permission_model import Permission


PERMISSIONS = [
    {
        "name": "VIEW_COURSES",
        "description": "View available courses"
    },
    {
        "name": "ATTEMPT_QUIZ",
        "description": "Attempt quizzes"
    },
    {
        "name": "VIEW_DASHBOARD",
        "description": "View dashboard"
    },
    {
        "name": "MANAGE_USERS",
        "description": "Manage system users"
    },
    {
        "name": "CREATE_COURSES",
        "description": "Create and manage courses"
    },
    {
        "name": "ACCESS_REPORTS",
        "description": "Access reports and analytics"
    }
]


def seed_permissions():
    db: Session = SessionLocal()

    try:

        for permission_data in PERMISSIONS:

            existing_permission = (
                db.query(Permission)
                .filter(
                    Permission.name == permission_data["name"]
                )
                .first()
            )

            if existing_permission:
                print(
                    f"Permission already exists: "
                    f"{permission_data['name']}"
                )
                continue

            permission = Permission(
                name=permission_data["name"],
                description=permission_data["description"]
            )

            db.add(permission)

        db.commit()

        print("Permissions seeded successfully")

    except Exception as e:

        db.rollback()

        print(
            f"Permission seeding failed: {e}"
        )

        raise

    finally:

        db.close()


if __name__ == "__main__":
    seed_permissions()