import random
 
otp_store = {}
 
 
def normalize_phone(phone_number: str) -> str:
 
    phone_number = phone_number.strip().replace(" ", "").replace("-", "")
 
    if not phone_number.startswith("+"):
 
        phone_number = f"+{phone_number}"
 
    return phone_number
 
 
def send_sms_otp(phone_number: str):
 
    phone_number = normalize_phone(phone_number)
 
    otp = str(random.randint(100000, 999999))
 
    otp_store[phone_number] = otp
 
    print(f"SMS OTP for {phone_number}: {otp}")
 
    return otp
 
 
def verify_sms_otp(phone_number: str, otp_code: str):
 
    phone_number = normalize_phone(phone_number)
 
    stored_otp = otp_store.get(phone_number)
 
    if not stored_otp:
 
        return False
 
    if stored_otp != otp_code:
 
        return False
 
    del otp_store[phone_number]
 
    return True