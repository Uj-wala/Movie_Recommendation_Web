from datetime import (
    datetime,
    timedelta,
    timezone
)

from fastapi import (
    HTTPException,
    status
)

from app.utils.send_password_expire_email import (
    send_password_expiry_email
)

INACTIVE_DAYS = 45


def check_password_reset_policy(
    user,
    db
):
    now = datetime.now( timezone.utc)

    last_login_at = (user.last_login_at)

    # Convert naive datetime
    # to UTC aware datetime
    if (
        last_login_at
        and last_login_at.tzinfo
        is None
    ):
        last_login_at = (
            last_login_at.replace(
                tzinfo=
                timezone.utc
            )
        )

    if (
        last_login_at
        and now
        - last_login_at
        > timedelta(
            days=
            INACTIVE_DAYS
        )
    ):

        db.commit()

        # Send mail
        if user.email:
            send_password_expiry_email(
                user.email,
                user.full_name
            )
        raise HTTPException(
            status_code=
            status.HTTP_403_FORBIDDEN,
            detail={
                "message":
                "Password expired. "
                "Please check "
                "your email.",
                "code":
                "PASSWORD_RESET_REQUIRED"
            }
        )