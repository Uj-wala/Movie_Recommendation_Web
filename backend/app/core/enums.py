from enum import Enum

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
     