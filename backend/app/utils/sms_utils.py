import random

# Temporary OTP storage
otp_store = {}

def send_sms_otp(phone_number: str):
    otp = str(random.randint(100000, 999999))

    otp_store[phone_number] = otp

    print(f"OTP for {phone_number}: {otp}")

    return otp


def verify_sms_otp(phone_number: str, otp_code: str):
    stored_otp = otp_store.get(phone_number)

    if not stored_otp:
        return False

    if stored_otp != otp_code:
        return False

    del otp_store[phone_number]

    return True