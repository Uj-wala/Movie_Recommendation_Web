from app.core.config import settings
from app.utils.resend_mailer import send_resend_email
from app.utils.smtp_mailer import send_smtp_email

def send_email_otp(email: str, otp: str):
    subject = "AI Tutoring App - Email OTP"
    body = f"""
<h2>Your OTP for verification is: {otp}</h2>
<p>This OTP will expire in 10 minutes.</p>
"""

    try:
        print(f"Email OTP for {email}: {otp}", flush=True)

        if settings.RESEND_API_KEY and send_resend_email(email, subject, body):
            return True

        if settings.SMTP_PASSWORD or settings.EMAIL_PASSWORD:
            return send_smtp_email(email, subject, f"Your OTP for verification is: {otp}\n\nThis OTP will expire in 10 minutes.")

        print("EMAIL ERROR: No email provider is configured", flush=True)
        return False

    except Exception as e:
        print("EMAIL ERROR:", str(e))
        print("Email Error:", e)
        return False
