import re
from typing import Optional

from pydantic import BaseModel, EmailStr, field_validator, model_validator

from app.core.enums import UserRole, SecurityQuestion

PASSWORD_REGEX = re.compile(r"^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$")

# Updated: supports 5-15 digits to cover all countries worldwide
PHONE_REGEX = re.compile(r"^\+?[0-9]{5,15}$")

UUID_REGEX = re.compile(r"^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$")


class RegisterRequest(BaseModel):

    full_name: str

    country_id: str

    email: Optional[EmailStr] = None

    phone_number: Optional[str] = None

    password: str

    confirm_password: str

    role: UserRole

    security_question: SecurityQuestion

    security_answer: str

    agree_terms: bool

    @field_validator("full_name")
    @classmethod
    def validate_full_name(cls, value):
        value = value.strip()
        if len(value) < 3:
            raise ValueError("Full name must be at least 3 characters")
        if len(value) > 100:
            raise ValueError("Full name must not exceed 100 characters")
        pattern = re.compile(r"^[a-zA-Z\s]+$")
        if not pattern.match(value):
            raise ValueError("Full name can only contain letters and spaces")
        return value

    @field_validator("country_id")
    @classmethod
    def validate_country_id(cls, value):
        value = value.strip()
        if not UUID_REGEX.match(value.lower()):
            raise ValueError("Invalid country ID format")
        return value

    @field_validator("phone_number")
    @classmethod
    def validate_phone_number(cls, value):
        if value is None:
            return value
        value = value.strip()
        if not PHONE_REGEX.match(value):
            raise ValueError("Invalid phone number. Must be 5 to 15 digits, optionally starting with +")
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
        if len(value) > 100:
            raise ValueError("Security answer must not exceed 100 characters")
        return value

    @field_validator("role")
    @classmethod
    def validate_role(cls, value):
        allowed = [UserRole.STUDENT, UserRole.TEACHER, UserRole.PARENT]
        if value not in allowed:
            raise ValueError("Role must be student, teacher or parent")
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


class ConfirmRoleRequest(BaseModel):

    user_id: str

    role: UserRole

    @field_validator("user_id")
    @classmethod
    def validate_user_id(cls, value):
        value = value.strip()
        if not UUID_REGEX.match(value.lower()):
            raise ValueError("Invalid user ID format")
        return value

    @field_validator("role")
    @classmethod
    def validate_role(cls, value):
        allowed = [UserRole.STUDENT, UserRole.TEACHER, UserRole.PARENT]
        if value not in allowed:
            raise ValueError("Role must be student, teacher or parent")
        return value


class ConfirmRoleResponse(BaseModel):

    message: str

    user_id: str

    role: str


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


class ParentVerificationRequest(BaseModel):

    user_id: str

    child_name: str

    child_grade: str

    student_reference_id: Optional[str] = None

    @field_validator("user_id")
    @classmethod
    def validate_user_id(cls, value):
        value = value.strip()
        if not UUID_REGEX.match(value.lower()):
            raise ValueError("Invalid user ID format")
        return value

    @field_validator("child_name")
    @classmethod
    def validate_child_name(cls, value):
        value = value.strip()
        if len(value) < 3:
            raise ValueError("Child name must be at least 3 characters")
        if len(value) > 100:
            raise ValueError("Child name must not exceed 100 characters")
        pattern = re.compile(r"^[a-zA-Z\s]+$")
        if not pattern.match(value):
            raise ValueError("Child name can only contain letters and spaces")
        return value

    @field_validator("child_grade")
    @classmethod
    def validate_child_grade(cls, value):
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

    @field_validator("student_reference_id")
    @classmethod
    def validate_student_reference_id(cls, value):
        if value is None:
            return value
        value = value.strip()
        if not UUID_REGEX.match(value.lower()):
            raise ValueError("Invalid student reference ID format")
        return value


class ParentVerificationResponse(BaseModel):

    message: str

    user_id: str


class TeacherVerificationRequest(BaseModel):

    user_id: str

    school_name: str

    subject: str

    @field_validator("user_id")
    @classmethod
    def validate_user_id(cls, value):
        value = value.strip()
        if not UUID_REGEX.match(value.lower()):
            raise ValueError("Invalid user ID format")
        return value

    @field_validator("school_name")
    @classmethod
    def validate_school_name(cls, value):
        value = value.strip()
        if len(value) < 3:
            raise ValueError("School name must be at least 3 characters")
        if len(value) > 255:
            raise ValueError("School name must not exceed 255 characters")
        return value

    @field_validator("subject")
    @classmethod
    def validate_subject(cls, value):
        value = value.strip()
        if len(value) < 2:
            raise ValueError("Subject must be at least 2 characters")
        if len(value) > 100:
            raise ValueError("Subject must not exceed 100 characters")
        pattern = re.compile(r"^[a-zA-Z\s]+$")
        if not pattern.match(value):
            raise ValueError("Subject can only contain letters and spaces")
        return value


class TeacherVerificationResponse(BaseModel):

    message: str

    user_id: str