from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.models.user_model import User
from app.schemas.user_schema import (
    RegisterRequest,
    ResetPasswordRequest
)
from app.repository.user_repository import UserRepository
from app.core.security import hash_password


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

        user = User(
            full_name=request.full_name,
            email=request.email,
            phone_number=request.phone_number,
            password_hash=hash_password(
                request.password
            ),
            role=request.role,
            security_question=request.security_question,
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
        }