import json
from typing import Any

from fastapi import HTTPException, UploadFile, status
from sqlalchemy.orm import Session

from app.models.student_profile_model import StudentProfile
from app.models.user_model import User
from app.repository.student_profile_repository import (
    get_student_profile_by_user_id,
)
from app.schemas.student_profile_schema import (
    StudentDashboardResponse,
    StudentProfileResponse,
    StudentProfileUpdate,
)
from app.utils.student_image_upload import (
    delete_file_if_exists,
    save_student_profile_image,
)


def parse_learning_interests(
    value: str | list[str] | None,
) -> list[str]:
    """Convert the database Text value into a response list."""
    if value is None or value == "":
        return []

    if isinstance(value, list):
        return value

    try:
        decoded = json.loads(value)
    except (json.JSONDecodeError, TypeError):
        return []

    return decoded if isinstance(decoded, list) else []


def serialize_learning_interests(
    interests: list[str],
) -> str:
    """Convert the request list into JSON for the Text column."""
    return json.dumps(
        interests,
        ensure_ascii=True,
    )


def enum_value(value: Any) -> Any:
    """Return an enum's database value or the original value"""
    return getattr(value, "value", value)


def build_student_profile_response(
    user: User,
    profile: StudentProfile,
) -> StudentProfileResponse:
    return StudentProfileResponse(
        id=user.id,
        full_name=user.full_name,
        email=user.email,
        grade=profile.grade,
        school_name=profile.school_name,
        learning_interests=parse_learning_interests(
            profile.learning_interests
        ),
        preferred_learning_style=profile.preferred_learning_style,
        profile_image=user.profile_image_url,
    )


def get_student_profile_service(
    db: Session,
    current_user: User,
) -> StudentProfileResponse:
    profile = get_student_profile_by_user_id(
        db,
        current_user.id,
    )

    if profile is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Student profile not found",
        )

    return build_student_profile_response(
        current_user,
        profile,
    )


def update_student_profile_service(
    db: Session,
    current_user: User,
    payload: StudentProfileUpdate,
) -> StudentProfileResponse:
    profile = get_student_profile_by_user_id(
        db,
        current_user.id,
    )

    if profile is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Student profile not found",
        )

    update_data = payload.model_dump(exclude_unset=True)

    try:
        if "full_name" in update_data:
            current_user.full_name = update_data["full_name"]

        if "grade" in update_data:
            profile.grade = enum_value(update_data["grade"])

        if "school_name" in update_data:
            profile.school_name = update_data["school_name"]

        if "learning_interests" in update_data:
            profile.learning_interests = serialize_learning_interests(
                update_data["learning_interests"]
            )

        if "preferred_learning_style" in update_data:
            profile.preferred_learning_style = enum_value(
                update_data["preferred_learning_style"]
            )

        db.add(current_user)
        db.add(profile)
        db.commit()

        db.refresh(current_user)
        db.refresh(profile)

    except Exception:
        db.rollback()
        raise

    return build_student_profile_response(
        current_user,
        profile,
    )


def upload_student_profile_image_service(
    db: Session,
    current_user: User,
    file: UploadFile,
) -> StudentProfileResponse:
    profile = get_student_profile_by_user_id(
        db,
        current_user.id,
    )

    if profile is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Student profile not found",
        )

    old_image_url = current_user.profile_image_url

    new_image_url = save_student_profile_image(
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
        delete_file_if_exists(new_image_url)
        raise

    if old_image_url != new_image_url:
        delete_file_if_exists(old_image_url)

    return build_student_profile_response(
        current_user,
        profile,
    )


def get_student_dashboard_service(
    db: Session,
    current_user: User,
) -> StudentDashboardResponse:
    profile = get_student_profile_by_user_id(
        db,
        current_user.id,
    )

    if profile is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Student profile not found",
        )

    return StudentDashboardResponse(
        full_name=current_user.full_name,
        grade=profile.grade,
        learning_interests=parse_learning_interests(
            profile.learning_interests
        ),
        pending_tasks=0,
        ongoing_courses=0,
        completed_courses=0,
    )