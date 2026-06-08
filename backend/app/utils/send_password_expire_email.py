from app.utils.send_mail import send_email



def send_password_expiry_email(
    email: str,
    full_name: str
):
    subject = (
        "Password Expired"
    )

    body = f"""
    Hi {full_name},

    Your password has expired due to inactivity for
    more than 45 days.

    Please reset your password to continue using your account.

    Regards,
    AIcademy Team
    """

    send_email(
        to=email,
        subject=subject,
        body=body
    )