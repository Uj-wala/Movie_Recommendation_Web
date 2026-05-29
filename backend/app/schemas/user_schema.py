import re
from typing import Optional

from pydantic import BaseModel, EmailStr, field_validator, model_validator

from app.core.enums import UserRole, SecurityQuestion

PASSWORD_REGEX = re.compile(r"^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$")


PHONE_REGEX = re.compile(r"^[0-9]{10,15}$")


class RegisterRequest(BaseModel):

    full_name: str

    country_id: str

    email: Optional[EmailStr] = None

    phone_number: Optional[str] = None

    password: str

    role: UserRole

    security_question: SecurityQuestion

    security_answer: str

    @field_validator("full_name")
    @classmethod
    def validate_full_name(cls, value):

        value = value.strip()

        if len(value) < 3:
            raise ValueError("Full name must be at least 3 characters")

        return value

    @field_validator("phone_number")
    @classmethod
    def validate_phone_number(cls, value):

        if value is None:
            return value

        if not PHONE_REGEX.match(value):
            raise ValueError("Invalid phone number format")

        return value

    @field_validator("password")
    @classmethod
    def validate_password(cls, value):

        if not PASSWORD_REGEX.match(value):
            raise ValueError(
                "Password must contain uppercase, lowercase, number and special character"
            )

        return value

    @field_validator("security_answer")
    @classmethod
    def validate_security_answer(cls, value):

        value = value.strip()

        if len(value) < 2:
            raise ValueError("Security answer is too short")

        return value

    @model_validator(mode="after")
    def validate_email_or_phone(self):

        if not self.email and not self.phone_number:
            raise ValueError("Either email or phone number is required")

        return self


class LoginRequest(BaseModel):

    email_or_phone: str

    password: str

    @field_validator("email_or_phone")
    @classmethod
    def validate_email_or_phone(cls, value):

        value = value.strip()

        if not value:
            raise ValueError("Email or phone number is required")

        return value

    @field_validator("password")
    @classmethod
    def validate_password(cls, value):

        if not value.strip():
            raise ValueError("Password is required")

        return value


class ForgotPasswordRequest(BaseModel):

    email_or_phone: str


class ResetPasswordRequest(BaseModel):

    user_id: str

    otp_code: str

    new_password: str

    @field_validator("new_password")
    @classmethod
    def validate_new_password(cls, value):

        if not PASSWORD_REGEX.match(value):
            raise ValueError("Weak password")

        return value


class UserResponse(BaseModel):

    id: str

    full_name: str

    email: Optional[str]

    phone_number: Optional[str]

    role: UserRole

    is_verified: bool

    profile_completed: bool
