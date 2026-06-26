from app.utils.send_mail import send_email



def send_generated_password_mail(
    email: str,
    full_name: str,
    temp_password:str
):
    subject = (
        "Member Added successfully"
    )

    body = f"""
    Hi {full_name},

    {temp_password}, This is your temporary password to login.

    If there is any issue please reachout us.

    Regards,
    AIcademy Team
    """

    send_email(
        to=email,
        subject=subject,
        body=body
    )