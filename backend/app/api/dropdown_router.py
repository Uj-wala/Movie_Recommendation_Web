from typing import List

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.database import get_db

from app.schemas.dropdown_schema import (
    DropdownResponse,
    CountryDropdownResponse
)

from app.services.dropdown_service import (
    get_roles,
    get_subjects,
    get_countries
)

router = APIRouter(
    prefix="/dropdowns",
    tags=["Dropdowns"]
)


@router.get(
    "/roles",
    response_model=List[DropdownResponse]
)
def get_roles_dropdown(
    db: Session = Depends(get_db)
):
    return get_roles(db)


@router.get(
    "/subjects",
    response_model=List[DropdownResponse]
)
def get_subjects_dropdown(
    db: Session = Depends(get_db)
):
    return get_subjects(db)


@router.get(
    "/countries",
    response_model=List[CountryDropdownResponse]
)
def get_countries_dropdown(
    db: Session = Depends(get_db)
):
    return get_countries(db)