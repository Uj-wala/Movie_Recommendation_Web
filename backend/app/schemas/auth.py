from datetime import date

from pydantic import BaseModel, EmailStr, Field

from app.core.enums import Gender


class RegisterRequest(BaseModel):
    full_name: str = Field(min_length=2, max_length=255)
    email: EmailStr
    phone_number: str = Field(min_length=6, max_length=20)
    date_of_birth: date
    gender: Gender
    country: str = Field(min_length=2, max_length=100)
    password: str = Field(min_length=8, max_length=128)
    confirm_password: str
    favorite_genres: list[str] = Field(default_factory=list)  # genre slugs or names


class PasswordLogin(BaseModel):
    email: EmailStr
    password: str = Field(min_length=1, max_length=128)


class SendEmailOTP(BaseModel):
    email: EmailStr


class SendPhoneOTP(BaseModel):
    phone_number: str = Field(min_length=6, max_length=20)


class VerifyEmailOTP(BaseModel):
    email: EmailStr
    otp: str = Field(min_length=4, max_length=6)


class VerifyPhoneOTP(BaseModel):
    phone_number: str = Field(min_length=6, max_length=20)
    otp: str = Field(min_length=4, max_length=6)


class ForgotPasswordRequest(BaseModel):
    email: EmailStr


class ResetPasswordRequest(BaseModel):
    email: EmailStr
    otp: str = Field(min_length=4, max_length=6)
    new_password: str = Field(min_length=8, max_length=128)
    confirm_password: str


class ChangePasswordRequest(BaseModel):
    current_password: str
    new_password: str = Field(min_length=8, max_length=128)
    confirm_password: str


class ChangePasswordVerify(BaseModel):
    otp: str = Field(min_length=4, max_length=6)
    new_password: str = Field(min_length=8, max_length=128)
    confirm_password: str


class TokenResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"


class RefreshRequest(BaseModel):
    refresh_token: str


class MessageResponse(BaseModel):
    message: str
