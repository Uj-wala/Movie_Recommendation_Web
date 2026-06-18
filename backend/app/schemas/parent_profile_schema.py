import re

from pydantic import (
    BaseModel,
    field_validator
)

UUID_REGEX = re.compile(

    r"^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$"

)
 
class ParentProfileCreateRequest(BaseModel):

    child_name: str

    child_grade: str

    student_reference_id: str | None = None

    @field_validator("child_name")
    @classmethod
    def validate_child_name(cls, value):

        value = value.strip()

        if len(value) < 2:
            raise ValueError(
                "Invalid child name"
            )

        return value

    @field_validator("child_grade")
    @classmethod
    def validate_child_grade(cls, value):

        value = value.strip()

        if not value:
            raise ValueError(
                "Child grade is required"
            )

        return value


class ParentProfileResponse(BaseModel):

    id: str

    child_name: str

    child_grade: str

    student_reference_id: str | None



   
   
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


class AddChildRequest(BaseModel):

    student_reference_id: str

    @field_validator("student_reference_id")
    @classmethod
    def validate_student_reference_id(cls, value):

        value = value.strip()

        if not UUID_REGEX.match(value.lower()):
            raise ValueError(
                "Invalid student reference ID"
            )

        return value


class ChildResponse(BaseModel):

    id: str
    student_reference_id: str | None
    child_name: str
    grade: str | None
    school_name: str | None


class ParentProfileResponse(BaseModel):

    parent_profile_id: str

    relationship_type: str | None

    children: list[ChildResponse]


class MessageResponse(BaseModel):

    message: str