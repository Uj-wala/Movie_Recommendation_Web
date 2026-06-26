from sqlalchemy.orm import Session

from app.models.role_model import Role
from app.models.subject_model import Subject
from app.models.country_model import Country


def get_roles(db: Session):

    roles = (
        db.query(Role)
        .filter(Role.name != "admin") # Admin role should not be available in the dropdown
        .order_by(Role.name)
        .all()
    )
    return [
        {
            "id": role.id,
            "name": role.name
        }
        for role in roles
    ]


def get_subjects(db: Session):

    subjects = (
        db.query(Subject)
        .order_by(Subject.name)
        .all()
    )

    return [
        {
            "id": subject.id,
            "name": subject.name
        }
        for subject in subjects
    ]


def get_countries(db: Session):

    countries = (
        db.query(Country)
        .filter(Country.is_active == True)
        .order_by(Country.name)
        .all()
    )
    return [
        {
            "id": country.id,
            "name": country.name,
            "iso_code": country.iso_code,
            "phone_code": country.phone_code
        }
        for country in countries
    ]
