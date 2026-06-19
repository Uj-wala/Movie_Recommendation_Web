import datetime
import re

from pydantic import (
    BaseModel,
    field_validator
)

UUID_REGEX = re.compile(

    r"^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$"

)
      
class UpdateParentProfileRequest(BaseModel):

    relationship_type: str

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

    relationship_type: str | None
    
    profile_image_url: str | None

    children: list[ChildResponse]


class MessageResponse(BaseModel):

    message: str