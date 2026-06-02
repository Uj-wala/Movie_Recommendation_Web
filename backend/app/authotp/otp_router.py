from fastapi import (
    APIRouter,
    Depends,
    HTTPException
)

from sqlalchemy.orm import Session

from app.core.database import get_db

from app.schemas.otp_verification_schema import (
    VerifyOTPRequest,
    ResendOTPRequest,
    SendEmailOTPRequest,
    VerifyEmailOTPRequest
)

from app.services.otp_service import OTPService


router = APIRouter(
    prefix="/auth",
    tags=["OTP"]
)


# -------------------------
# PHONE OTP
# -------------------------

@router.post("/resend-otp")
def resend_otp(
    payload: ResendOTPRequest,
    db: Session = Depends(get_db)
):
    message = OTPService.resend_otp(
        db,
        payload.phone_number
    )

    return {
        "message": message
    }


@router.post("/verify-otp")
def verify_otp(
    payload: VerifyOTPRequest,
    db: Session = Depends(get_db)
):
    success, message = OTPService.verify_otp(
        db,
        payload.phone_number,
        payload.otp_code
    )

    if not success:
        raise HTTPException(
            status_code=400,
            detail=message
        )

    return {
        "message": message
    }


# -------------------------
# EMAIL OTP
# -------------------------

@router.post("/send-email-otp")
def send_email_otp_route(
    payload: SendEmailOTPRequest
):
    OTPService.send_email_otp(
        payload.email
    )

    return {
        "message": "Email OTP sent successfully"
    }


@router.post("/verify-email-otp")
def verify_email_otp_route(
    payload: VerifyEmailOTPRequest,
    db: Session = Depends(get_db)
):
    success, message = OTPService.verify_email_otp(
        db,
        payload.email,
        payload.otp_code
    )

    if not success:
        raise HTTPException(
            status_code=400,
            detail=message
        )

    return {
        "message": message
    }