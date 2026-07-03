from fastapi import (
    APIRouter,
    Depends,
    File,
    Form,
    UploadFile,
    status,
)
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.dependencies import required_role

from app.models.user_model import User

from app.schemas.course_schema import (
    CreateCourseRequest,
    UpdateCourseRequest,
    CourseDifficulty,
    CourseResponse,
    CourseListResponse,
    CourseReviewResponse,
    PublishCourseResponse,
    UnpublishCourseResponse,
)

from app.services.course_service import (
    create_course_service,
    get_my_courses_service,
    get_course_details_service,
    get_course_review_service,
    update_course_service,
    save_draft_service,
    publish_course_service,
    unpublish_course_service,
)

router = APIRouter(
    prefix="/courses",
    tags=["Courses"],
)


# ---------------------------------
# Create Course
# ---------------------------------
@router.post(
    "",
    status_code=status.HTTP_201_CREATED,
    response_model=CourseResponse,
)
def create_course(
    title: str = Form(...),
    description: str = Form(None),
    subject_id: str = Form(...),
    difficulty_level: CourseDifficulty = Form(...),
    thumbnail: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(required_role(["teacher", "admin"])),
):
    payload = CreateCourseRequest(
        title=title,
        description=description,
        subject_id=subject_id,
        difficulty_level=difficulty_level,
    )

    return create_course_service(
        db,
        current_user,
        payload,
        thumbnail,
    )


# ---------------------------------
# Get My Courses
# ---------------------------------
@router.get(
    "/my-courses",
    response_model=list[CourseListResponse],
)
def get_my_courses(
    db: Session = Depends(get_db),
    current_user: User = Depends(required_role(["teacher", "admin"])),
):
    return get_my_courses_service(
        db,
        current_user,
    )


# ---------------------------------
# Get Course Details
# ---------------------------------
@router.get(
    "/{course_id}",
    response_model=CourseResponse,
)
def get_course_details(
    course_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(required_role(["teacher", "admin"])),
):
    return get_course_details_service(
        db,
        current_user,
        course_id,
    )


# ---------------------------------
# Course Review (Story 4)
# ---------------------------------
@router.get(
    "/{course_id}/review",
    response_model=CourseReviewResponse,
)
def get_course_review(
    course_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(required_role(["teacher", "admin"])),
):
    return get_course_review_service(
        db,
        current_user,
        course_id,
    )

# ---------------------------------
# Publish Course (story 4)
# ---------------------------------
@router.patch(
    "/{course_id}/publish",
    response_model=PublishCourseResponse,
)
def publish_course(
    course_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(
        required_role(["teacher", "admin"])
    ),
):
    return publish_course_service(
        db,
        current_user,
        course_id,
    )

# ---------------------------------
# Unpublish Course (story 4)
# ---------------------------------
@router.patch(
    "/{course_id}/unpublish",
    response_model=UnpublishCourseResponse,
)
def unpublish_course(
    course_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(
        required_role(["teacher", "admin"])
    ),
):
    return unpublish_course_service(
        db,
        current_user,
        course_id,
    )

# ---------------------------------
# Update Course
# ---------------------------------
@router.put(
    "/{course_id}",
    response_model=CourseResponse,
)
def update_course(
    course_id: str,
    payload: UpdateCourseRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(required_role(["teacher", "admin"])),
):
    return update_course_service(
        db,
        current_user,
        course_id,
        payload,
    )


# ---------------------------------
# Save Draft
# ---------------------------------
@router.patch(
    "/{course_id}/draft",
)
def save_draft(
    course_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(required_role(["teacher", "admin"])),
):
    return save_draft_service(
        db,
        current_user,
        course_id,
    )