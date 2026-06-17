from enum import Enum, StrEnum

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
     



class GradeLevel(StrEnum):
    GRADE_1 = "Grade 1"
    GRADE_2 = "Grade 2"
    GRADE_3 = "Grade 3"
    GRADE_4 = "Grade 4"
    GRADE_5 = "Grade 5"
    GRADE_6 = "Grade 6"
    GRADE_7 = "Grade 7"
    GRADE_8 = "Grade 8"
    GRADE_9 = "Grade 9"
    GRADE_10 = "Grade 10"
    UNIVERSITY_1 = "1st year university"
    UNIVERSITY_2 = "2nd year university"
    UNIVERSITY_3 = "3rd year university"
    UNIVERSITY_4 = "4th year university"
    GRADUATE = "Graduate studies"
    ADULT = "Adult learner"
    OTHER = "Other"


class LearningInterest(str, Enum):
    MATHEMATICS = "Mathematics"
    SCIENCE = "Science"
    CODING = "Coding"
    ARTIFICIAL_INTELLIGENCE = "Artificial Intelligence"
    HISTORY = "History"


class LearningStyle(str, Enum):
    VIDEO_LEARNING = "Video Learning"
    READING = "Reading"
    INTERACTIVE_QUIZ = "Interactive Quiz"


class YearsOfExperience(str, Enum):
    ONE_YEAR = "1 Year"
    TWO_YEARS = "2 Years"
    THREE_YEARS = "3 Years"
    FOUR_YEARS = "4 Years"
    FIVE_YEARS = "5 Years"
    SIX_TO_TEN_YEARS = "6-10 Years"
    TEN_PLUS_YEARS = "10+ Years"