from fastapi import APIRouter, Depends, HTTPException, Request, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.dependencies import get_current_user
from app.core.jwt_handler import create_access_token, create_refresh_token, decode_token
from app.models.user import User
from app.schemas.auth import (
    ChangePasswordRequest,
    ChangePasswordVerify,
    ForgotPasswordRequest,
    MessageResponse,
    PasswordLogin,
    RefreshRequest,
    RegisterRequest,
    ResetPasswordRequest,
    SendEmailOTP,
    SendPhoneOTP,
    TokenResponse,
    VerifyEmailOTP,
    VerifyPhoneOTP,
)
from app.schemas.user import ProfileOut
from app.services import auth_service, recommendation_service
from app.utils.rate_limit import limiter

router = APIRouter(prefix="/auth", tags=["auth"])


def _tokens(user: User) -> TokenResponse:
    return TokenResponse(
        access_token=create_access_token(user.id, user.is_admin),
        refresh_token=create_refresh_token(user.id),
    )


def _generate_recommendations_on_login(user: User, db: Session):
    """Generate recommendations for user on login (non-blocking)."""
    try:
        recommendation_service.generate(db, user.id)
    except Exception:
        # Silently fail - don't block login if recommendations fail
        pass


@router.post("/register", response_model=ProfileOut, status_code=201)
def register(data: RegisterRequest, db: Session = Depends(get_db)):
    user = auth_service.register(db, data)
    return ProfileOut.model_validate(user)


@router.post("/login", response_model=TokenResponse)
@router.post("/login/password", response_model=TokenResponse)
def login_password(data: PasswordLogin, db: Session = Depends(get_db)):
    """Email + password login, returning access & refresh JWTs."""
    user = auth_service.login_with_password(db, data.email, data.password)
    _generate_recommendations_on_login(user, db)
    return _tokens(user)


@router.post("/send-email-otp", response_model=MessageResponse)
def send_email_otp(data: SendEmailOTP, request: Request, db: Session = Depends(get_db)):
    limiter(request, "send-email-otp", max_calls=5, window_seconds=60)
    auth_service.send_login_email_otp(db, data.email)
    return MessageResponse(message="OTP sent to your email")


@router.post("/send-phone-otp", response_model=MessageResponse)
def send_phone_otp(data: SendPhoneOTP, request: Request, db: Session = Depends(get_db)):
    limiter(request, "send-phone-otp", max_calls=5, window_seconds=60)
    auth_service.send_login_phone_otp(db, data.phone_number)
    return MessageResponse(message="OTP sent to your phone")


@router.post("/verify-email-otp", response_model=TokenResponse)
@router.post("/login/email", response_model=TokenResponse)
def verify_email_otp(data: VerifyEmailOTP, db: Session = Depends(get_db)):
    user = auth_service.verify_login_email(db, data.email, data.otp)
    _generate_recommendations_on_login(user, db)
    return _tokens(user)


@router.post("/verify-phone-otp", response_model=TokenResponse)
@router.post("/login/phone", response_model=TokenResponse)
def verify_phone_otp(data: VerifyPhoneOTP, db: Session = Depends(get_db)):
    user = auth_service.verify_login_phone(db, data.phone_number, data.otp)
    _generate_recommendations_on_login(user, db)
    return _tokens(user)


@router.post("/forgot-password", response_model=MessageResponse)
def forgot_password(data: ForgotPasswordRequest, request: Request, db: Session = Depends(get_db)):
    limiter(request, "forgot-password", max_calls=5, window_seconds=60)
    auth_service.forgot_password(db, data.email)
    return MessageResponse(message="Password reset OTP sent to your email")


@router.post("/reset-password", response_model=MessageResponse)
def reset_password(data: ResetPasswordRequest, db: Session = Depends(get_db)):
    auth_service.reset_password(db, data.email, data.otp, data.new_password, data.confirm_password)
    return MessageResponse(message="Password updated successfully")


@router.post("/change-password", response_model=MessageResponse)
def change_password(
    data: ChangePasswordRequest,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    auth_service.start_change_password(
        db, user, data.current_password, data.new_password, data.confirm_password
    )
    return MessageResponse(message="OTP sent to your registered email")


@router.post("/change-password/verify", response_model=MessageResponse)
def change_password_verify(
    data: ChangePasswordVerify,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    auth_service.verify_change_password(
        db, user, data.otp, data.new_password, data.confirm_password
    )
    return MessageResponse(message="Password changed successfully")


@router.post("/refresh", response_model=TokenResponse)
def refresh(data: RefreshRequest, db: Session = Depends(get_db)):
    payload = decode_token(data.refresh_token)
    if payload.get("type") != "refresh":
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Invalid refresh token")
    user = db.query(User).filter(User.id == payload.get("sub")).first()
    if not user:
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "User not found")
    return _tokens(user)
