from datetime import datetime, timedelta

from sqlalchemy.orm import Session

from app.models.user_model import User
from app.models.otp_verification_model import OTPVerification
from app.core.enums import OTPType, OTPChannel

from app.utils.sms_utils import (
    send_sms_otp,
    normalize_phone
)

from app.utils.email_utils import send_email_otp
from app.utils.otp_utils import generate_otp


class OTPService:

    @staticmethod
    def resend_otp(
        db: Session,
        phone_number: str
    ):
        phone_number = normalize_phone(phone_number)

        user = db.query(User).filter(
            User.phone_number == phone_number
         ).first()
        
        if not user:
            return False, "User not found"

        db.query(OTPVerification).filter(
            OTPVerification.user_id == user.id,
            OTPVerification.otp_type == OTPType.REGISTRATION,
            OTPVerification.channel == OTPChannel.SMS,
            OTPVerification.is_used == False
        ).update({"is_used": True})

        otp = send_sms_otp(phone_number)

        otp_record = OTPVerification(
            user_id=user.id,
            otp_code=otp,
            otp_type=OTPType.REGISTRATION,
            channel=OTPChannel.SMS,
            expires_at=datetime.utcnow() + timedelta(minutes=10),
            is_used=False,
            attempts=0
        )

        db.add(otp_record)
        db.commit()

        return True, "OTP sent successfully"

    @staticmethod
    def verify_otp(
        db: Session,
        phone_number: str,
        otp_code: str
    ):
        phone_number = normalize_phone(phone_number)

        user = db.query(User).filter(
            User.phone_number == phone_number
        ).first()

        if not user:
            return False, "User not found"

        otp_record = db.query(OTPVerification).filter(
            OTPVerification.user_id == user.id,
            OTPVerification.otp_code == otp_code,
            OTPVerification.otp_type == OTPType.REGISTRATION,
            OTPVerification.channel == OTPChannel.SMS,
            OTPVerification.is_used == False,
            OTPVerification.expires_at > datetime.utcnow()
        ).order_by(
            OTPVerification.created_at.desc()
        ).first()

        if not otp_record:
            return False, "Invalid or expired OTP"

        if otp_record.attempts >= 5:
            return False, "Too many OTP attempts. Please request a new OTP"

        otp_record.is_used = True
        user.is_verified = True

        db.commit()
        db.refresh(user)

        return True, "Phone OTP verified successfully"

    @staticmethod
    def send_email_otp(
        db: Session,
        email: str
    ):
        user = db.query(User).filter(
            User.email == email
        ).first()

        if not user:
            return False, "User not found"

        db.query(OTPVerification).filter(
            OTPVerification.user_id == user.id,
            OTPVerification.otp_type == OTPType.REGISTRATION,
            OTPVerification.channel == OTPChannel.EMAIL,
            OTPVerification.is_used == False
        ).update({"is_used": True})

        otp = generate_otp()

        otp_record = OTPVerification(
            user_id=user.id,
            otp_code=otp,
            otp_type=OTPType.REGISTRATION,
            channel=OTPChannel.EMAIL,
            expires_at=datetime.utcnow() + timedelta(minutes=10),
            is_used=False,
            attempts=0
        )

        db.add(otp_record)

        if not send_email_otp(email, otp):
            db.rollback()
            return False, "Unable to send email OTP. Please check email credentials"

        db.commit()

        return True, "Email OTP sent successfully"

    @staticmethod
    def verify_email_otp(
        db: Session,
        email: str,
        otp_code: str
    ):
        user = db.query(User).filter(
            User.email == email
        ).first()

        if not user:
            return False, "User not found"

        otp_record = db.query(OTPVerification).filter(
            OTPVerification.user_id == user.id,
            OTPVerification.otp_code == otp_code,
            OTPVerification.otp_type == OTPType.REGISTRATION,
            OTPVerification.channel == OTPChannel.EMAIL,
            OTPVerification.is_used == False,
            OTPVerification.expires_at > datetime.utcnow()
        ).order_by(
            OTPVerification.created_at.desc()
        ).first()

        if not otp_record:
            return False, "Invalid or expired OTP"

        if otp_record.attempts >= 5:
            return False, "Too many OTP attempts. Please request a new OTP"

        otp_record.is_used = True
        user.is_verified = True

        db.commit()
        db.refresh(user)

        return True, "Email verified successfully"
