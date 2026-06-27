from app.utils.send_mail import send_email



def send_generated_password_mail(
    email: str,
    full_name: str,
    temp_password: str,
) -> bool:
    subject = "Your AIcademy account is ready"

    body = f"""Hi {full_name},

An administrator created an AIcademy account for you.

Temporary password: {temp_password}

Please sign in and change this temporary password immediately. If you were not
expecting this email, contact your administrator.

Regards,
AIcademy Team
"""

    return send_email(
        to=email,
        subject=subject,
        body=body
    )
