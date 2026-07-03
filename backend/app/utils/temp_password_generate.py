import secrets
import string


TEMP_PASSWORD_LENGTH = 10


def generate_temp_password() -> str:
    characters = [
        secrets.choice(string.ascii_letters),
        secrets.choice(string.digits),
    ]

    characters.extend(
        secrets.choice(
            string.ascii_letters + string.digits
        )
        for _ in range(
            TEMP_PASSWORD_LENGTH - len(characters)
        )
    )

    secrets.SystemRandom().shuffle(characters)

    return "".join(characters)