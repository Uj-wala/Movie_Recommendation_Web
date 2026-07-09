from datetime import datetime, timedelta

from sqlalchemy.orm import Session

from app.core.config import settings
from app.core.enums import OTPChannel, OTPType
from app.models.otp import OTPVerification
from app.models.user import User
from app.utils.email_utils import send_email_otp
from app.utils.otp_utils import generate_otp

OTP_EXPIRY_MINUTES = 5
MAX_ATTEMPTS = 5


def create_and_send_otp(
    db: Session,
    user: User,
    otp_type: OTPType,
    channel: OTPChannel,
) -> str:
    """Invalidate previous OTPs of the same type/channel and issue a new one.

    In dev mode the code is forced to settings.DEV_OTP_CODE (123456) and email
    sending is best-effort so login works without configured SMTP.
    """
    db.query(OTPVerification).filter(
        OTPVerification.user_id == user.id,
        OTPVerification.otp_type == otp_type,
        OTPVerification.channel == channel,
        OTPVerification.is_used == False,  # noqa: E712
    ).update({"is_used": True})

    code = settings.DEV_OTP_CODE if settings.DEV_MODE else generate_otp()

    record = OTPVerification(
        user_id=user.id,
        otp_code=code,
        otp_type=otp_type,
        channel=channel,
        expires_at=datetime.utcnow() + timedelta(minutes=OTP_EXPIRY_MINUTES),
    )
    db.add(record)
    db.commit()

    if channel == OTPChannel.EMAIL and user.email:
        # Best-effort in dev; do not fail the request if SMTP is not set up.
        sent = send_email_otp(user.email, code)
        if not sent and not settings.DEV_MODE:
            raise RuntimeError("Unable to send email OTP")

    return code


def verify_otp(
    db: Session,
    user: User,
    code: str,
    otp_type: OTPType,
    channel: OTPChannel,
) -> tuple[bool, str]:
    now = datetime.utcnow()

    record = (
        db.query(OTPVerification)
        .filter(
            OTPVerification.user_id == user.id,
            OTPVerification.otp_code == code,
            OTPVerification.otp_type == otp_type,
            OTPVerification.channel == channel,
            OTPVerification.is_used == False,  # noqa: E712
        )
        .order_by(OTPVerification.created_at.desc())
        .first()
    )

    if not record:
        return False, "Invalid OTP"
    if record.expires_at <= now:
        record.is_used = True
        db.commit()
        return False, "OTP expired"
    if record.attempts >= MAX_ATTEMPTS:
        return False, "Too many attempts, request a new OTP"

    record.is_used = True
    db.commit()
    return True, "OTP verified"
