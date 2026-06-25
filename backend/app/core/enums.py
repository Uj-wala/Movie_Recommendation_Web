from enum import Enum


class UserRole(str, Enum):
    STUDENT = "student"
    TEACHER = "teacher"
    PARENT = "parent"
    ADMIN = "admin"

class OTPChannel(str, Enum):
    EMAIL = "email"
    SMS = "sms"

class OTPType(str, Enum):
    REGISTRATION = "registration"
    PASSWORD_RESET = "password_reset"


class SecurityQuestion(str, Enum):
    FAVORITE_FOOD = "favorite_food"
    FAVORITE_COUNTRY = "favorite_country"
    FAVORITE_SPORT = "favorite_sport"