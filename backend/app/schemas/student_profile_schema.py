from uuid import UUID

from pydantic import (
    BaseModel,
    ConfigDict,
    EmailStr,
    Field,
    field_validator,
    model_validator,
)

from app.core.enums import (
    GradeLevel,
    LearningInterest,
    LearningStyle,
)


class StudentProfileUpdate(BaseModel):
    """Request body for PATCH /student/profile."""

    full_name: str | None = Field(
        default=None,
        min_length=3,
        max_length=100,
    )

    grade: GradeLevel | None = None

    school_name: str | None = Field(
        default=None,
        min_length=3,
        max_length=255,
    )

    learning_interests: list[LearningInterest] | None = Field(
        default=None,
        max_length=5,
    )

    preferred_learning_style: LearningStyle | None = None

    @field_validator("full_name", "school_name")
    @classmethod
    def normalize_text(
        cls,
        value: str | None,
    ) -> str | None:
        if value is None:
            return None

        return " ".join(value.split())

    @field_validator("learning_interests")
    @classmethod
    def remove_duplicate_interests(
        cls,
        values: list[LearningInterest] | None,
    ) -> list[LearningInterest] | None:
        if values is None:
            return None

        return list(dict.fromkeys(values))

    @model_validator(mode="after")
    def validate_at_least_one_field(self):
        if not self.model_fields_set:
            raise ValueError(
                "At least one profile field must be provided"
            )

        return self


class StudentProfileResponse(BaseModel):
    """Response for profile view, update, and image upload."""

    id: UUID
    full_name: str
    email: EmailStr | None = None
    grade: GradeLevel
    school_name: str | None = None

    learning_interests: list[LearningInterest] = Field(
        default_factory=list
    )

    preferred_learning_style: LearningStyle | None = None
    profile_image: str | None = None

    model_config = ConfigDict(
        from_attributes=True
    )


class StudentProfileImageResponse(BaseModel):
    message: str
    profile_image: str


class StudentDashboardResponse(BaseModel):
    full_name: str
    grade: GradeLevel

    learning_interests: list[LearningInterest] = Field(
        default_factory=list
    )

    pending_tasks: int = Field(
        default=0,
        ge=0,
    )

    ongoing_tasks: int = Field(
        default=0,
        ge=0,
    )

    completed_tasks: int = Field(
        default=0,
        ge=0,
    )