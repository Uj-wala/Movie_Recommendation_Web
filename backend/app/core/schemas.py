from pydantic import BaseModel


class MessageResponse(BaseModel):

    success: bool

    message: str


class ErrorResponse(BaseModel):

    success: bool = False

    message: str

    errors: list[str] | None = None