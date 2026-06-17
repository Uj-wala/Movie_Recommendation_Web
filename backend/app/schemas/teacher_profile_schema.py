from pydantic import (
    BaseModel,
    ConfigDict,
    EmailStr,
    field_validator,
)

from app.core.enums import YearsOfExperience
from app.schemas.user_schema import UUID_REGEX


class TeacherProfileCreateRequest(BaseModel):
    user_id: str
    school_name: str
    subject_ids: list[str]

    @field_validator("user_id")
    @classmethod
    def validate_user_id(cls, value: str) -> str:
        value = value.strip()

        if not UUID_REGEX.match(value.lower()):
            raise ValueError("Invalid user ID format")

        return value

    @field_validator("school_name")
    @classmethod
    def validate_school_name(cls, value: str) -> str:
        value = value.strip()

        if len(value) < 3:
            raise ValueError("School name must be at least 3 characters")

        if len(value) > 255:
            raise ValueError("School name must not exceed 255 characters")

        return value

    @field_validator("subject_ids")
    @classmethod
    def validate_subject_ids(cls, value: list[str]) -> list[str]:
        if not value:
            raise ValueError("At least one subject must be selected")

        return value


class TeacherVerificationResponse(BaseModel):
    message: str
    user_id: str
    teacher_id: str


class TeacherProfileUpdate(BaseModel):
    full_name: str | None = None
    qualification: str | None = None
    bio: str | None = None
    years_of_experience: YearsOfExperience | None = None
    subject_ids: list[str] | None = None

    @field_validator("full_name")
    @classmethod
    def validate_full_name(cls, value: str | None) -> str | None:
        if value is None:
            return value

        value = value.strip()

        if len(value) < 3:
            raise ValueError("Full name must contain at least 3 characters")

        return value

    @field_validator("qualification")
    @classmethod
    def validate_qualification(cls, value: str | None) -> str | None:
        if value is None:
            return value

        value = value.strip()

        if len(value) < 2:
            raise ValueError("Qualification is required")

        return value

    @field_validator("bio")
    @classmethod
    def validate_bio(cls, value: str | None) -> str | None:
        if value is None:
            return value

        value = value.strip()

        if len(value) < 10:
            raise ValueError("Bio must contain at least 10 characters")

        return value

    @field_validator("subject_ids")
    @classmethod
    def validate_update_subject_ids(
        cls,
        value: list[str] | None,
    ) -> list[str] | None:
        if value is None:
            return value

        if len(value) == 0:
            raise ValueError("At least one subject must be selected")

        return value


class TeacherPasswordUpdate(BaseModel):
    current_password: str
    new_password: str
    confirm_password: str

    @field_validator("current_password")
    @classmethod
    def validate_current_password(cls, value: str) -> str:
        if not value or not value.strip():
            raise ValueError("Current password is required")

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


class TeacherProfileResponse(BaseModel):
    id: str
    full_name: str
    email: EmailStr | None = None
    phone_number: str | None = None
    qualification: str | None = None
    bio: str | None = None
    years_of_experience: YearsOfExperience | None = None
    subjects: list[str]
    profile_image: str | None = None

    model_config = ConfigDict(from_attributes=True)


class TeacherDashboardResponse(BaseModel):
    full_name: str
    subjects: list[str]
    years_of_experience: YearsOfExperience | None = None
    qualification: str | None = None
    subjects_handling: int
    assessments_assigned: int
    students_above_80: int

    model_config = ConfigDict(from_attributes=True)