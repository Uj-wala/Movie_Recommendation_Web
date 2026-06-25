from sqlalchemy.orm import Session
 
#from app.models.role_model import Role
from app.models.subject_model import Subject
from app.models.country_model import Country
 
TEACHER_SUBJECT_NAMES = [
    "English",
    "Computer Science",
    "Data Analytics",
    "AI Chart Tools",
    "Data Science",
]
 
 
"""def get_roles(db: Session):
 
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
    ]"""
 
 
def get_subjects(db: Session):
 
    subjects = (
        db.query(Subject)
        .filter(Subject.name.in_(TEACHER_SUBJECT_NAMES))
        .all()
    )
    subjects_by_name = {
        subject.name: subject
        for subject in subjects
    }
 
    return [
        {
            "id": subjects_by_name[subject_name].id,
            "name": subjects_by_name[subject_name].name
        }
        for subject_name in TEACHER_SUBJECT_NAMES
        if subject_name in subjects_by_name
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
