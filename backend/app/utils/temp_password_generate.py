import uuid
import re

def generate_temp_password(
    name: str,
    email: str
) -> str:
    # take email part before @
    email_prefix = email.split("@")[0].capitalize()

    # keep only alphanumeric chars
    email_prefix = re.sub(
        r"[^a-zA-Z0-9]",
        "",
        email_prefix
    )

    # optional: if you want to prefer name instead of email prefix
    base = email_prefix or name.replace(" ", "")

    # take 4 chars from uuid
    random_code = uuid.uuid4().hex[:4].upper()

    return f"{base}{random_code}"