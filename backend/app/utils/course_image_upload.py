from pathlib import Path
from uuid import uuid4

from fastapi import HTTPException, UploadFile, status


ALLOWED_EXTENSIONS = {
    "jpg",
    "jpeg",
    "png",
}

ALLOWED_CONTENT_TYPES = {
    "image/jpeg",
    "image/png",
}

MAX_IMAGE_SIZE = 5 * 1024 * 1024

UPLOAD_DIR = Path("uploads/course_thumbnails")


def validate_course_thumbnail(
    file: UploadFile,
    content: bytes,
):
    if not file:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Thumbnail is required",
        )

    if (
        not file.filename
        or
        not file.filename.strip()
    ):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="File name cannot be empty",
        )

    extension = (
        file.filename.rsplit(".", 1)[-1].lower()
        if "." in file.filename
        else ""
    )

    if extension not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid file extension",
        )

    if file.content_type not in ALLOWED_CONTENT_TYPES:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid image content type",
        )

    if len(content) > MAX_IMAGE_SIZE:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="File size cannot exceed 5 MB",
        )

    if (
        extension in {"jpg", "jpeg"}
        and
        not content.startswith(b"\xff\xd8\xff")
    ):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid JPEG image",
        )

    if (
        extension == "png"
        and
        not content.startswith(b"\x89PNG\r\n\x1a\n")
    ):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid PNG image",
        )

    return extension


def save_course_thumbnail(
    file: UploadFile,
    course_id: str,
) -> str:

    content = file.file.read()

    extension = validate_course_thumbnail(
        file,
        content,
    )

    UPLOAD_DIR.mkdir(
        parents=True,
        exist_ok=True,
    )

    filename = (
        f"course_{course_id}_{uuid4().hex}.{extension}"
    )

    filepath = UPLOAD_DIR / filename

    filepath.write_bytes(content)

    return f"/{filepath.as_posix()}"


def delete_course_thumbnail(
    file_url: str | None,
):
    if not file_url:
        return

    filepath = Path(
        file_url.lstrip("/")
    )

    if (
        filepath.exists()
        and
        filepath.is_file()
    ):
        filepath.unlink()