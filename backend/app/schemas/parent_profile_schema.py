from pydantic import (
    BaseModel,
    field_validator
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