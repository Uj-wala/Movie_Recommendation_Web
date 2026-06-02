from twilio.rest import Client
from app.core.config import settings

client = Client(
    settings.TWILIO_ACCOUNT_SID,
    settings.TWILIO_AUTH_TOKEN
)

def send_sms_otp(phone_number: str):

    if not phone_number.startswith("+"):
        phone_number = f"+91{phone_number}"

    verification = client.verify.v2.services(
        settings.TWILIO_VERIFY_SERVICE_SID
    ).verifications.create(
        to=phone_number,
        channel="sms"
    )

    return verification.status


def verify_sms_otp(phone_number: str, otp_code: str):

    if not phone_number.startswith("+"):
        phone_number = f"+91{phone_number}"

    verification_check = client.verify.v2.services(
        settings.TWILIO_VERIFY_SERVICE_SID
    ).verification_checks.create(
        to=phone_number,
        code=otp_code
    )

    return verification_check.status == "approved"