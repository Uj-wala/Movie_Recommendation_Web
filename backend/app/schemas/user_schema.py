from datetime import datetime
import re
from typing import Optional
 
from pydantic import BaseModel, EmailStr, field_validator, model_validator, ConfigDict
 
from app.core.enums import SecurityQuestion
 
PASSWORD_REGEX = re.compile(r"^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$")
 
 
PHONE_REGEX = re.compile(r"^[0-9]{10,15}$")

from pydantic import (
    BaseModel,
    EmailStr,
    field_validator,
    model_validator,
    ValidationError,
    TypeAdapter,ConfigDict
)
 
PASSWORD_REGEX = re.compile(
    r"^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$"
)
UUID_REGEX = re.compile(r"^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$")
 
PHONE_REGEX = re.compile(
    r"^\+?[0-9]{10,15}$"
)
 
EMAIL_VALIDATOR = TypeAdapter(EmailStr)
 
 
class RegisterRequest(BaseModel):
 
    full_name: str
 
    country_id: Optional[str] = None
 
    email: Optional[EmailStr] = None
 
    phone_number: Optional[str] = None
 
    password: str
 
    confirm_password: str
  
    security_question: SecurityQuestion
 
    security_answer: str
 
    agree_to_terms: bool
 
    @field_validator("full_name")
    @classmethod
    def validate_full_name(cls, value):
 
        value = value.strip()
 
        if len(value) < 3:
            raise ValueError("Full name must be at least 3 characters")
 
        return value

    @field_validator("agree_to_terms")
    @classmethod
    def validate_agree_to_terms(cls, value):
        if not value:
            raise ValueError("You must agree to the terms and conditions")
 
        return value
 
    @field_validator("country_id")
    @classmethod
    def validate_country_id(cls, value):
        if value is None:
            return value

        if not UUID_REGEX.match(value):
            raise ValueError("Invalid country ID format")

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
        if len(value) < 6:
            raise ValueError("Password must be at least 6 characters")
        if " " in value:
            raise ValueError("Password must not contain spaces")
 
        if not PASSWORD_REGEX.match(value):
            raise ValueError(
                "Password must contain uppercase, lowercase, number and special character"
            )
 
        return value
 
    @field_validator("confirm_password")
    @classmethod
    def validate_confirm_password(cls, value):
        if not value.strip():
            raise ValueError("Confirm password is required")
 
        return value
 
    @field_validator("security_answer")
    @classmethod
    def validate_security_answer(cls, value):
 
        value = value.strip()
 
        if len(value) < 2:
            raise ValueError("Security answer is too short")
 
        return value
 
    @model_validator(mode="after")
    def validate_passwords_match(self):
        if self.password and self.confirm_password:
            if self.password != self.confirm_password:
                raise ValueError("Password and confirm password do not match")
        return self
 
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
 
        if len(value) > 254:
            raise ValueError(
                "Email or phone number is too long"
            )
 
        if "@" in value:
            try:
                EMAIL_VALIDATOR.validate_python(value)
            except ValidationError:
                raise ValueError(
                    "Invalid email format"
                )
 
            return value.lower()
 
        if not PHONE_REGEX.match(value):
            raise ValueError(
                "Invalid phone number format"
            )
 
        return value
 
    @field_validator("password")
    @classmethod
    def validate_password(cls, value):
 
        if not value or not value.strip():
            raise ValueError(
                "Password is required"
            )
 
        if len(value) < 8:
            raise ValueError(
                "Password must be at least 8 characters"
            )
 
        if len(value) > 128:
            raise ValueError(
                "Password is too long"
            )
 
        return value
   
class LogoutRequest(BaseModel):
 
    refresh_token: str
 
    @field_validator("refresh_token")
    @classmethod
    def validate_refresh_token(cls, value):
 
        value = value.strip()
 
        if not value:
            raise ValueError(
                "Refresh token is required"
            )
 
        return value    
   
class TokenResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
 
 
class RefreshTokenRequest(BaseModel):
    refresh_token: str
 
 
class ForgotPasswordRequest(BaseModel):
   
    email: Optional[EmailStr] = None
 
    phone_number: Optional[str] = None
 
    @field_validator("phone_number")
    @classmethod
    def validate_phone_number(cls, value):
 
        if value in [None, ""]:
           return None
 
        value = value.strip()
 
        if not PHONE_REGEX.match(value):
            raise ValueError(
                "Invalid phone number format"
            )
 
        return value
 
    @model_validator(mode="after")
    def validate_email_or_phone(self):
 
        if not self.email and not self.phone_number:
            raise ValueError(
                "Either email or phone number is required"
            )
 
        if self.email and self.phone_number:
            raise ValueError(
                "Use either email or phone number, not both"
            )
 
        return self
 
class VerifyForgotPasswordOtpRequest(BaseModel):
    email: str | None = None
    phone_number: str | None = None
    otp: str
 
 
 
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
   
 
class BlockedAccountResetRequest(BaseModel):

    email_or_phone: str

    security_question: SecurityQuestion

    security_answer: str

    @field_validator("email_or_phone")
    @classmethod
    def validate_email_or_phone(cls, value):

        value = value.strip()

        if not value:
            raise ValueError(
                "Email or phone number is required"
            )

        return value

    @field_validator("security_answer")
    @classmethod
    def validate_security_answer(cls, value):

        value = value.strip()

        if len(value) < 2:
            raise ValueError(
                "Security answer is too short"
            )

        return value
 
 
class UserResponse(BaseModel):
 
    id: str
 
    full_name: str
 
    email: Optional[str]
 
    phone_number: Optional[str]
  
    is_verified: bool
 
    profile_completed: bool
 
    model_config = ConfigDict(
        from_attributes=True
     )
 
 
 
class CreateNewPasswordRequest(BaseModel):
 
    email_or_phone: str
 
    new_password: str
 
    confirm_password: str
 
    @field_validator("new_password")
    @classmethod
    def validate_new_password(cls, value):
 
        if not PASSWORD_REGEX.match(value):
            raise ValueError(
                "Password must contain uppercase, lowercase, number and special character"
            )
 
        return value
 
    @model_validator(mode="after")
    def validate_password_match(self):
 
        if self.new_password != self.confirm_password:
            raise ValueError(
                "Passwords do not match"
            )
 
        return self
   
 
 
 
 
class UserRegisterResponse(BaseModel):
    data: UserResponse
    message: str
 
class ConfirmRoleRequest(BaseModel):
 
    user_id: str
 
    role_id: str
 
    @field_validator("user_id")
    @classmethod
    def validate_user_id(cls, value):
        value = value.strip()
        if not UUID_REGEX.match(value.lower()):
            raise ValueError("Invalid user ID format")
        return value
 
    @field_validator("role_id")
    @classmethod
    def validate_role_id(cls, value):

        value = value.strip()

        if not UUID_REGEX.match(value.lower()):
            raise ValueError("Invalid role ID format")

        return value
 
 
class ConfirmRoleResponse(BaseModel):
 
    message: str
 
    user_id: str
 
    role_id: str
    registration_number: str
 
 
class StudentDetailsRequest(BaseModel):
 
    user_id: str
 
    grade: str
 
    work_place: Optional[str] = None
 
    school_name: Optional[str] = None
 
    @field_validator("user_id")
    @classmethod
    def validate_user_id(cls, value):
        value = value.strip()
        if not UUID_REGEX.match(value.lower()):
            raise ValueError("Invalid user ID format")
        return value
 
    @field_validator("grade")
    @classmethod
    def validate_grade(cls, value):
        allowed = [
            "Grade 1",
            "Grade 2",
            "Grade 3",
            "Grade 4",
            "Grade 5",
            "Grade 6",
            "Grade 7",
            "Grade 8",
            "Grade 9",
            "Grade 10",
            "1st year university",
            "2nd year university",
            "3rd year university",
            "4th year university",
            "Graduate studies",
            "Adult learner",
            "Other",
        ]
        if value not in allowed:
            raise ValueError("Invalid grade selected")
        return value
 
    @field_validator("work_place")
    @classmethod
    def validate_work_place(cls, value):
        if value is None:
            return value
        value = value.strip()
        if len(value) < 2:
            raise ValueError("Work place must be at least 2 characters")
        if len(value) > 255:
            raise ValueError("Work place must not exceed 255 characters")
        return value
 
    @field_validator("school_name")
    @classmethod
    def validate_school_name(cls, value):
        if value is None:
            return value
        value = value.strip()
        if len(value) < 3:
            raise ValueError("School name must be at least 3 characters")
        if len(value) > 255:
            raise ValueError("School name must not exceed 255 characters")
        return value
 
    @model_validator(mode="after")
    def validate_work_or_school(self):
        if not self.work_place and not self.school_name:
            raise ValueError("Either work place or school name is required")
        return self
 
 
class StudentDetailsResponse(BaseModel):
 
    message: str
 
    user_id: str

    student_registration_number: str
    
REGISTRATION_NUMBER_REGEX = re.compile(
    r"^STU-\d{4}-\d{6}$"
)     
 
class ParentVerificationRequest(BaseModel):
 
    user_id: str
 
    student_registration_number: str

    @field_validator("student_registration_number")
    @classmethod
    def validate_student_registration_number(cls, value):
        value = value.strip().upper()

        if not REGISTRATION_NUMBER_REGEX.match(value):
            current_year = datetime.now().year
            raise ValueError(
                f"Invalid student registration number format. Expected: STU-{current_year}-000001"
            )

        return value
 
    @field_validator("user_id")
    @classmethod
    def validate_user_id(cls, value):
        value = value.strip()
        if not UUID_REGEX.match(value.lower()):
            raise ValueError("Invalid user ID format")
        return value
 
 
class ParentVerificationResponse(BaseModel):
 
    message: str
 
    user_id: str

    parent_id: str

 
