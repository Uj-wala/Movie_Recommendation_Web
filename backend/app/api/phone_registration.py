from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.schemas.user_schema import (
    RegisterRequest,
    UserResponse,
    ConfirmRoleRequest,
    ConfirmRoleResponse,
    StudentDetailsRequest,
    StudentDetailsResponse,
    ParentVerificationRequest,
    ParentVerificationResponse
)

from app.schemas.teacher_profile_schema import (
    TeacherProfileCreateRequest,
    TeacherVerificationResponse
)

from app.services.phoneregistration_service import (
    register_by_phone,
    confirm_role,
    save_student_details,
    save_parent_verification,
    save_teacher_verification
)

router = APIRouter(
    prefix="/auth",
    tags=["Authentication"]
)


@router.post(
    "/register/phone",
    response_model=UserResponse,
    status_code=201
)
def phone_register(
    data: RegisterRequest,
    db: Session = Depends(get_db)
):
    return register_by_phone(data, db)


@router.post(
    "/confirm-role",
    response_model=ConfirmRoleResponse,
    status_code=200
)
def confirm_user_role(
    data: ConfirmRoleRequest,
    db: Session = Depends(get_db)
):
    return confirm_role(data, db)


@router.post(
    "/student-verification",
    response_model=StudentDetailsResponse,
    status_code=201,
    summary="Student Verification"
)
def student_details(
    data: StudentDetailsRequest,
    db: Session = Depends(get_db)
):
    return save_student_details(data, db)


@router.post(
    "/parent-verification",
    response_model=ParentVerificationResponse,
    status_code=201
)
def parent_verification(
    data: ParentVerificationRequest,
    db: Session = Depends(get_db)
):
    return save_parent_verification(data, db)


@router.post(
    "/teacher-verification",
    response_model=TeacherVerificationResponse,
    status_code=201
)
def teacher_verification(
    data: TeacherProfileCreateRequest,
    db: Session = Depends(get_db)
):
    return save_teacher_verification(data, db)