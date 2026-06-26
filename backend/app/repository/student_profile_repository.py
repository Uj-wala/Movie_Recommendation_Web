from sqlalchemy.orm import Session

from app.models.student_profile_model import StudentProfile


def get_student_profile_by_user_id(
    db: Session,
    user_id: int,
) -> StudentProfile | None:
    return (
        db.query(StudentProfile)
        .filter(StudentProfile.user_id == user_id)
        .first()
    )