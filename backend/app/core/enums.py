from enum import Enum


class OTPChannel(str, Enum):
    EMAIL = "email"
    SMS = "sms"


class OTPType(str, Enum):
    LOGIN = "login"
    REGISTRATION = "registration"
    PASSWORD_RESET = "password_reset"
    CHANGE_PASSWORD = "change_password"


class Gender(str, Enum):
    MALE = "male"
    FEMALE = "female"
    OTHER = "other"
    PREFER_NOT_TO_SAY = "prefer_not_to_say"


class NotificationType(str, Enum):
    NEW_RELEASE = "new_release"
    TRENDING = "trending"
    RECOMMENDATION = "recommendation"
    SYSTEM = "system"
    WATCHLIST = "watchlist"
    FAVORITE = "favorite"
    REVIEW_LIKE = "review_like"
