from sqlalchemy.orm import Session
from app.models.user_model import User
from app.utils.sms_utils import (
    send_sms_otp,
    verify_sms_otp
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
        send_sms_otp(phone_number)
        return "OTP sent successfully"

    @staticmethod
    def verify_otp(
        db: Session,
        phone_number: str,
        otp_code: str
    ):

        
        is_valid = verify_sms_otp(
            phone_number,
            otp_code
        )

        if not is_valid:
            return False, "Invalid OTP"
        
        user = db.query(User).filter(
            User.phone_number == phone_number
        ).first()

        if user:
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

   