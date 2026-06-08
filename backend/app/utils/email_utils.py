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

def send_email_otp(email: str, otp: str):
    subject = "AI Tutoring App - Email OTP"
    
    body = f"""
Your OTP for verification is: {otp}

This OTP will expire in 10 minutes.
"""

    try:
        print(f"Email OTP for {email}: {otp}", flush=True)

        msg = MIMEMultipart()
        msg["From"] = SENDER_EMAIL
        msg["To"] = email
        msg["Subject"] = subject
        msg.attach(MIMEText(body, "plain"))

        server = smtplib.SMTP("smtp.gmail.com", 587)
        server.starttls()
        server.login(SENDER_EMAIL, SENDER_PASSWORD)
        server.sendmail(SENDER_EMAIL, email, msg.as_string())
        server.quit()

        return True

    except Exception as e:
        print("EMAIL ERROR:", str(e))
        print("Email Error:", e)
        return False
