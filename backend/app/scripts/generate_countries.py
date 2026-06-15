import json

from countrystatecity_countries import get_countries

countries = get_countries()

print(f"Found {len(countries)} countries")

output = []

for country in countries:

    output.append(
        {
            "name": country.name,
            "iso_code": country.iso2,
            "phone_code": f"+{country.phone_code}",
        }
    )

with open("app/seeds/countries.json", "w", encoding="utf-8") as file:

    json.dump(output, file, indent=4, ensure_ascii=False)

print(f"Generated {len(output)} countries")
