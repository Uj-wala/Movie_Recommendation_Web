from fastapi import (
    APIRouter,
    Depends,
    File,
    Query,
    UploadFile,
    status,
)
from sqlalchemy.orm import Session
 
from app.core.database import get_db
from app.core.dependencies import get_current_active_teacher, required_role
from app.models.user_model import User
 
# ── Existing schemas ──────────────────────────────────────────
from app.schemas.teacher_profile_schema import (
    TeacherDashboardResponse,
    TeacherPasswordUpdate,
    TeacherProfileResponse,
    TeacherProfileUpdate,
    UpdateEmailRequest,
    VerifyEmailOTPRequest,
    OTPSentResponse,
    OTPVerifyResponse,
    AddPhoneRequest,
    VerifyPhoneOTPRequest,
    PhoneOTPSentResponse,
    PhoneOTPVerifyResponse,
    AddEmailRequest,
    UpdatePhoneRequest,
)
 
# ── Existing services ─────────────────────────────────────────
from app.services.teacher_profile_service import (
    get_teacher_dashboard_service,
    get_teacher_profile_service,
    update_teacher_password_service,
    update_teacher_profile_service,
    upload_teacher_profile_image_service,
)
 
# ── New contact services ──────────────────────────────────────
from app.services.parent_teacher_contact_service import (
    add_new_email_service,
    Update_email_service,
    verify_add_email_otp_service,
    add_new_phone_service,
    verify_add_phone_otp_service,
    update_phone_service,
)
 
 
router = APIRouter(
    prefix="/teacher",
    tags=["Teacher"],
)
 
 
# ════════════════════════════════════════════════════════════════
#  EXISTING ENDPOINTS — unchanged
# ════════════════════════════════════════════════════════════════
 
@router.get(
    "/profile",
    status_code=status.HTTP_200_OK,
    response_model=TeacherProfileResponse,
    summary="Get Teacher Profile",
)
def get_teacher_profile(
    db: Session = Depends(get_db),
    current_user: User = Depends(
        get_current_active_teacher
    ),
) -> TeacherProfileResponse:
    return get_teacher_profile_service(
        db,
        current_user,
    )
 
 
@router.patch(
    "/profile",
    status_code=status.HTTP_200_OK,
    response_model=TeacherProfileResponse,
    summary="Update Teacher Profile",
)
def update_teacher_profile(
    update_teacher: TeacherProfileUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(
        get_current_active_teacher
    ),
) -> TeacherProfileResponse:
    return update_teacher_profile_service(
        db,
        current_user,
        update_teacher,
    )
 
 
@router.patch(
    "/profile/password",
    status_code=status.HTTP_200_OK,
    summary="Update Teacher Password",
)
def update_teacher_password(
    password_update: TeacherPasswordUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(
        get_current_active_teacher
    ),
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
    summary="Upload Teacher Profile Image",
)
def upload_teacher_profile_image(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(
        get_current_active_teacher
    ),
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
    summary="Get Teacher Dashboard",
)
def get_teacher_dashboard(
    db: Session = Depends(get_db),
    current_user: User = Depends(
        get_current_active_teacher
    ),
) -> TeacherDashboardResponse:
    return get_teacher_dashboard_service(
        db,
        current_user,
    )


@router.post(
    "/profile/email/add",
    response_model=OTPSentResponse,
)
def add_email(
    payload: AddEmailRequest,
    db: Session = Depends(get_db),
    current_user=Depends(
        required_role(["teacher"])
    ),
):
    return add_new_email_service(
        db,
        current_user,
        payload,
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
        required_role(["teacher"])
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
        required_role(["teacher"])
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
    summary="Add New Phone Number",
)
def add_phone(
    payload: AddPhoneRequest,
    db: Session = Depends(get_db),
    current_user=Depends(
        required_role(["teacher"])
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
        required_role(["teacher"])
    ),
):
    return update_phone_service(
        db,
        current_user,
        payload,
    )

@router.post(
    "/profile/phone/verify",
    response_model=PhoneOTPVerifyResponse,
    summary="Verify Phone OTP",
)
def verify_phone(
    payload: VerifyPhoneOTPRequest,
    db: Session = Depends(get_db),
    current_user=Depends(
        required_role(["teacher"])
    ),
):
    return verify_add_phone_otp_service(
        db,
        current_user,
        payload,
    )
 
 