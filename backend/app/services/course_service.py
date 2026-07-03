from datetime import datetime

from fastapi import HTTPException, UploadFile, status
from sqlalchemy.orm import Session

from app.models.course_model import Course, CourseStatus
from app.models.user_model import User

from app.repository.course_repository import (
    create_course,
    get_course_by_id,
    get_course_review_by_id,
    get_courses_by_creator,
    get_subject_by_id,
    get_teacher_profile_by_user_id,
    update_course,
)

from app.schemas.course_schema import (
    CourseResponse,
    CourseListResponse,
    CourseDetailResponse,
    CourseReviewResponse,
    ModuleReviewResponse,
    LessonReviewResponse,
    CreateCourseRequest,
    UpdateCourseRequest,
    MessageResponse,
    PublishCourseResponse,
    UnpublishCourseResponse,
)

from app.utils.course_image_upload import (
    save_course_thumbnail,
)


def build_course_response(
    course: Course,
) -> CourseResponse:
    return CourseResponse(
        id=course.id,
        title=course.title,
        description=course.description,
        subject_id=course.subject_id,
        thumbnail_url=course.thumbnail_url,
        difficulty_level=course.difficulty_level,
        status=course.status.value,
        created_by=course.created_by,
    )


def build_course_detail_response(
    course: Course,
) -> CourseDetailResponse:
    return CourseDetailResponse(
        id=course.id,
        title=course.title,
        description=course.description,
        subject_id=course.subject_id,
        thumbnail_url=course.thumbnail_url,
        difficulty_level=course.difficulty_level,
        status=course.status.value,
        created_by=course.created_by,
        instructor_teacher_profile_id=course.instructor_teacher_profile_id,
    )


def create_course_service(
    db: Session,
    current_user: User,
    payload: CreateCourseRequest,
    thumbnail: UploadFile,
) -> CourseResponse:

    # Validate Subject
    subject = get_subject_by_id(
        db,
        payload.subject_id,
    )

    if subject is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Subject not found",
        )

    teacher_profile_id = None

    # Only Teacher needs Teacher Profile
    if current_user.role.name.lower() == "teacher":

        teacher_profile = get_teacher_profile_by_user_id(
            db,
            current_user.id,
        )

        if teacher_profile is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Teacher profile not found",
            )

        teacher_profile_id = teacher_profile.id

    course = Course(
        created_by=current_user.id,
        instructor_teacher_profile_id=teacher_profile_id,
        subject_id=payload.subject_id,
        title=payload.title,
        description=payload.description,
        difficulty_level=payload.difficulty_level,
        status=CourseStatus.DRAFT,
        is_active=True,
    )

    create_course(
        db,
        course,
    )

    course.thumbnail_url = save_course_thumbnail(
        thumbnail,
        course.id,
    )

    update_course(
        db,
        course,
    )

    return build_course_response(
        course,
    )


def get_my_courses_service(
    db: Session,
    current_user: User,
):
    courses = get_courses_by_creator(
        db,
        current_user.id,
    )

    return [
        CourseListResponse.model_validate(
            course
        )
        for course in courses
    ]


def get_course_details_service(
    db: Session,
    current_user: User,
    course_id: str,
):
    course = get_course_by_id(
        db,
        course_id,
    )

    if course is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Course not found",
        )

    return build_course_detail_response(
        course,
    )

def get_course_review_service(
    db: Session,
    current_user: User,
    course_id: str,
):
    course = get_course_review_by_id(
        db,
        course_id,
    )

    if course is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Course not found",
        )

    if (
        course.created_by != current_user.id
        and current_user.role.name.lower() != "admin"
    ):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You are not authorized to review this course.",
        )

    return CourseReviewResponse(
        id=course.id,
        title=course.title,
        description=course.description,
        thumbnail_url=course.thumbnail_url,
        difficulty_level=course.difficulty_level,
        status=course.status.value,
        subject_name=course.subject.name if course.subject else "",
        modules=[
            ModuleReviewResponse(
                id=module.id,
                module_name=module.module_name,
                description=module.description,
                display_order=module.display_order,
                lessons=[
                    LessonReviewResponse(
                        id=lesson.id,
                        lesson_title=lesson.lesson_title,
                        lesson_type=lesson.lesson_type.value,
                        duration_minutes=lesson.duration_minutes,
                        display_order=lesson.display_order,
                    )
                    for lesson in sorted(
                        module.lessons,
                        key=lambda x: x.display_order,
                    )
                ],
            )
            for module in sorted(
                course.modules,
                key=lambda x: x.display_order,
            )
        ],
    )

def update_course_service(
    db: Session,
    current_user: User,
    course_id: str,
    payload: UpdateCourseRequest,
):
    course = get_course_by_id(
        db,
        course_id,
    )

    if course is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Course not found",
        )

    if payload.title is not None:
        course.title = payload.title

    if payload.description is not None:
        course.description = payload.description

    if payload.subject_id is not None:
        subject = get_subject_by_id(
            db,
            payload.subject_id,
        )

        if subject is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Subject not found",
            )

        course.subject_id = payload.subject_id

    if payload.difficulty_level is not None:
        course.difficulty_level = payload.difficulty_level

    # Only Admin can change course status
    if payload.status is not None:

        if current_user.role.name.lower() != "admin":
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Only Admin can publish or unpublish courses.",
            )

        course.status = payload.status

        if payload.status == CourseStatus.PUBLISHED:
            course.published_at = datetime.utcnow()

        elif payload.status == CourseStatus.UNPUBLISHED:
            course.published_at = None

    course.updated_at = datetime.utcnow()

    course = update_course(
        db,
        course,
    )

    return build_course_response(
        course,
    )
def save_draft_service(
    db: Session,
    current_user: User,
    course_id: str,
):
    course = get_course_by_id(
        db,
        course_id,
    )

    if course is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Course not found",
        )

    course.status = CourseStatus.DRAFT

    update_course(
        db,
        course,
    )

    return MessageResponse(
        message="Course saved as draft successfully."
    )

def publish_course_service(
    db: Session,
    current_user: User,
    course_id: str,
):
    course = get_course_by_id(
        db,
        course_id,
    )

    if course is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Course not found",
        )

    # Only the course owner or admin can publish
    if (
        course.created_by != current_user.id
        and current_user.role.name.lower() != "admin"
    ):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You are not authorized to publish this course.",
        )

    if course.status == CourseStatus.PUBLISHED:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Course is already published.",
        )

    # Validate that the course has at least one module
    if len(course.modules) == 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot publish a course without modules.",
        )

    course.status = CourseStatus.PUBLISHED
    course.published_at = datetime.utcnow()
    course.updated_at = datetime.utcnow()

    update_course(
        db,
        course,
    )

    return PublishCourseResponse(
        message="Course published successfully."
    )

def unpublish_course_service(
    db: Session,
    current_user: User,
    course_id: str,
):
    course = get_course_by_id(
        db,
        course_id,
    )

    if course is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Course not found",
        )

    if (
        course.created_by != current_user.id
        and current_user.role.name.lower() != "admin"
    ):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You are not authorized to unpublish this course.",
        )

    if course.status != CourseStatus.PUBLISHED:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Only published courses can be unpublished.",
        )

    course.status = CourseStatus.UNPUBLISHED
    course.published_at = None

    update_course(
        db,
        course,
    )

    return UnpublishCourseResponse(
        message="Course unpublished successfully."
    )