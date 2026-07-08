from pathlib import Path
from urllib.parse import quote_plus

from pydantic import model_validator
from pydantic_settings import BaseSettings

BASE_DIR = Path(__file__).resolve().parents[2]


class Settings(BaseSettings):

    PROJECT_NAME: str = "MovieVerse AI"

    # In dev mode every generated OTP is forced to DEV_OTP_CODE and email
    # sending is best-effort (login still succeeds if the email fails).
    DEV_MODE: bool = True
    DEV_OTP_CODE: str = "123456"

    # Set DATABASE_URL directly (e.g. "sqlite:///./movies.db") to use SQLite or any
    # other engine; when unset the MySQL URL is built from the DB_* parts below.
    DATABASE_URL: str | None = None
    DB_USER: str | None = None
    DB_PASSWORD: str | None = None
    DB_HOST: str | None = None
    DB_PORT: int | None = None
    DB_NAME: str | None = None

    JWT_SECRET_KEY: str
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 15
    REFRESH_TOKEN_EXPIRE_DAYS: int = 30
    MAX_LOGIN_ATTEMPTS: int = 3

    ADMIN_EMAIL: str | None = None
    ADMIN_PASSWORD: str | None = None
    ADMIN_FULL_NAME: str = "System Administrator"
    ADMIN_PHONE_NUMBER: str | None = None
    ADMIN_COUNTRY_ISO_CODE: str = "IN"
    ADMIN_SECURITY_ANSWER: str | None = None

    EMAIL_USERNAME: str | None = None
    EMAIL_PASSWORD: str | None = None
    RESEND_API_KEY: str | None = None
    EMAIL_FROM: str = "MovieVerse AI <onboarding@resend.dev>"
    SMTP_HOST: str = "smtp.gmail.com"
    SMTP_PORT: int = 587
    SMTP_USERNAME: str | None = None
    SMTP_PASSWORD: str | None = None
    SMTP_FROM_EMAIL: str | None = None
    SMTP_FROM_NAME: str = "MovieVerse AI"
    SMTP_USE_TLS: bool = True
    SMTP_USE_SSL: bool = False

    """Twilio settings
    TWILIO_ACCOUNT_SID: str
    TWILIO_AUTH_TOKEN: str
    TWILIO_PHONE_NUMBER: str
    TWILIO_VERIFY_SERVICE_SID: str"""

    GOOGLE_CLIENT_ID: str | None = None
    GOOGLE_CLIENT_SECRET: str | None = None

    MICROSOFT_CLIENT_ID: str | None = None
    MICROSOFT_CLIENT_SECRET: str | None = None
    MICROSOFT_TENANT_ID: str = "common"

    APPLE_CLIENT_ID: str | None = None
    APPLE_TEAM_ID: str | None = None
    APPLE_KEY_ID: str | None = None
    APPLE_PRIVATE_KEY: str | None = None

    # Comma-separated allow-list of frontend origins social login is allowed to redirect back to.
    ALLOWED_SOCIAL_REDIRECT_ORIGINS: str = "http://localhost:5173"

    # This backend's own public URL, used to build the OAuth callback registered with each provider.
    API_BASE_URL: str = "http://localhost:8000"

    # OMDb API — key stays server-side; the frontend only ever talks to our proxy.
    OMDB_API_KEY: str | None = None
    OMDB_BASE_URL: str = "https://www.omdbapi.com/"

    @model_validator(mode="after")
    def _resolve_database_url(self):
        # Explicit DATABASE_URL (e.g. sqlite:///./movies.db) wins; otherwise build
        # the MySQL URL from the DB_* parts.
        if not self.DATABASE_URL:
            if not all([self.DB_USER, self.DB_HOST, self.DB_PORT, self.DB_NAME]):
                raise ValueError("Set DATABASE_URL, or all of DB_USER/DB_HOST/DB_PORT/DB_NAME.")
            password = quote_plus(self.DB_PASSWORD or "")
            self.DATABASE_URL = (
                f"mysql+pymysql://{self.DB_USER}:{password}@"
                f"{self.DB_HOST}:{self.DB_PORT}/{self.DB_NAME}"
            )
        return self

    class Config:
        env_file = BASE_DIR / ".env"
        extra = "ignore"

settings = Settings()
