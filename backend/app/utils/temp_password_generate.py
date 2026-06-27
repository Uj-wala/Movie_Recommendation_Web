import secrets
import string


TEMP_PASSWORD_LENGTH = 10

def generate_temp_password(
    name: str,
    email: str
) -> str:
    # Keep these parameters for compatibility with existing callers. Passwords
    # are intentionally independent of personal details so they are harder to
    # guess.
    del name, email

    characters = [
        secrets.choice(string.ascii_letters),
        secrets.choice(string.digits),
    ]
    characters.extend(
        secrets.choice(string.ascii_letters + string.digits)
        for _ in range(TEMP_PASSWORD_LENGTH - len(characters))
    )

    secrets.SystemRandom().shuffle(characters)
    return "".join(characters)
