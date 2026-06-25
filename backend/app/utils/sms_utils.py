from datetime import datetime, timedelta


OTP_EXPIRY_MINUTES = 5
otp_store = {}
 
 
def normalize_phone(phone_number: str) -> str:
 
    phone_number = phone_number.strip().replace(" ", "").replace("-", "")
 
    if not phone_number.startswith("+"):
 
        phone_number = f"+{phone_number}"
 
    return phone_number
 
 
def send_sms_otp(phone_number: str):
 
    phone_number = normalize_phone(phone_number)
 
    otp = "123456"
 
    otp_store[phone_number] = {
        "code": otp,
        "expires_at": datetime.utcnow() + timedelta(minutes=OTP_EXPIRY_MINUTES),
    }
 
    return otp
 

def is_sms_otp_expired(phone_number: str, otp_code: str | None = None) -> bool:

    phone_number = normalize_phone(phone_number)

    stored_otp = otp_store.get(phone_number)

    if not stored_otp:
        return False

    if otp_code is not None and stored_otp["code"] != otp_code:
        return False

    if stored_otp["expires_at"] <= datetime.utcnow():
        del otp_store[phone_number]
        return True

    return False

 
def verify_sms_otp(phone_number: str, otp_code: str):
 
    phone_number = normalize_phone(phone_number)
 
    stored_otp = otp_store.get(phone_number)
 
    if not stored_otp:
 
        return False

    if stored_otp["expires_at"] <= datetime.utcnow():

        del otp_store[phone_number]

        return False
 
    if stored_otp["code"] != otp_code:
 
        return False
 
    del otp_store[phone_number]
 
    return True
