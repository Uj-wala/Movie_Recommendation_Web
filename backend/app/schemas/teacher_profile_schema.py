from pydantic import (
    BaseModel,
    field_validator
)


class TeacherProfileCreateRequest(BaseModel):

    school_name: str

    subject: str

    @field_validator("school_name")
    @classmethod
    def validate_school_name(cls, value):

        value = value.strip()

        if len(value) < 2:
            raise ValueError(
                "Invalid school name"
            )

        return value

    @field_validator("subject")
    @classmethod
    def validate_subject(cls, value):

        value = value.strip()

        if len(value) < 2:
            raise ValueError(
                "Invalid subject"
            )

        return value


class TeacherProfileResponse(BaseModel):

    id: str

    school_name: str

    subject: str