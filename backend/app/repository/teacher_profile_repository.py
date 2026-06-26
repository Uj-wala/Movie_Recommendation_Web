from sqlalchemy.orm import Session
from app.models.subject_model import Subject

from app.models.teacher_profile_model import TeacherProfile
from app.models.teacher_subject_model import TeacherSubject

def get_teacher_profile_by_user_id(db: Session,user_id: str,) -> TeacherProfile | None:
    return (
        db.query(TeacherProfile)
        .filter(TeacherProfile.user_id == user_id)
        .first())

def replace_teacher_subjects(
    db: Session,
    teacher_profile_id: str,
    subject_ids: list[str],
):
    db.query(TeacherSubject).filter(
        TeacherSubject.teacher_profile_id == teacher_profile_id
    ).delete()

    for subject_id in subject_ids:
        db.add(
            TeacherSubject(
                teacher_profile_id=teacher_profile_id,
                subject_id=subject_id,
            )
        )

def get_subjects_by_ids(
    db: Session,
    subject_ids: list[str],
):
    return (
        db.query(Subject)
        .filter(
            Subject.id.in_(subject_ids)
        )
        .all()
    )