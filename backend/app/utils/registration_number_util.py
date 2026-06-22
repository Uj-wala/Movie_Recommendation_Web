from sqlalchemy.orm import Session
from datetime import datetime
 
from app.models.user_model import User
 
ROLE_PREFIX_MAP = {
    "student": "STU",
    "teacher": "TEA",
    "parent": "PAR",
    "admin": "ADM",
}
 
 
def generate_registration_number(db: Session, role_name: str) -> str:
 
    role_key = role_name.lower().strip()
    prefix = ROLE_PREFIX_MAP.get(role_key)
 
    if not prefix:
        raise ValueError(
            f"No registration prefix configured for role: {role_name}"
        )
 
    current_year = datetime.utcnow().year
 
    last_user = (
        db.query(User)
        .filter(
            User.registration_number.like(
                f"{prefix}-{current_year}-%"
            )
        )
        .order_by(User.registration_number.desc())
        .first()
    )
 
    if last_user and last_user.registration_number:
 
        try:
            last_number = int(
                last_user.registration_number.split("-")[-1]
            )
        except ValueError:
            last_number = 0
 
        next_number = last_number + 1
 
    else:
        next_number = 1
 
    return (
        f"{prefix}-{current_year}-{next_number:06d}"
    )
 