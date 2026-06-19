from sqlalchemy.orm import Session

from app.core.database import SessionLocal
from app.models.subject_model import Subject


SUBJECTS = [
    {
        "name": "Mathematics",
        "description": "Mathematics subject"
    },
    {
        "name": "Science",
        "description": "Science subject"
    },
    {
        "name": "Physics",
        "description": "Physics subject"
    },
    {
        "name": "Chemistry",
        "description": "Chemistry subject"
    },
    {
        "name": "Biology",
        "description": "Biology subject"
    },
    {
        "name": "English",
        "description": "English language subject"
    },
    {
        "name": "Computer Science",
        "description": "Computer Science subject"
    },
    {
        "name": "History",
        "description": "History subject"
    },
    {
        "name": "Geography",
        "description": "Geography subject"
    },
    {
        "name": "Economics",
        "description": "Economics subject"
    },
    {
        "name": "Data Analytics",
        "description": "Data Analytics subject"
    },
    {
        "name": "AI Chart Tools",
        "description": "AI Chart Tools subject"
    },
    {
        "name":"Data Science",
        "description": "Data Science subject"
    }
]


def seed_subjects():
    db: Session = SessionLocal()

    try:

        for subject_data in SUBJECTS:

            existing_subject = (
                db.query(Subject)
                .filter(
                    Subject.name == subject_data["name"]
                )
                .first()
            )

            if existing_subject:
                print(
                    f"Subject already exists: {subject_data['name']}"
                )
                continue

            subject = Subject(
                name=subject_data["name"],
                description=subject_data["description"]
            )

            db.add(subject)

        db.commit()

        print("Subjects seeded successfully")

    except Exception as e:
        db.rollback()
        print(f"Subject seeding failed: {e}")
        raise

    finally:
        db.close()


if __name__ == "__main__":
    seed_subjects()