import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from app.core.config import settings

import random
SENDER_EMAIL = settings.EMAIL_USERNAME
SENDER_PASSWORD = settings.EMAIL_PASSWORD


def send_email(to: str, subject: str, body: str):

    try:
        msg = MIMEMultipart()
        msg["From"] = SENDER_EMAIL
        msg["To"] = to
        msg["Subject"] = subject
        msg.attach(MIMEText(body, "plain"))

        server = smtplib.SMTP("smtp.gmail.com", 587)
        server.starttls()
        server.login(SENDER_EMAIL, SENDER_PASSWORD)
        server.sendmail(SENDER_EMAIL, to, msg.as_string())
        server.quit()

        return True

    except Exception as e:
        print("EMAIL ERROR:", str(e))
        print("Email Error:", e)
        return False
