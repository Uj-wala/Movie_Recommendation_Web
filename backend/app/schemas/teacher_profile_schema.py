from typing import List

from pydantic import (
    BaseModel,
    field_validator
)

from app.schemas.user_schema import UUID_REGEX


class TeacherProfileCreateRequest(BaseModel):
    user_id: str

    school_name: str

    subject_ids: List[str]
    
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

    @field_validator("subject_ids")
    @classmethod
    def validate_subject_ids(cls, value):

        if not value:
            raise ValueError(
                "At least one subject must be selected"
            )

        return value


class TeacherProfileResponse(BaseModel):

    message: str
 
    user_id: str
    
    teacher_id: str