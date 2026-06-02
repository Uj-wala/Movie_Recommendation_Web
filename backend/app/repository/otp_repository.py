from sqlalchemy.orm import Session
from app.models.otp_verification_model import (
    OTPVerification
)
class OTPRepository:
    @staticmethod
    def create(
        db: Session,
        otp: OTPVerification
    ):
        db.add(otp)
        db.commit()
        db.refresh(otp)
        return otp
    @staticmethod
    def get_latest_otp(
        db: Session,
        user_id: str
    ):
        return (
            db.query(OTPVerification)
            .filter(
                OTPVerification.user_id == user_id
            )
            .order_by(
                OTPVerification.created_at.desc()
            )
            .first()
        )