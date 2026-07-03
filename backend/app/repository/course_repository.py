from sqlalchemy.orm import Session,joinedload

from app.models.course_model import (
    Course,
    CourseStatus,
)
from app.models.subject_model import Subject
from app.models.teacher_profile_model import TeacherProfile
from app.models.coursemodule_model import CourseModule
from app.models.lesson_model import Lesson


# ----------------------------------------------------
# Course
# ----------------------------------------------------

def get_course_by_id(
    db: Session,
    course_id: str,
) -> Course | None:
    return (
        db.query(Course)
        .filter(Course.id == course_id)
        .first()
    )

def get_course_review_by_id(
    db: Session,
    course_id: str,
) -> Course | None:
    return (
        db.query(Course)
        .options(
            joinedload(Course.subject),
            joinedload(Course.modules).joinedload(
                CourseModule.lessons
            ),
        )
        .filter(
            Course.id == course_id
        )
        .first()
    )


def get_courses_by_creator(
    db: Session,
    user_id: str,
):
    return (
        db.query(Course)
        .filter(
            Course.created_by == user_id
        )
        .order_by(
            Course.created_at.desc()
        )
        .all()
    )


def get_all_courses(
    db: Session,
):
    return (
        db.query(Course)
        .order_by(
            Course.created_at.desc()
        )
        .all()
    )


# ----------------------------------------------------
# Subject
# ----------------------------------------------------

def get_subject_by_id(
    db: Session,
    subject_id: str,
):
    return (
        db.query(Subject)
        .filter(
            Subject.id == subject_id
        )
        .first()
    )


# ----------------------------------------------------
# Teacher Profile
# ----------------------------------------------------

def get_teacher_profile_by_user_id(
    db: Session,
    user_id: str,
):
    return (
        db.query(TeacherProfile)
        .filter(
            TeacherProfile.user_id == user_id
        )
        .first()
    )


# ----------------------------------------------------
# Course Status
# ----------------------------------------------------

def get_draft_courses(
    db: Session,
):
    return (
        db.query(Course)
        .filter(
            Course.status == CourseStatus.DRAFT
        )
        .all()
    )


def get_published_courses(
    db: Session,
):
    return (
        db.query(Course)
        .filter(
            Course.status == CourseStatus.PUBLISHED
        )
        .all()
    )


# ----------------------------------------------------
# CRUD
# ----------------------------------------------------

def create_course(
    db: Session,
    course: Course,
):
    db.add(course)
    db.commit()
    db.refresh(course)
    return course


def update_course(
    db: Session,
    course: Course,
):
    db.commit()
    db.refresh(course)
    return course


def delete_course(
    db: Session,
    course: Course,
):
    db.delete(course)
    db.commit()