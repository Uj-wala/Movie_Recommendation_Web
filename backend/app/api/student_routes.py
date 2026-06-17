from fastapi import (
    APIRouter,
    Depends,
    File,
    UploadFile,
    status,
)
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.dependencies import get_current_active_student
from app.models.user_model import User
from app.schemas.student_profile_schema import (
    StudentDashboardResponse,
    StudentProfileResponse,
    StudentProfileUpdate,
)
from app.services.student_profile_service import (
    get_student_dashboard_service,
    get_student_profile_service,
    update_student_profile_service,
    upload_student_profile_image_service,
)


router = APIRouter(
    prefix="/student",
    tags=["Student"],
)


@router.get(
    "/profile",
    response_model=StudentProfileResponse,
    status_code=status.HTTP_200_OK,
)
def get_student_profile(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_student),
) -> StudentProfileResponse:
    return get_student_profile_service(db, current_user)


@router.patch(
    "/profile",
    response_model=StudentProfileResponse,
    status_code=status.HTTP_200_OK,
)
def update_student_profile(
    payload: StudentProfileUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_student),
) -> StudentProfileResponse:
    return update_student_profile_service(
        db,
        current_user,
        payload,
    )


@router.post(
    "/profile/image",
    response_model=StudentProfileResponse,
    status_code=status.HTTP_200_OK,
)
def upload_student_profile_image(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_student),
) -> StudentProfileResponse:
    return upload_student_profile_image_service(
        db,
        current_user,
        file,
    )


@router.get(
    "/dashboard",
    response_model=StudentDashboardResponse,
    status_code=status.HTTP_200_OK,
)
def get_student_dashboard(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_student),
) -> StudentDashboardResponse:
    return get_student_dashboard_service(
        db,
        current_user,
    )