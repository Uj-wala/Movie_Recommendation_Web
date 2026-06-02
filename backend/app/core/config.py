from urllib.parse import quote_plus

from pydantic_settings import BaseSettings


class Settings(BaseSettings):

    PROJECT_NAME: str = "AI Powered Education Tutoring App"

    DB_USER: str
    DB_PASSWORD: str
    DB_HOST: str
    DB_PORT: int
    DB_NAME: str

   
    EMAIL_USERNAME: str
    EMAIL_PASSWORD: str

    # Twilio settings
    TWILIO_ACCOUNT_SID: str
    TWILIO_AUTH_TOKEN: str
    TWILIO_PHONE_NUMBER: str
    TWILIO_VERIFY_SERVICE_SID: str
    

    class Config:
        env_file = ".env"

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
        env_file = ".env"
        extra = "ignore"


settings = Settings()