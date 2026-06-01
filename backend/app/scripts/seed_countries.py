import json
from pathlib import Path

from sqlalchemy.orm import Session

from app.core.database import SessionLocal
from app.models.country_model import Country

NAME_MAPPING = {
    "Man (Isle of)": "Isle of Man",
    "Palestinian Territory Occupied": "Palestine",
    "Saint-Barthelemy": "Saint Barthelemy",
    "Sint Maarten (Dutch part)": "Sint Maarten",
    "Wallis and Futuna Islands": "Wallis and Futuna",
    "The Bahamas": "Bahamas",
    "Virgin Islands (British)": "British Virgin Islands",
    "Curaçao": "Curacao",
    "Fiji Islands": "Fiji",
    "The Gambia": "Gambia",
    "Hong Kong S.A.R.": "Hong Kong",
    "Macau S.A.R.": "Macau",
    "Congo": "Republic of the Congo",
    "Saint-Martin (French part)": "Saint Martin",
    "Svalbard and Jan Mayen Islands": "Svalbard and Jan Mayen",
    "Virgin Islands (US)": "U.S. Virgin Islands",
    "Vatican City State (Holy See)": "Vatican City",
    "Cocos (Keeling) Islands": "Cocos Islands",
}


def seed_countries() -> None:

    db: Session = SessionLocal()

    try:

        countries_file = Path("app/seeds/countries.json")

        if not countries_file.exists():
            raise FileNotFoundError(f"Countries file not found: {countries_file}")

        with open(countries_file, "r", encoding="utf-8") as file:

            countries = json.load(file)

        inserted_count = 0
        skipped_count = 0

        for country in countries:

            country_name = NAME_MAPPING.get(country["name"], country["name"])

            existing_country = (
                db.query(Country)
                .filter(Country.iso_code == country["iso_code"])
                .first()
            )

            if existing_country:
                skipped_count += 1
                continue

            db.add(
                Country(
                    name=country_name,
                    iso_code=country["iso_code"],
                    phone_code=country["phone_code"],
                    default_language="en",
                    is_active=True,
                )
            )

            inserted_count += 1

        db.commit()

        print(f"Countries inserted: {inserted_count}")

        print(f"Countries skipped: {skipped_count}")

        print("Country seeding completed successfully.")

    except Exception as exception:

        db.rollback()

        print(f"Country seeding failed: {exception}")

        raise

    finally:

        db.close()


if __name__ == "__main__":
    seed_countries()
