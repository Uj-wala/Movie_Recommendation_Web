from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.core.enums import OTPChannel, OTPType
from app.core.security import hash_password, verify_password
from app.models.genre import Genre
from app.models.user import User
from app.schemas.auth import RegisterRequest
from app.services.otp_service import create_and_send_otp, verify_otp


def _get_by_email(db: Session, email: str) -> User | None:
    return db.query(User).filter(User.email == email.lower()).first()


def _get_by_phone(db: Session, phone: str) -> User | None:
    return db.query(User).filter(User.phone_number == phone).first()


def register(db: Session, data: RegisterRequest) -> User:
    if data.password != data.confirm_password:
        raise HTTPException(status.HTTP_400_BAD_REQUEST, "Passwords do not match")
    if _get_by_email(db, data.email):
        raise HTTPException(status.HTTP_409_CONFLICT, "Email already registered")
    if _get_by_phone(db, data.phone_number):
        raise HTTPException(status.HTTP_409_CONFLICT, "Phone number already registered")

    user = User(
        full_name=data.full_name.strip(),
        username=data.email.split("@")[0].lower(),
        email=data.email.lower(),
        phone_number=data.phone_number,
        country=data.country,
        date_of_birth=data.date_of_birth,
        gender=data.gender,
        password_hash=hash_password(data.password),
    )

    if data.favorite_genres:
        genres = (
            db.query(Genre)
            .filter(Genre.slug.in_(data.favorite_genres) | Genre.name.in_(data.favorite_genres))
            .all()
        )
        user.favorite_genres = genres

    db.add(user)
    db.commit()
    db.refresh(user)
    return user


def send_login_email_otp(db: Session, email: str) -> None:
    user = _get_by_email(db, email)
    if not user:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "No account with this email")
    _guard_blocked(user)
    create_and_send_otp(db, user, OTPType.LOGIN, OTPChannel.EMAIL)


def send_login_phone_otp(db: Session, phone: str) -> None:
    user = _get_by_phone(db, phone)
    if not user:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "No account with this phone number")
    _guard_blocked(user)
    create_and_send_otp(db, user, OTPType.LOGIN, OTPChannel.SMS)


def login_with_password(db: Session, email: str, password: str) -> User:
    """Email + password login. Returns the user or raises 401 on bad credentials.

    Uses a single generic 401 (not 404) so it can't be used to probe which
    emails are registered.
    """
    user = _get_by_email(db, email)
    if not user or not verify_password(password, user.password_hash):
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Invalid email or password")
    _guard_blocked(user)
    _mark_verified(db, user)
    return user


def verify_login_email(db: Session, email: str, otp: str) -> User:
    user = _get_by_email(db, email)
    if not user:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "No account with this email")
    _guard_blocked(user)
    ok, msg = verify_otp(db, user, otp, OTPType.LOGIN, OTPChannel.EMAIL)
    if not ok:
        raise HTTPException(status.HTTP_400_BAD_REQUEST, msg)
    _mark_verified(db, user)
    return user


def verify_login_phone(db: Session, phone: str, otp: str) -> User:
    user = _get_by_phone(db, phone)
    if not user:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "No account with this phone number")
    _guard_blocked(user)
    ok, msg = verify_otp(db, user, otp, OTPType.LOGIN, OTPChannel.SMS)
    if not ok:
        raise HTTPException(status.HTTP_400_BAD_REQUEST, msg)
    _mark_verified(db, user)
    return user


def forgot_password(db: Session, email: str) -> None:
    user = _get_by_email(db, email)
    if not user:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "No account with this email")
    create_and_send_otp(db, user, OTPType.PASSWORD_RESET, OTPChannel.EMAIL)


def reset_password(db: Session, email: str, otp: str, new_password: str, confirm: str) -> None:
    if new_password != confirm:
        raise HTTPException(status.HTTP_400_BAD_REQUEST, "Passwords do not match")
    user = _get_by_email(db, email)
    if not user:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "No account with this email")
    ok, msg = verify_otp(db, user, otp, OTPType.PASSWORD_RESET, OTPChannel.EMAIL)
    if not ok:
        raise HTTPException(status.HTTP_400_BAD_REQUEST, msg)
    user.password_hash = hash_password(new_password)
    db.commit()


def start_change_password(db: Session, user: User, current_password: str,
                          new_password: str, confirm: str) -> None:
    if not verify_password(current_password, user.password_hash):
        raise HTTPException(status.HTTP_400_BAD_REQUEST, "Current password is incorrect")
    if new_password != confirm:
        raise HTTPException(status.HTTP_400_BAD_REQUEST, "Passwords do not match")
    # Stash the new hash by sending an OTP; the pending password is re-supplied
    # on verify, so nothing sensitive is stored between steps.
    create_and_send_otp(db, user, OTPType.CHANGE_PASSWORD, OTPChannel.EMAIL)


def verify_change_password(db: Session, user: User, otp: str,
                           new_password: str, confirm: str) -> None:
    if new_password != confirm:
        raise HTTPException(status.HTTP_400_BAD_REQUEST, "Passwords do not match")
    ok, msg = verify_otp(db, user, otp, OTPType.CHANGE_PASSWORD, OTPChannel.EMAIL)
    if not ok:
        raise HTTPException(status.HTTP_400_BAD_REQUEST, msg)
    user.password_hash = hash_password(new_password)
    db.commit()


def _guard_blocked(user: User) -> None:
    if user.is_blocked or not user.is_active:
        raise HTTPException(status.HTTP_403_FORBIDDEN, "Account is blocked or inactive")


def _mark_verified(db: Session, user: User) -> None:
    if not user.is_verified:
        user.is_verified = True
        db.commit()
