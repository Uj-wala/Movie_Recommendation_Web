import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from email.utils import formataddr

from app.core.config import settings


def send_smtp_email(to: str, subject: str, body: str) -> bool:
    from_email = settings.SMTP_FROM_EMAIL or settings.EMAIL_USERNAME
    username = settings.SMTP_USERNAME or settings.EMAIL_USERNAME
    password = settings.SMTP_PASSWORD or settings.EMAIL_PASSWORD

    msg = MIMEMultipart()
    msg["From"] = formataddr((settings.SMTP_FROM_NAME, from_email))
    msg["To"] = to
    msg["Subject"] = subject
    msg.attach(MIMEText(body, "plain"))

    server = None

    try:
        if settings.SMTP_USE_SSL:
            server = smtplib.SMTP_SSL(
                settings.SMTP_HOST,
                settings.SMTP_PORT,
                timeout=15
            )
        else:
            server = smtplib.SMTP(
                settings.SMTP_HOST,
                settings.SMTP_PORT,
                timeout=15
            )

            if settings.SMTP_USE_TLS:
                server.starttls()

        server.login(username, password)
        server.sendmail(from_email, [to], msg.as_string())

        return True

    except Exception as e:
        print("EMAIL ERROR:", str(e), flush=True)
        return False

    finally:
        if server:
            server.quit()
