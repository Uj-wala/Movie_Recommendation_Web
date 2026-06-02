from passlib.context import CryptContext

pwd_context = CryptContext(
    schemes=["bcrypt"],
    deprecated="auto"
)


def hash_password(password: str) -> str:
    return pwd_context.hash(password)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

def hash_security_answer(security_answer: str) -> str:
    return pwd_context.hash(security_answer)


def verify_security_answer(plain_security_answer: str, hashed_security_answer: str) -> bool:
    return pwd_context.verify(plain_security_answer, hashed_security_answer)
