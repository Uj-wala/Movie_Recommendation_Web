from datetime import datetime, timezone,timedelta
import random
from fastapi import HTTPException, status
from sqlalchemy.orm import Session
from app.models.otp_verification_model import OTPVerification   
from app.core.config import settings
from app.core.jwt_handler import create_access_token, create_refresh_token, decode_token
from app.core.security import hash_password, verify_password
from app.repository.refresh_token_repository import (
    create_refresh_token_record,
    get_refresh_token_by_hash,
    revoke_refresh_token
)
from app.repository.user_repository import get_user_by_id, get_user_by_identifier
from app.schemas.user_schema import (
    BlockedAccountResetRequest,
    ForgotPasswordRequest,
    LoginRequest,
    LogoutRequest,
    RefreshTokenRequest
)
from app.utils.email_utils import send_email_otp
from app.utils.sms_utils import send_sms_otp, verify_sms_otp
from app.utils.token_utils import hash_token
from app.repository.otp_repository import OTPRepository
from app.core.enums import OTPType, OTPChannel
 
 
ACCOUNT_BLOCKED_DETAIL = {
    "title": "Account Blocked",
    "message": "Your account has been temporarily Locked due to multiple failed login attempts. To reset your password, Please answer your security Question",
    "action": "RESET_BLOCKED_ACCOUNT",
    "security_questions": [
        "Which is your favourite country?",
        "Which is your favorite Sport?",
        "Which is your favorite Food?"
    ]
}
 
 
def raise_account_blocked_error():
    raise HTTPException(
        status_code=status.HTTP_403_FORBIDDEN,
        detail=ACCOUNT_BLOCKED_DETAIL
    )
 
 
def login_user(db: Session, payload: LoginRequest):
    user = get_user_by_identifier(db, payload.email_or_phone)
 
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials"
        )
 
    blocked_until = getattr(user, "blocked_until", None)
 
    if user.is_blocked or (
        blocked_until and blocked_until > datetime.now(timezone.utc)
    ):
        raise_account_blocked_error()
 
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="User is inactive"
        )
 
    if not user.is_verified:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="User is not verified"
        )
 
    if not verify_password(payload.password, user.password_hash):
        user.failed_login_attempts += 1
 
        if user.failed_login_attempts >= settings.MAX_LOGIN_ATTEMPTS:
            user.is_blocked = True
            db.commit()
 
            raise_account_blocked_error()
 
        db.commit()
 
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials"
        )
 
    user.failed_login_attempts = 0
    user.last_login_at = datetime.now(timezone.utc)
 
    refresh_token, expires_at = create_refresh_token(user.id)
 
    create_refresh_token_record(
        db=db,
        user_id=user.id,
        token_hash=hash_token(refresh_token),
        expires_at=expires_at
    )
 
    db.commit()
 
    return {
        "access_token": create_access_token(user.id, user.role),
        "refresh_token": refresh_token,
        "token_type": "bearer",
    }
 
 
def refresh_tokens(db: Session, payload: RefreshTokenRequest):
    token_data = decode_token(payload.refresh_token)
 
    if token_data.get("type") != "refresh":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token type"
        )
 
    user_id = token_data.get("sub")
 
    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid refresh token"
        )
 
    user = get_user_by_id(db, int(user_id))
 
    if (
        not user
        or not user.is_active
        or user.is_blocked
        or not user.is_verified
    ):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid refresh token"
        )
 
    stored_token = get_refresh_token_by_hash(
        db=db,
        token_hash=hash_token(payload.refresh_token)
    )
 
    if (
        not stored_token
        or stored_token.revoked
        or stored_token.expires_at < datetime.now(timezone.utc)
    ):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid refresh token"
        )
 
    revoke_refresh_token(stored_token)
 
    new_refresh_token, expires_at = create_refresh_token(user.id)
 
    create_refresh_token_record(
        db=db,
        user_id=user.id,
        token_hash=hash_token(new_refresh_token),
        expires_at=expires_at
    )
 
    db.commit()
 
    return {
        "access_token": create_access_token(user.id, user.role),
        "refresh_token": new_refresh_token,
        "token_type": "bearer",
    }
 
 
def forgot_password(db: Session, payload):
    identifier = payload.email or payload.phone_number
    user = get_user_by_identifier(db, identifier)

    if not user:
        raise HTTPException(404, "User not found")

    if not user.is_active:
        raise HTTPException(403, "User is inactive")

    if payload.email:
        otp_status = send_email_otp(payload.email)
        return {"message": "OTP sent to email"}

    phone = payload.phone_number

    if not phone.startswith("+"):
        phone = f"+91{phone}"

    status = send_sms_otp(phone)

    return {
        "message": "OTP sent via Twilio",
        "status": status
    }
 
def verify_forgot_password_otp(db: Session, payload):

    identifier = payload.email or payload.phone_number
    user = get_user_by_identifier(db, identifier)

    if not user:
        raise HTTPException(404, "User not found")

    phone = payload.phone_number

    if phone and not phone.startswith("+"):
        phone = f"+91{phone}"

    if payload.email:
        raise HTTPException(400, "Email OTP not implemented in Twilio flow")

    verified = verify_sms_otp(phone, payload.otp)

    if not verified:
        raise HTTPException(400, "Invalid OTP")

    return {
        "message": "OTP verified successfully",
        "verified": True
    }
 
 
def reset_blocked_account_password(
    db: Session,
    payload: BlockedAccountResetRequest
):
    user = get_user_by_identifier(db, payload.email_or_phone)
 
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
 
    if not user.is_blocked:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Account is not blocked"
        )
 
    if user.security_question != payload.security_question:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid security question or answer"
        )
 
    if not verify_password(
        payload.security_answer.strip(),
        user.security_answer_hash
    ):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid security question or answer"
        )
 
    user.password_hash = hash_password(payload.new_password)
    user.failed_login_attempts = 0
    user.is_blocked = False
 
    if hasattr(user, "blocked_until"):
        user.blocked_until = None
 
    db.commit()
 
    return {
        "message": "Password reset successfully. Account has been unblocked."
    }
 
 
def logout_user(db: Session, payload: LogoutRequest):
    stored_token = get_refresh_token_by_hash(
        db=db,
        token_hash=hash_token(payload.refresh_token)
    )
 
    if stored_token and not stored_token.revoked:
        revoke_refresh_token(stored_token)
        db.commit()
 
    return {
        "message": "Logged out successfully"
    }
 