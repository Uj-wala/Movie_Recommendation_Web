from fastapi import APIRouter, status

from fastapi import Depends

from sqlalchemy.orm import Session

from app.core.database import get_db

from app.core.dependencies import (
    get_current_active_teacher,
    get_current_user,
    required_role,
)

from app.schemas.parent_profile_schema import *

from app.services.parent_profile_service import *

from app.services.parent_teacher_contact_service import (
    add_new_email_service,
    Update_email_service,
    verify_add_email_otp_service,
    add_new_phone_service,
    verify_add_phone_otp_service,
    update_phone_service,
)


router = APIRouter(prefix="/parent-profile", tags=["Parent Profile"])


@router.get(
    "",
    response_model=ParentProfileResponse
)
def get_profile(
    db: Session = Depends(get_db),
    current_user=Depends(
        required_role(["parent", "admin"])
    )
):
    return get_parent_profile(
        current_user,
        db
    )


@router.patch(
    "",
    response_model=MessageResponse
)
def update_profile(
    data: UpdateParentProfileRequest,
    db: Session = Depends(get_db),
    current_user=Depends(
        required_role(["parent", "admin"])
    )
):
    return update_parent_profile(
        data,
        current_user,
        db
    )


@router.post(
    "/children",
    response_model=MessageResponse
)
def add_child_route(
    data: AddChildRequest,
    db: Session = Depends(get_db),
    current_user=Depends(
        required_role(["parent", "admin"])
    )
):
    return add_child(
        data,
        current_user,
        db
    )


@router.delete(
    "/children/{child_id}",
    response_model=MessageResponse
)
def remove_child_route(
    child_id: str,
    db: Session = Depends(get_db),
    current_user=Depends(
        required_role(["parent", "admin"])
    )
):
    return remove_child(
        child_id,
        current_user,
        db
    )


@router.patch(
    "/password",
    response_model=MessageResponse,
)
def update_parent_password(
    password_update: ParentPasswordUpdate,
    db: Session = Depends(get_db),
    current_user=Depends(
        required_role(["parent"])
    ),
):
    return update_parent_password_service(
        db=db,
        current_user=current_user,
        password_update=password_update,
    )


@router.get(
    "/dashboard",
    response_model=ParentDashboardResponse
)
def get_parent_dashboard(
    db: Session = Depends(get_db),
    current_user=Depends(
        required_role(["parent"])
    )
):
    return get_parent_dashboard_service(
        db,
        current_user
    )


@router.get(
    "/student/{registration_number}",
    response_model=StudentLookupResponse
)
def get_student_details(
    registration_number: str,
    db: Session = Depends(get_db),
    current_user=Depends(
        required_role(["parent", "admin"])
    )
):
    return get_student_details_service(
        registration_number,
        db
    )


@router.post(
    "/profile/email/add",
    response_model=OTPSentResponse,
    status_code=status.HTTP_200_OK,
    summary="Add New Email",
)
def add_new_email(
    payload: AddEmailRequest,
    db: Session = Depends(get_db),
    current_user=Depends(
        required_role(["parent"])
    ),
):
    return add_new_email_service(
        db=db,
        current_user=current_user,
        payload=payload,
    )


@router.post(
    "/profile/email/update",
    response_model=OTPSentResponse,
    status_code=status.HTTP_200_OK,
    summary="Update Email",
)
def update_email(
    payload: UpdateEmailRequest,
    db: Session = Depends(get_db),
    current_user=Depends(
        required_role(["parent"])
    ),
):
    return Update_email_service(
        db=db,
        current_user=current_user,
        payload=payload,
    )


@router.post(
    "/profile/email/verify",
    response_model=OTPVerifyResponse,
    status_code=status.HTTP_200_OK,
    summary="Verify Email OTP",
)
def verify_email_otp(
    payload: VerifyEmailOTPRequest,
    db: Session = Depends(get_db),
    current_user=Depends(
        required_role(["parent"])
    ),
):
    return verify_add_email_otp_service(
        db=db,
        current_user=current_user,
        payload=payload,
    )


@router.post(
    "/profile/phone/add",
    response_model=PhoneOTPSentResponse,
    status_code=status.HTTP_200_OK,
    summary="Add New Phone Number",
)
def add_phone(
    payload: AddPhoneRequest,
    db: Session = Depends(get_db),
    current_user=Depends(
        required_role(["parent"])
    ),
):
    return add_new_phone_service(
        db,
        current_user,
        payload,
    )

@router.post(
    "/profile/phone/update",
    response_model=PhoneOTPSentResponse,
    summary="Update Phone Number",
)
def update_phone(
    payload: UpdatePhoneRequest,
    db: Session = Depends(get_db),
    current_user=Depends(
        required_role(["parent"])
    ),
):
    return update_phone_service(
        db=db,
        current_user=current_user,
        payload=payload,
    )

@router.post(
    "/profile/phone/verify",
    response_model=PhoneOTPVerifyResponse,
    status_code=status.HTTP_200_OK,
    summary="Verify Phone OTP",
)
def verify_phone(
    payload: VerifyPhoneOTPRequest,
    db: Session = Depends(get_db),
    current_user=Depends(
        required_role(["parent"])
    ),
):
    return verify_add_phone_otp_service(
        db,
        current_user,
        payload,
    )