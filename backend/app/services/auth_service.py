from datetime import datetime, timezone, timedelta
import random
 
from fastapi import HTTPException, Query, status
from sqlalchemy.orm import Session

 
from app.core.config import settings
from app.core.enums import OTPChannel, OTPType
from app.core.jwt_handler import (
    create_access_token,
    create_refresh_token,
    decode_token,
)
from app.core.security import hash_password, verify_password, verify_security_answer
 
from app.models.otp_verification_model import OTPVerification
from app.models.user_model import User
 
from app.repository.refresh_token_repository import (
    create_refresh_token_record,
    get_refresh_token_by_hash,
    revoke_refresh_token,
)
from app.repository.user_repository import (
    UserRepository,
    get_user_by_id,
    get_user_by_identifier,
)
 
from app.schemas.user_schema import (
    RegisterRequest,
    ResetPasswordRequest,
    CreateNewPasswordRequest,
    BlockedAccountResetRequest,
    LoginRequest,
    LogoutRequest,
    RefreshTokenRequest,
)
 
from app.utils.email_utils import send_email_otp
from app.utils.sms_utils import send_sms_otp, verify_sms_otp
from app.utils.token_utils import hash_token
 
 
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
 
class AuthService:
 
    @staticmethod
    def register(
        db: Session,
        request: RegisterRequest
    ):
 
        if request.email:
 
            existing_email = (
                UserRepository.get_by_email(
                    db,
                    request.email
                )
            )
 
            if existing_email:
                raise HTTPException(
                    status_code=400,
                    detail="Email already exists"
                )
 
        if request.phone_number:
 
            existing_phone = (
                UserRepository.get_by_phone(
                    db,
                    request.phone_number
                )
            )
 
            if existing_phone:
                raise HTTPException(
                    status_code=400,
                    detail="Phone number already exists"
                )
            
from datetime import datetime, timezone, timedelta
import random
#from twilio.rest import Client
    
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
from app.services.password_days_validate import check_password_reset_policy
import asyncio
from app.models.user_model import User
from app.models.role_model import Role
# client = Client(
   # settings.TWILIO_ACCOUNT_SID,
   # settings.TWILIO_AUTH_TOKEN
#)

#def verify_email_otp(email: str, otp: str):
 #   verification_check = client.verify.v2.services(
  #      settings.TWILIO_VERIFY_SERVICE_SID
   # ).verification_checks.create(
    #    to=email,
     #   code=otp
    #)

    #return verification_check.status == "approved"
 
"""user = User(
    full_name=request.full_name,
    email=request.email,
    phone_number=request.phone_number,
    password_hash=hash_password(
        request.password
    ),
    role=request.role,
    ecurity_question=request.security_question,
    security_answer_hash=hash_password(
        request.security_answer
            )
        )
 
        return UserRepository.create_user(
            db,
            user
        )
 
    @staticmethod
    def reset_password(
        db: Session,
        request: ResetPasswordRequest
    ):
 
        user = UserRepository.get_by_id(
            db,
            request.user_id
        )
 
        if not user:
            raise HTTPException(
                status_code=404,
                detail="User not found"
            )
 
        user.password_hash = hash_password(
            request.new_password
        )
 
        UserRepository.update_user(
            db,
            user
        )
 
        return {
            "message": "Password reset successful"
        }"""
 
 
 
 
def login_user(
    db: Session,
    payload: LoginRequest
):
    user = get_user_by_identifier(
        db,
        payload.email_or_phone
    )
    if user and user.role_id:
        role = db.query(Role).filter(Role.id == user.role_id).first()
        
    if not user:
        raise HTTPException(
            status_code=
            status.HTTP_401_UNAUTHORIZED,
            detail=
            "Invalid credentials"
        )

    blocked_until = getattr(
        user,
        "blocked_until",
        None
    )

    # Blocked user check
    if (
        user.is_blocked
        or (
            blocked_until
            and blocked_until
            > datetime.now(
                timezone.utc
            )
        )
    ):
        raise_account_blocked_error()

    # Active check
    if not user.is_active:
        raise HTTPException(
            status_code=
            status.HTTP_403_FORBIDDEN,
            detail=
            "User is inactive"
        )

    # Verification check
    if not user.is_verified:
        raise HTTPException(
            status_code=
            status.HTTP_403_FORBIDDEN,
            detail=
            "User is not verified"
        )
    
    check_password_reset_policy(
        user=user,
        db=db
    )
    # Password validation
    if not verify_password(
        payload.password,
        user.password_hash
    ):
        user.failed_login_attempts += 1

        if (
            user.failed_login_attempts
            >= settings
            .MAX_LOGIN_ATTEMPTS
        ):
            user.is_blocked = True

            db.commit()

            raise_account_blocked_error()

        db.commit()

        raise HTTPException(
            status_code=
            status.HTTP_401_UNAUTHORIZED,
            detail=
            "Invalid credentials"
        )

    # Reset failed attempts
    user.failed_login_attempts = 0

    # Update login timestamp
    user.last_login_at = (
        datetime.now(
            timezone.utc
        )
    )

    # Generate refresh token
    refresh_token, expires_at = (
        create_refresh_token(
            user.id
        )
    )

    create_refresh_token_record(
        db=db,
        user_id=user.id,
        token_hash=hash_token(
            refresh_token
        ),
        expires_at=
        expires_at
    )

    db.commit()

    return {
        "access_token":
        create_access_token(
            user.id,
            user.role_id
        ),
        "user_id":user.id,
        "role_id":user.role_id or None,
        "role_name":role.name if user.role_id else None,
        "refresh_token":
        refresh_token,

        "token_type":
        "bearer",
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
 
    user = get_user_by_id(db, (user_id))
 
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
        or stored_token.expires_at < datetime.utcnow()
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
        "access_token": create_access_token(user.id, user.role_id),
        "refresh_token": new_refresh_token,
        "token_type": "bearer",
    }
 
 
def forgot_password(db: Session, payload):
 
    identifier = payload.email or payload.phone_number
    user = get_user_by_identifier(db, identifier)
 
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
 
    if not user.is_active:
        raise HTTPException(status_code=403, detail="User is inactive")
 
    otp = str(random.randint(100000, 999999))
 
    if payload.email:
 
        send_email_otp(payload.email, otp)
 
        otp_record = OTPVerification(
            user_id=user.id,
            otp_code=otp,
            otp_type=OTPType.PASSWORD_RESET,
            channel=OTPChannel.EMAIL,
            expires_at=datetime.now(timezone.utc) + timedelta(minutes=10),
            is_used=False,
            attempts=0
        )
 
        db.add(otp_record)
        db.commit()
 
        return {"message": "OTP sent to email"}
 
    if payload.phone_number:
        phone = payload.phone_number

    if not phone.startswith("+"):
        phone = f"+{phone}"

    send_sms_otp(phone)

    return {
        "message": "OTP sent via SMS"
    }
 
 
def verify_forgot_password_otp(db: Session, payload):
 
    identifier = payload.email or payload.phone_number
    user = get_user_by_identifier(db, identifier)
 
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
 
    if payload.email:
 
        otp_record = db.query(OTPVerification).filter(
            OTPVerification.user_id == user.id,
            OTPVerification.channel == OTPChannel.EMAIL,
            OTPVerification.otp_type == OTPType.PASSWORD_RESET,
            OTPVerification.is_used == False,
            OTPVerification.expires_at > datetime.now(timezone.utc)
        ).order_by(OTPVerification.created_at.desc()).first()
 
        if not otp_record:
            raise HTTPException(status_code=400, detail="OTP expired or not found")
 
        if otp_record.otp_code != payload.otp:
            raise HTTPException(status_code=400, detail="Invalid OTP")
 
        otp_record.is_used = True
        db.commit()
 
        return {
            "message": "Email OTP verified successfully",
            "verified": True
        }

    if payload.phone_number:
        phone = payload.phone_number

        if not phone.startswith("+"):
            phone = f"+{phone}"

        verified = verify_sms_otp(
            phone,
            payload.otp
        )

        if not verified:
            raise HTTPException(
                status_code=400,
                detail="Invalid OTP"
            )

        return {
            "message": "SMS OTP verified successfully",
            "verified": True
        }

 
def create_new_password(db: Session, payload):
 
    user = get_user_by_identifier(
        db,
        payload.email_or_phone
    )
 
    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )
 
    user.password_hash = hash_password(
        payload.new_password
    )

    user.failed_login_attempts = 0
    user.is_blocked = False

    if hasattr(user, "blocked_until"):
        user.blocked_until = None
 
    db.commit()
 
    return {
        "message": "Password changed successfully"
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
 
    if not verify_security_answer(
        payload.security_answer.strip(),
        user.security_answer_hash
    ):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid security question or answer"
        )
 
    return {
    "verified": True,
    "message": "Security question verified successfully. Reset your password to unblock the account"
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
 
