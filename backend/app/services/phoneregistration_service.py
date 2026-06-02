from sqlalchemy.orm import Session
from fastapi import HTTPException
from passlib.context import CryptContext
from app.core.security import hash_password, hash_security_answer
from app.models.user_model import User
from app.models.student_profile_model import StudentProfile
from app.models.parent_profile_model import ParentProfile
from app.models.teacher_profile_model import TeacherProfile
from app.core.enums import UserRole, SecurityQuestion
from app.schemas.user_schema import (
    RegisterRequest,
    ConfirmRoleRequest,
    StudentDetailsRequest,
    ParentVerificationRequest,
    TeacherVerificationRequest
)

def register_by_phone(data: RegisterRequest, db: Session):

    if data.password != data.confirm_password:
        raise HTTPException(
            status_code=400,
            detail="Passwords do not match"
        )

    if not data.agree_terms:
        raise HTTPException(
            status_code=400,
            detail="You must agree to the terms and conditions"
        )

    existing_user = db.query(User).filter(
        User.phone_number == data.phone_number
    ).first()

    if existing_user:
        raise HTTPException(
            status_code=400,
            detail="This phone number is already registered"
        )

    new_user = User(
        full_name=data.full_name,
        phone_number=data.phone_number,
        email=None,
        password_hash=hash_password(data.password),
        security_question=SecurityQuestion(data.security_question),
        security_answer_hash=hash_security_answer(data.security_answer),
        role=UserRole(data.role),
        failed_login_attempts=0,
        is_active=True,
        is_verified=False,
        profile_completed=False,
        country_id=data.country_id
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return new_user


def confirm_role(data: ConfirmRoleRequest, db: Session):

    user = db.query(User).filter(
        User.id == data.user_id
    ).first()

    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    user.role = data.role
    db.commit()
    db.refresh(user)

    return {
        "message": "Role confirmed successfully",
        "user_id": user.id,
        "role": user.role.value
    }


def save_student_details(data: StudentDetailsRequest, db: Session):

    user = db.query(User).filter(
        User.id == data.user_id
    ).first()

    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    existing_profile = db.query(StudentProfile).filter(
        StudentProfile.user_id == data.user_id
    ).first()

    if existing_profile:
        raise HTTPException(
            status_code=400,
            detail="Student profile already exists"
        )

    student_profile = StudentProfile(
        user_id=data.user_id,
        grade=data.grade,
        workplace=data.work_place,
        school_name=data.school_name
    )

    db.add(student_profile)
    user.profile_completed = True
    db.commit()

    return {
        "message": "Registration successful! You can now access the Dashboard.",
        "user_id": data.user_id
    }


def save_parent_verification(data: ParentVerificationRequest, db: Session):

    user = db.query(User).filter(
        User.id == data.user_id
    ).first()

    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    existing_profile = db.query(ParentProfile).filter(
        ParentProfile.user_id == data.user_id
    ).first()

    if existing_profile:
        raise HTTPException(
            status_code=400,
            detail="Parent profile already exists"
        )

    parent_profile = ParentProfile(
        user_id=data.user_id,
        child_name=data.child_name,
        child_grade=data.child_grade,
        student_reference_id=data.student_reference_id
    )

    db.add(parent_profile)
    user.profile_completed = True
    db.commit()

    return {
        "message": "Registration successful! You can now access the Dashboard.",
        "user_id": data.user_id
    }


def save_teacher_verification(data: TeacherVerificationRequest, db: Session):

    user = db.query(User).filter(
        User.id == data.user_id
    ).first()

    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    existing_profile = db.query(TeacherProfile).filter(
        TeacherProfile.user_id == data.user_id
    ).first()

    if existing_profile:
        raise HTTPException(
            status_code=400,
            detail="Teacher profile already exists"
        )

    teacher_profile = TeacherProfile(
        user_id=data.user_id,
        school_name=data.school_name,
        subject=data.subject
    )

    db.add(teacher_profile)
    user.profile_completed = True
    db.commit()

    return {
        "message": "Registration successful! You can now access the Dashboard.",
        "user_id": data.user_id
    }