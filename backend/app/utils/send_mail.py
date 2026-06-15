from app.core.config import settings
from app.utils.resend_mailer import send_resend_email
from app.utils.smtp_mailer import send_smtp_email


def send_email(to: str, subject: str, body: str):

    try:
        html = body.replace("\n", "<br>")

        if settings.RESEND_API_KEY and send_resend_email(to, subject, html):
            return True

        if settings.SMTP_PASSWORD or settings.EMAIL_PASSWORD:
            return send_smtp_email(to, subject, body)

        print("EMAIL ERROR: No email provider is configured", flush=True)
        return False

    except Exception as e:
        print("EMAIL ERROR:", str(e))
        print("Email Error:", e)
        return False
