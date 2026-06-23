import datetime
import re

from pydantic import (
    BaseModel,
    EmailStr,
    field_validator
)

from app.schemas.user_schema import PHONE_REGEX

UUID_REGEX = re.compile(

    r"^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$"

)
      
class UpdateParentProfileRequest(BaseModel):

    relationship_type: str
    
    full_name: str

    phone_number: str

    email: EmailStr

    @field_validator("relationship_type")
    @classmethod
    def validate_relationship_type(cls, value):

        allowed = [
            "FATHER",
            "MOTHER",
            "GUARDIAN",
            "OTHER"
        ]

        value = value.strip().upper()

        if value not in allowed:
            raise ValueError(
                "Invalid relationship type"
            )

        return value
    
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


REGISTRATION_NUMBER_REGEX = re.compile(
    r"^STU-\d{4}-\d{6}$"
)

class AddChildRequest(BaseModel):
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


class ChildResponse(BaseModel):

    id: str
    student_reference_id: str | None
    registration_number: str | None
    child_name: str
    grade: str | None
    school_name: str | None


class ParentProfileResponse(BaseModel):

    parent_profile_id: str
    full_name: str
    email: str
    phone_number: str | None
    relationship_type: str | None
    
    profile_image_url: str | None

    children: list[ChildResponse]


class MessageResponse(BaseModel):

    message: str
    
class ParentPasswordUpdate(BaseModel):
    current_password: str
    new_password: str
    confirm_password: str
    
    @field_validator("current_password")
    @classmethod
    def validate_current_password(cls, value: str) -> str:
        if not value or not value.strip():
            raise ValueError(
                "Current password is required"
            )

        return value

    @field_validator("new_password")
    @classmethod
    def validate_new_password(cls, value: str) -> str:
        if not value or not value.strip():
            raise ValueError("New password is required")

        if len(value) < 8:
            raise ValueError("New password must be at least 8 characters")

        return value

    @field_validator("confirm_password")
    @classmethod
    def validate_confirm_password(cls, value: str) -> str:
        if not value or not value.strip():
            raise ValueError("Confirm password is required")

        return value
    
class ChildDashboardResponse(BaseModel):
    id: str
    name: str
    registration_number: str
    grade: str | None
    school_name: str | None


class ParentDashboardResponse(BaseModel):
    parent_id: str
    parent_name: str
    parent_email: str | None
    parent_phone_number: str | None
    profile_image_url: str | None
    child: ChildDashboardResponse
    progress: dict
    tests: dict    