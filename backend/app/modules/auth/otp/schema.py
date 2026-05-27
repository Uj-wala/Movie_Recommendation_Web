from pydantic import (
    BaseModel,
    field_validator
)


class VerifyOTPRequest(BaseModel):

    user_id: str

    otp_code: str

    @field_validator("otp_code")
    @classmethod
    def validate_otp(cls, value):

        if len(value) != 6:
            raise ValueError(
                "OTP must be 6 digits"
            )

        if not value.isdigit():
            raise ValueError(
                "OTP must contain only digits"
            )

        return value


class ResendOTPRequest(BaseModel):

    user_id: str


class OTPResponse(BaseModel):

    message: str