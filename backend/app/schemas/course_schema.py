from enum import Enum
from typing import Optional

from pydantic import BaseModel, ConfigDict, Field

from app.models.course_model import CourseStatus


class CourseDifficulty(
    str,
    Enum,
):
    BEGINNER = "BEGINNER"
    INTERMEDIATE = "INTERMEDIATE"
    ADVANCED = "ADVANCED"


# -----------------------------
# Create Course
# -----------------------------
class CreateCourseRequest(BaseModel):
    title: str = Field(
        ...,
        min_length=3,
        max_length=255,
    )

    description: Optional[str] = None

    subject_id: str

    difficulty_level: CourseDifficulty


# -----------------------------
# Update Course
# -----------------------------
class UpdateCourseRequest(BaseModel):
    title: Optional[str] = Field(
        default=None,
        min_length=3,
        max_length=255,
    )

    description: Optional[str] = None

    subject_id: Optional[str] = None

    difficulty_level: Optional[
        CourseDifficulty
    ] = None

    status: Optional[
        CourseStatus
    ] = None

    thumbnail_url: Optional[str] = None

# -----------------------------
# Course Response
# -----------------------------
class CourseResponse(BaseModel):

    model_config = ConfigDict(
        from_attributes=True
    )

    id: str

    title: str

    description: Optional[str]

    subject_id: str

    thumbnail_url: Optional[str]

    difficulty_level: CourseDifficulty

    status: str

    created_by: str


# -----------------------------
# Course List Response
# -----------------------------
class CourseListResponse(BaseModel):

    model_config = ConfigDict(
        from_attributes=True
    )

    id: str

    title: str

    description: Optional[str]

    subject_id: str

    thumbnail_url: Optional[str]

    difficulty_level: CourseDifficulty

    status: str


# -----------------------------
# Course Detail Response
# -----------------------------
class CourseDetailResponse(BaseModel):

    model_config = ConfigDict(
        from_attributes=True
    )

    id: str

    title: str

    description: Optional[str]

    subject_id: str

    thumbnail_url: Optional[str]

    difficulty_level: CourseDifficulty

    status: str

    created_by: str

    instructor_teacher_profile_id: Optional[str]

# -----------------------------
# Course Review
# -----------------------------
class LessonReviewResponse(BaseModel):
    model_config = ConfigDict(
        from_attributes=True
    )

    id: str
    lesson_title: str
    lesson_type: str
    duration_minutes: int
    display_order: int


class ModuleReviewResponse(BaseModel):
    model_config = ConfigDict(
        from_attributes=True
    )

    id: str
    module_name: str
    description: Optional[str]
    display_order: int
    lessons: list[LessonReviewResponse]


class CourseReviewResponse(BaseModel):
    model_config = ConfigDict(
        from_attributes=True
    )

    id: str
    title: str
    description: Optional[str]
    thumbnail_url: Optional[str]
    difficulty_level: CourseDifficulty
    status: str
    subject_name: str

    modules: list[ModuleReviewResponse]


# -----------------------------
# Common Message Response
# -----------------------------
class MessageResponse(BaseModel):
    message: str


class PublishCourseResponse(BaseModel):
    message: str

class UnpublishCourseResponse(BaseModel):
    message: str