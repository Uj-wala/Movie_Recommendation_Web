from fastapi import HTTPException, UploadFile, status
from sqlalchemy.orm import Session

from app.models.user_model import User
from app.repository.teacher_profile_repository import (
    get_subjects_by_ids,
    get_teacher_profile_by_user_id,
    replace_teacher_subjects,
)
from app.schemas.teacher_profile_schema import (
    TeacherDashboardResponse,
    TeacherPasswordUpdate,
    TeacherProfileResponse,
    TeacherProfileUpdate,
)
from app.utils.teacher_image_upload import (
    delete_file_if_exists_teacher,
    save_teacher_profile_image,
)

# Change these imports based on your actual password utility file.
from app.core.security import hash_password, verify_password


def build_teacher_profile_response(
    user: User,
    profile,
) -> TeacherProfileResponse:
    subjects = [
        item.subject.name
        for item in profile.subjects
    ]

    return TeacherProfileResponse(
        id=user.id,
        full_name=user.full_name,
        email=user.email,
        phone_number=user.phone_number,
        subjects=subjects,
        years_of_experience=profile.years_of_experience,
        qualification=profile.qualification,
        bio=profile.bio,
        profile_image=user.profile_image_url,
    )


def get_teacher_profile_service(
    db: Session,
    current_user: User,
) -> TeacherProfileResponse:
    profile = get_teacher_profile_by_user_id(
        db,
        current_user.id,
    )

    if profile is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Teacher profile not found",
        )

    return build_teacher_profile_response(
        current_user,
        profile,
    )


def update_teacher_profile_service(
    db: Session,
    current_user: User,
    teacher_update: TeacherProfileUpdate,
) -> TeacherProfileResponse:
    profile = get_teacher_profile_by_user_id(
        db,
        current_user.id,
    )

    if profile is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Teacher profile not found",
        )
    
    phone = teacher_update.phone_number
    if phone and not phone.startswith("+"):
        phone = f"+{phone}"
 

    try:
        if teacher_update.full_name is not None:
            current_user.full_name = teacher_update.full_name

        if teacher_update.qualification is not None:
            profile.qualification = teacher_update.qualification

        if teacher_update.years_of_experience is not None:
            profile.years_of_experience = (
                teacher_update.years_of_experience.value
            )

        if teacher_update.bio is not None:
            profile.bio = teacher_update.bio

        if teacher_update.phone_number is not None:
            current_user.phone_number = phone

        if teacher_update.subject_ids is not None:
            subjects = get_subjects_by_ids(
                db,
                teacher_update.subject_ids,
            )

            if len(subjects) != len(teacher_update.subject_ids):
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="One or more subjects are invalid",
                )

            replace_teacher_subjects(
                db,
                profile.id,
                teacher_update.subject_ids,
            )

        db.add(current_user)
        db.add(profile)
        db.commit()

        db.refresh(current_user)
        db.refresh(profile)

    except Exception:
        db.rollback()
        raise

    return build_teacher_profile_response(
        current_user,
        profile,
    )


def update_teacher_password_service(
    db: Session,
    current_user: User,
    password_update: TeacherPasswordUpdate,
) -> dict:
    if password_update.new_password != password_update.confirm_password:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="New password and confirm password do not match",
        )

    if not verify_password(
        password_update.current_password,
        current_user.password_hash,
    ):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Current password is incorrect",
        )

    if verify_password(
        password_update.new_password,
        current_user.password_hash,
    ):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="New password must be different from current password",
        )

    try:
        current_user.password_hash = hash_password(
            password_update.new_password
        )

        db.add(current_user)
        db.commit()
        db.refresh(current_user)

    except Exception:
        db.rollback()
        raise

    return {
        "message": "Password updated successfully",
    }


def upload_teacher_profile_image_service(
    db: Session,
    current_user: User,
    file: UploadFile,
) -> TeacherProfileResponse:
    profile = get_teacher_profile_by_user_id(
        db,
        current_user.id,
    )

    if profile is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Teacher profile not found",
        )

    old_image_url = current_user.profile_image_url

    new_image_url = save_teacher_profile_image(
        file,
        current_user.id,
    )

    try:
        current_user.profile_image_url = new_image_url

        db.add(current_user)
        db.commit()
        db.refresh(current_user)

    except Exception:
        db.rollback()
        delete_file_if_exists_teacher(new_image_url)
        raise

    if old_image_url != new_image_url:
        delete_file_if_exists_teacher(old_image_url)

    return build_teacher_profile_response(
        current_user,
        profile,
    )


def get_teacher_dashboard_service(
    db: Session,
    current_user: User,
) -> TeacherDashboardResponse:
    profile = get_teacher_profile_by_user_id(
        db,
        current_user.id,
    )

    if profile is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Teacher profile not found",
        )

    subjects = [
        item.subject.name
        for item in profile.subjects
    ]

    return TeacherDashboardResponse(
        full_name=current_user.full_name,
        subjects=subjects,
        years_of_experience=profile.years_of_experience,
        qualification=profile.qualification,
        subjects_handling=0,
        assignments_assigned=0,
        students_above_80=0,
    )