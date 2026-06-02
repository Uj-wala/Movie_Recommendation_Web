from pydantic import (
    BaseModel,
    EmailStr,
    field_validator
)

class VerifyOTPRequest(BaseModel):
    phone_number: str
    otp_code: str

    @field_validator("otp_code")
    @classmethod
    def validate_otp(cls, value):
        if len(value) != 6:
            raise ValueError("OTP must be 6 digits")

        if not value.isdigit():
            raise ValueError("OTP must contain only digits")

        return value


class ResendOTPRequest(BaseModel):
    phone_number: str


class SendEmailOTPRequest(BaseModel):
    email: EmailStr


class VerifyEmailOTPRequest(BaseModel):
    email: EmailStr
    otp_code: str


class OTPResponse(BaseModel):
    message: str