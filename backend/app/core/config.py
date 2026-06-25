from pathlib import Path
from urllib.parse import quote_plus

from pydantic_settings import BaseSettings

BASE_DIR = Path(__file__).resolve().parents[2]


class Settings(BaseSettings):

    PROJECT_NAME: str = "AI Powered Education Tutoring App"

    DB_USER: str
    DB_PASSWORD: str
    DB_HOST: str
    DB_PORT: int
    DB_NAME: str
    
    JWT_SECRET_KEY: str
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 15
    REFRESH_TOKEN_EXPIRE_DAYS: int = 30
    MAX_LOGIN_ATTEMPTS: int = 3

    EMAIL_USERNAME: str = "vishnuvardhad015@gmail.com"
    EMAIL_PASSWORD: str = "yusg bltn lnhz isms"
    RESEND_API_KEY: str | None = None
    EMAIL_FROM: str = "AI Tutoring App <onboarding@resend.dev>"
    SMTP_HOST: str = "smtp.gmail.com"
    SMTP_PORT: int = 587
    SMTP_USERNAME: str | None = None
    SMTP_PASSWORD: str | None = None
    SMTP_FROM_EMAIL: str | None = None
    SMTP_FROM_NAME: str = "AI Tutoring App"
    SMTP_USE_TLS: bool = True
    SMTP_USE_SSL: bool = False

    """Twilio settings
    TWILIO_ACCOUNT_SID: str
    TWILIO_AUTH_TOKEN: str
    TWILIO_PHONE_NUMBER: str
    TWILIO_VERIFY_SERVICE_SID: str"""

    @property
    def DATABASE_URL(self):

        password = quote_plus(self.DB_PASSWORD)

        return (
            f"mysql+pymysql://{self.DB_USER}:"
            f"{password}@"
            f"{self.DB_HOST}:"
            f"{self.DB_PORT}/"
            f"{self.DB_NAME}"
        )

    class Config:
        env_file = BASE_DIR / ".env"
        extra = "ignore"

settings = Settings()
