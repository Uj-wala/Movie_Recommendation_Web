from pathlib import Path
from uuid import uuid4

from fastapi import HTTPException, UploadFile, status


ALLOWED_EXTENSIONS = {"jpg", "jpeg", "png"}
ALLOWED_CONTENT_TYPES = {"image/jpeg", "image/png"}
MAX_IMAGE_SIZE = 5 * 1024 * 1024
UPLOAD_DIR = Path("uploads/student_profiles")


def validate_image_file(file: UploadFile, content: bytes):
    if not file:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="File must be provided",
        )

    if not file.filename or not file.filename.strip():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="File name cannot be empty",
        )

    extension = file.filename.rsplit(".", 1)[-1].lower() if "." in file.filename else ""

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

    if extension in {"jpg", "jpeg"} and not content.startswith(b"\xff\xd8\xff"):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid JPEG file",
        )

    if extension == "png" and not content.startswith(b"\x89PNG\r\n\x1a\n"):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid PNG file",
        )

    return extension


def save_student_profile_image(file: UploadFile, user_id: int) -> str:
    content = file.file.read()
    extension = validate_image_file(file, content)

    UPLOAD_DIR.mkdir(parents=True, exist_ok=True)

    stored_filename = f"student_{user_id}_{uuid4().hex}.{extension}"
    file_path = UPLOAD_DIR / stored_filename

    file_path.write_bytes(content)

    return f"/{file_path.as_posix()}"


def delete_file_if_exists(file_url: str | None):
    if not file_url:
        return

    file_path = Path(file_url.lstrip("/"))

    if file_path.exists() and file_path.is_file():
        file_path.unlink()