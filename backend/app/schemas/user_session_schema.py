from pydantic import BaseModel
from datetime import datetime


class SessionResponse(BaseModel):

    access_token: str

    refresh_token: str

    token_type: str = "bearer"


class RefreshTokenRequest(BaseModel):

    refresh_token: str


class LogoutRequest(BaseModel):

    refresh_token: str


class SessionInfoResponse(BaseModel):

    id: str

    device_info: str | None

    ip_address: str | None

    expires_at: datetime