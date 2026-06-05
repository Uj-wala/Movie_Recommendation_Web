from datetime import datetime, timedelta
 
from sqlalchemy.orm import Session
 
from app.models.user_model import User
 
from app.models.otp_verification_model import OTPVerification
 
from app.core.enums import OTPType, OTPChannel
 
from app.utils.sms_utils import (
 
    send_sms_otp,
 
    verify_sms_otp,
 
    normalize_phone
 
)
 
from app.utils.email_utils import send_email_otp
 
from app.utils.otp_utils import generate_otp
 
 
class OTPService:
 
    email_otps = {}
 
    @staticmethod
 
    def resend_otp(
 
        db: Session,
 
        phone_number: str
 
    ):
 
        phone_number = normalize_phone(phone_number)
 
        otp = send_sms_otp(phone_number)
 
        user = db.query(User).filter(
 
            User.phone_number == phone_number
 
        ).first()
 
        if user:
 
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
 
        return {
 
            "message": "OTP sent successfully",
 
            "otp": otp
 
        }
 
    @staticmethod
 
    def verify_otp(
 
        db: Session,
 
        phone_number: str,
 
        otp_code: str
 
    ):
 
        phone_number = normalize_phone(phone_number)
 
        is_valid = verify_sms_otp(
 
            phone_number,
 
            otp_code
 
        )
 
        if not is_valid:
 
            return False, "Invalid OTP"
 
        user = db.query(User).filter(
 
            User.phone_number == phone_number
 
        ).first()
 
        if not user:
 
            return False, "User not found"
 
        otp_record = db.query(OTPVerification).filter(
 
            OTPVerification.user_id == user.id,
 
            OTPVerification.otp_code == otp_code,
 
            OTPVerification.is_used == False
 
        ).first()
 
        if otp_record:
 
            otp_record.is_used = True
 
        user.is_verified = True
 
        db.commit()
 
        db.refresh(user)
 
        return True, "Phone OTP verified successfully"
 
    @staticmethod
 
    def send_email_otp(
 
        email: str
 
    ):
 
        otp = generate_otp()
 
        OTPService.email_otps[email] = otp
 
        send_email_otp(
 
            email,
 
            otp
 
        )
 
        return True
 
    @staticmethod
 
    def verify_email_otp(
 
        db: Session,
 
        email: str,
 
        otp_code: str
 
    ):
 
        stored_otp = OTPService.email_otps.get(email)
 
        if not stored_otp:
 
            return False, "OTP not found"
 
        if stored_otp != otp_code:
 
            return False, "Invalid OTP"
 
        user = db.query(User).filter(
 
            User.email == email
 
        ).first()
 
        if user:
 
            user.is_verified = True
 
            db.commit()
 
            db.refresh(user)
 
        del OTPService.email_otps[email]
 
        return True, "Email verified successfully"
 