import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from app.core.config import settings
from app.utils.sms_utils import send_sms_otp
from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from app.schemas.user_schema import ForgotPasswordRequest
from app.utils.user_utils import get_user_by_identifier
import random
SENDER_EMAIL = settings.EMAIL_USERNAME
SENDER_PASSWORD = settings.EMAIL_PASSWORD
def send_email_otp(email, otp):
    subject = "AI Tutoring App - OTP Verification"
    body = f"""
Hello,
Your OTP for verification is:
{otp}
This OTP will expire in 10 minutes.

Regards,
AI Tutoring App Team
"""

    try:
        message = MIMEMultipart()
        message["From"] = SENDER_EMAIL
        message["To"] = email
        message["Subject"] = subject
        message.attach(MIMEText(body, "plain"))
        server = smtplib.SMTP("smtp.gmail.com", 587)
        server.starttls()
        server.login(
            SENDER_EMAIL,
            SENDER_PASSWORD
        )
        server.sendmail(
            SENDER_EMAIL,
            email,
            message.as_string()
        )
        server.quit()
        return True
    except Exception as e:
        print("Email Error:", e)
        return False
