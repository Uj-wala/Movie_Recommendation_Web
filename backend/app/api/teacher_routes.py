from fastapi import APIRouter, Depends, File, UploadFile, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.dependencies import get_current_active_teacher
from app.models.user_model import User
from app.schemas.teacher_profile_schema import (
    TeacherDashboardResponse,
    TeacherPasswordUpdate,
    TeacherProfileResponse,
    TeacherProfileUpdate,
)
from app.services.teacher_profile_service import (
    get_teacher_dashboard_service,
    get_teacher_profile_service,
    update_teacher_password_service,
    update_teacher_profile_service,
    upload_teacher_profile_image_service,
    update_teacher_password_service
)


router = APIRouter(
    prefix="/teacher",
    tags=["Teacher"],
)


@router.get(
    "/profile",
    status_code=status.HTTP_200_OK,
    response_model=TeacherProfileResponse,
)
def get_teacher_profile(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_teacher),
) -> TeacherProfileResponse:
    return get_teacher_profile_service(
        db,
        current_user,
    )


@router.patch(
    "/profile",
    status_code=status.HTTP_200_OK,
    response_model=TeacherProfileResponse,
)
def update_teacher_profile(
    update_teacher: TeacherProfileUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_teacher),
) -> TeacherProfileResponse:
    return update_teacher_profile_service(
        db,
        current_user,
        update_teacher,
    )


@router.patch(
    "/profile/password",
    status_code=status.HTTP_200_OK,
)
def update_teacher_password(
    password_update: TeacherPasswordUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_teacher),
) -> dict:
    return update_teacher_password_service(
        db,
        current_user,
        password_update,
    )


@router.post(
    "/profile/image",
    status_code=status.HTTP_200_OK,
    response_model=TeacherProfileResponse,
)
def upload_teacher_profile_image(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_teacher),
) -> TeacherProfileResponse:
    return upload_teacher_profile_image_service(
        db,
        current_user,
        file,
    )


@router.get(
    "/dashboard",
    status_code=status.HTTP_200_OK,
    response_model=TeacherDashboardResponse,
)
def get_teacher_dashboard(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_teacher),
) -> TeacherDashboardResponse:
    return get_teacher_dashboard_service(
        db,
        current_user,
    )