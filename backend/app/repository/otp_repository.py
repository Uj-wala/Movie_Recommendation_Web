from datetime import datetime, timezone
from typing import Optional

from sqlalchemy.orm import Session

from app.models.otp_verification_model import OTPVerification
from app.core.enums import OTPType


class OTPRepository:
    @staticmethod
    def create(db: Session, otp: OTPVerification) -> OTPVerification:
        db.add(otp)
        db.commit()
        db.refresh(otp)
        return otp

    @staticmethod
    def get_latest_otp(db: Session, user_id: str) -> Optional[OTPVerification]:
        return (
            db.query(OTPVerification)
            .filter(OTPVerification.user_id == user_id)
            .order_by(OTPVerification.created_at.desc())
            .first()
        )

    @staticmethod
    def verify_otp(
        db: Session,
        user_id: str,
        otp_code: str,
        otp_type: OTPType,
    ) -> Optional[OTPVerification]:
        return (
            db.query(OTPVerification)
            .filter(
                OTPVerification.user_id == user_id,
                OTPVerification.otp_code == otp_code,
                OTPVerification.otp_type == otp_type,
                OTPVerification.is_used == False,
                OTPVerification.expires_at > datetime.now(timezone.utc),
            )
            .first()
        )

    @staticmethod
    def mark_used(db: Session, otp_record: OTPVerification) -> OTPVerification:
        otp_record.is_used = True
        db.commit()
        db.refresh(otp_record)
        return otp_record
    
    
# from sqlalchemy.orm import Session
# from app.models.otp_verification_model import (
#     OTPVerification
# )
# from datetime import datetime, timezone
# class OTPRepository:
#     @staticmethod
#     def create(
#         db: Session,
#         otp: OTPVerification
#     ):
#         db.add(otp)
#         db.commit()
#         db.refresh(otp)
#         return otp
#     @staticmethod
#     def get_latest_otp(
#         db: Session,
#         user_id: str
#     ):
#         return (
#             db.query(OTPVerification)
#             .filter(
#                 OTPVerification.user_id == user_id
#             )
#             .order_by(
#                 OTPVerification.created_at.desc()
#             )
#             .first()
#         )
#     @staticmethod
#     def verify_otp(
#         db: Session,
#         user_id: str,
#         otp_code: str,
#         otp_type
#     ):
#         return (
#             db.query(OTPVerification)
#             .filter(
#                 OTPVerification.user_id == user_id,
#                 OTPVerification.otp_code == otp_code,
#                 OTPVerification.otp_type == otp_type,
#                 OTPVerification.is_used == False,
#                 OTPVerification.expires_at > datetime.now(timezone.utc)
#             )
#             .first()
#         )
        
#     @staticmethod
#     def mark_used(db: Session, otp_record: OTPVerification):
#         otp_record.is_used = True
#         db.commit()