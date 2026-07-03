from datetime import datetime, timedelta

from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.models.user_model import User
from app.models.otp_verification_model import OTPVerification
from app.core.enums import OTPType, OTPChannel
from app.utils.otp_utils import generate_otp
from app.utils.email_utils import send_email_otp
from app.utils.sms_utils import send_sms_otp
from app.schemas.parent_profile_schema import (
    AddEmailRequest,
    UpdateEmailRequest,
    VerifyEmailOTPRequest,
    OTPSentResponse,
    OTPVerifyResponse,
    AddPhoneRequest,
    UpdatePhoneRequest,
    VerifyPhoneOTPRequest,
    PhoneOTPSentResponse,
    PhoneOTPVerifyResponse,
)

OTP_EXPIRY_MINUTES = 5


# ── Private Helpers ───────────────────────────────────────────

def _invalidate_email_otps(
    db: Session,
    user_id: str,
) -> None:
    db.query(OTPVerification).filter(
        OTPVerification.user_id == user_id,
        OTPVerification.channel == OTPChannel.EMAIL,
        OTPVerification.is_used == False,
    ).update({"is_used": True})


def _invalidate_phone_otps(
    db: Session,
    user_id: str,
) -> None:
    db.query(OTPVerification).filter(
        OTPVerification.user_id == user_id,
        OTPVerification.channel == OTPChannel.SMS,
        OTPVerification.is_used == False,
    ).update({"is_used": True})


def _create_otp_record(
    db: Session,
    user_id: str,
    otp_code: str,
    channel: OTPChannel,
) -> OTPVerification:
    record = OTPVerification(
        user_id=user_id,
        otp_code=otp_code,
        otp_type=OTPType.REGISTRATION,
        channel=channel,
        expires_at=(
            datetime.utcnow()
            + timedelta(minutes=OTP_EXPIRY_MINUTES)
        ),
        is_used=False,
        attempts=0,
    )
    db.add(record)
    return record


def _get_valid_otp(
    db: Session,
    user_id: str,
    otp_code: str,
    channel: OTPChannel,
) -> OTPVerification:
    now = datetime.utcnow()

    expired = (
        db.query(OTPVerification)
        .filter(
            OTPVerification.user_id == user_id,
            OTPVerification.otp_code == otp_code,
            OTPVerification.channel == channel,
            OTPVerification.is_used == False,
            OTPVerification.expires_at <= now,
        )
        .order_by(OTPVerification.created_at.desc())
        .first()
    )
    if expired:
        expired.is_used = True
        db.commit()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=(
                "OTP has expired. "
                "Please request a new one."
            ),
        )

    record = (
        db.query(OTPVerification)
        .filter(
            OTPVerification.user_id == user_id,
            OTPVerification.otp_code == otp_code,
            OTPVerification.channel == channel,
            OTPVerification.is_used == False,
            OTPVerification.expires_at > now,
        )
        .order_by(OTPVerification.created_at.desc())
        .first()
    )
    if not record:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid or expired OTP.",
        )

    if record.attempts >= 5:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=(
                "Too many attempts. "
                "Please request a new OTP."
            ),
        )

    return record


# ═══════════════════════════════════════════════════
#  EMAIL SERVICES
# ═══════════════════════════════════════════════════

def add_new_email_service(
    db: Session,
    current_user: User,
    payload: AddEmailRequest,
) -> OTPSentResponse:
    """
    ADD NEW EMAIL:
    No OTP. Saves directly to reference_email.
    """
    new_email = payload.new_email.strip().lower()

    if (
        current_user.email
        and current_user.email.lower() == new_email
    ):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=(
                "New email cannot be same "
                "as current email."
            ),
        )

    if (
        current_user.reference_email
        and current_user.reference_email.lower()
        == new_email
    ):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=(
                "This email is already "
                "saved as reference email."
            ),
        )

    existing = (
        db.query(User)
        .filter(User.email == new_email)
        .first()
    )
    if existing and existing.id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="This email is already in use.",
        )

    existing_ref = (
        db.query(User)
        .filter(User.reference_email == new_email)
        .first()
    )
    if (
        existing_ref
        and existing_ref.id != current_user.id
    ):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="This email is already in use.",
        )

    # Save to reference_email
    current_user.reference_email = new_email

    db.add(current_user)
    db.commit()
    db.refresh(current_user)

    return OTPSentResponse(
        message=(
            f"New email {new_email} saved "
            "successfully to your profile."
        ),
        email=new_email,
    )


def Update_email_service(
    db: Session,
    current_user: User,
    payload: UpdateEmailRequest,
) -> OTPSentResponse:
    """
    UPDATE EMAIL:
    Sends OTP to current registered email.
    On verify: saves to email field.
    Kept as Update_email_service to match
    existing imports in both routers.
    """
    new_email = payload.new_email.strip().lower()

    existing = (
        db.query(User)
        .filter(User.email == new_email)
        .first()
    )
    if existing and existing.id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="This email is already in use.",
        )

    _invalidate_email_otps(db, current_user.id)

    otp_code = generate_otp()

    _create_otp_record(
        db,
        current_user.id,
        otp_code,
        OTPChannel.EMAIL,
    )

    sent = send_email_otp(new_email, otp_code)
    if not sent:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=(
                "Failed to send OTP "
                "to registered email."
            ),
        )

    db.commit()

    return OTPSentResponse(
        message=(
            "OTP sent to your registered email "
            f"{new_email}. "
            "Verify to update your email."
        ),
        email=new_email,
        otp_code=otp_code,
    )


def verify_add_email_otp_service(
    db: Session,
    current_user: User,
    payload: VerifyEmailOTPRequest,
) -> OTPVerifyResponse:
    """
    VERIFY OTP FOR EMAIL UPDATE:
    Saves new email to email field in users table.
    If set_as_primary=True also updates reference_email.
    """
    new_email = payload.email.strip().lower()

    record = _get_valid_otp(
        db,
        current_user.id,
        payload.otp_code,
        OTPChannel.EMAIL,
    )

    record.is_used = True

    # Save to email field in users table
    current_user.email = new_email

    db.add(current_user)
    db.commit()
    db.refresh(current_user)

    return OTPVerifyResponse(
        message=(
            f"Email updated to {new_email} "
            "successfully."
        ),
        # set_as_primary=True,
        success=True,
    )


# ═══════════════════════════════════════════════════
#  PHONE SERVICES
# ═══════════════════════════════════════════════════

def add_new_phone_service(
    db: Session,
    current_user: User,
    payload: AddPhoneRequest,
) -> PhoneOTPSentResponse:
    """
    ADD NEW PHONE:
    No OTP. Saves directly to reference_phone_number.
    """
    phone = payload.new_phone_number.strip()
    if not phone.startswith("+"):
        phone = f"+{phone}"

    if (
        current_user.phone_number
        and current_user.phone_number == phone
    ):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=(
                "New phone cannot be same "
                "as current phone number."
            ),
        )

    if (
        current_user.reference_phone_number
        and current_user.reference_phone_number == phone
    ):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=(
                "This number is already saved "
                "as reference phone number."
            ),
        )

    existing = (
        db.query(User)
        .filter(User.phone_number == phone)
        .first()
    )
    if existing and existing.id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=(
                "This phone number is already in use."
            ),
        )

    existing_ref = (
        db.query(User)
        .filter(User.reference_phone_number == phone)
        .first()
    )
    if (
        existing_ref
        and existing_ref.id != current_user.id
    ):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=(
                "This phone number is already in use."
            ),
        )

    # Save to reference_phone_number
    current_user.reference_phone_number = phone

    db.add(current_user)
    db.commit()
    db.refresh(current_user)

    return PhoneOTPSentResponse(
        message=(
            f"New phone number {phone} saved "
            "successfully to your profile."
        ),
        phone_number=phone,
    )


def update_phone_service(
    db: Session,
    current_user: User,
    payload: UpdatePhoneRequest,
) -> PhoneOTPSentResponse:
    """
    UPDATE PHONE:
    Static OTP generated, saved to DB.
    On verify: saves to phone_number in users table.
    """
    new_phone = payload.new_phone_number.strip()
    otp_code = send_sms_otp(phone_number=new_phone)
    if not new_phone.startswith("+"):
        new_phone = f"+{new_phone}"

    existing = (
        db.query(User)
        .filter(User.phone_number == new_phone)
        .first()
    )
    if existing and existing.id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=(
                "This phone number is already in use."
            ),
        )

    _invalidate_phone_otps(db, current_user.id)

    otp_code = send_sms_otp(phone_number=new_phone)

    _create_otp_record(
        db,
        current_user.id,
        otp_code,
        OTPChannel.SMS,
    )

    db.commit()

    return PhoneOTPSentResponse(
        message=(
            "OTP generated. "
            "Use this OTP to verify and update "
            "your phone number."
        ),
        phone_number=new_phone,
        otp_code=otp_code,
    )


def verify_add_phone_otp_service(
    db: Session,
    current_user: User,
    payload: VerifyPhoneOTPRequest,
) -> PhoneOTPVerifyResponse:
    """
    VERIFY OTP FOR PHONE UPDATE:
    Saves new phone to phone_number in users table.
    If set_as_primary=True also updates
    reference_phone_number.
    """
    phone = payload.phone_number.strip()
    if not phone.startswith("+"):
        phone = f"+{phone}"

    record = _get_valid_otp(
        db,
        current_user.id,
        payload.otp_code,
        OTPChannel.SMS,
    )

    record.is_used = True

    # Save to phone_number field in users table
    current_user.phone_number = phone

    db.add(current_user)
    db.commit()
    db.refresh(current_user)

    return PhoneOTPVerifyResponse(
        message=(
            f"Phone number updated to "
            f"{phone} successfully."
        ),
        # set_as_primary=True,
        success=True,
    )