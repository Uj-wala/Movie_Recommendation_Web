import smtplib
from email.message import EmailMessage
from email.utils import formataddr, formatdate, make_msgid
from html import escape

from app.core.config import settings


def send_smtp_email(to: str, subject: str, body: str) -> bool:
    from_email = settings.SMTP_FROM_EMAIL or settings.EMAIL_USERNAME
    username = settings.SMTP_USERNAME or settings.EMAIL_USERNAME
    password = settings.SMTP_PASSWORD or settings.EMAIL_PASSWORD

    if not from_email or not username or not password:
        print("EMAIL ERROR: SMTP sender credentials are incomplete", flush=True)
        return False

    sender_domain = from_email.rsplit("@", 1)[-1]
    msg = EmailMessage()
    msg["From"] = formataddr((settings.SMTP_FROM_NAME, from_email))
    msg["To"] = to
    msg["Subject"] = subject
    msg["Date"] = formatdate(localtime=False)
    msg["Message-ID"] = make_msgid(domain=sender_domain)
    msg["Reply-To"] = from_email
    msg.set_content(body)
    msg.add_alternative(
        "<html><body>"
        f"<p>{escape(body).replace(chr(10), '<br>')}</p>"
        "</body></html>",
        subtype="html",
    )

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
        refused_recipients = server.send_message(msg, from_addr=from_email, to_addrs=[to])

        if refused_recipients:
            print("EMAIL ERROR: SMTP server refused the recipient", flush=True)
            return False

        return True

    except Exception as e:
        print("EMAIL ERROR:", str(e), flush=True)
        return False

    finally:
        if server:
            try:
                server.quit()
            except Exception:
                pass
