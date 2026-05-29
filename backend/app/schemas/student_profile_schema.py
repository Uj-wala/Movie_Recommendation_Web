from pydantic import (
    BaseModel,
    field_validator
)


class StudentProfileCreateRequest(BaseModel):

    grade: str

    school_name: str

    workplace: str | None = None

    @field_validator("grade")
    @classmethod
    def validate_grade(cls, value):

        value = value.strip()

        if not value:
            raise ValueError(
                "Grade is required"
            )

        return value

    @field_validator("school_name")
    @classmethod
    def validate_school_name(cls, value):

        value = value.strip()

        if len(value) < 2:
            raise ValueError(
                "Invalid school name"
            )

        return value


class StudentProfileResponse(BaseModel):

    id: str

    grade: str

    school_name: str

    workplace: str | None