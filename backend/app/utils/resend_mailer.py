import json
from urllib import request
from urllib.error import HTTPError, URLError

from app.core.config import settings


def send_resend_email(to: str, subject: str, html: str) -> bool:
    if not settings.RESEND_API_KEY:
        print("EMAIL ERROR: RESEND_API_KEY is not configured", flush=True)
        return False

    payload = json.dumps({
        "from": settings.EMAIL_FROM,
        "to": [to],
        "subject": subject,
        "html": html,
    }).encode("utf-8")

    resend_request = request.Request(
        "https://api.resend.com/emails",
        data=payload,
        headers={
            "Authorization": f"Bearer {settings.RESEND_API_KEY}",
            "Content-Type": "application/json",
        },
        method="POST",
    )

    try:
        with request.urlopen(resend_request, timeout=15) as response:
            return 200 <= response.status < 300

    except HTTPError as e:
        print(f"EMAIL ERROR: Resend returned {e.code} {e.read().decode('utf-8')}", flush=True)
        return False

    except URLError as e:
        print(f"EMAIL ERROR: Unable to reach Resend API: {e}", flush=True)
        return False
