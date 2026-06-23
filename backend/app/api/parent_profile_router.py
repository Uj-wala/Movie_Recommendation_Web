from fastapi import APIRouter, status

from fastapi import Depends

from sqlalchemy.orm import Session

from app.core.database import get_db

from app.core.dependencies import (
    get_current_user,
    required_role
)

from app.schemas.parent_profile_schema import *

from app.services.parent_profile_service import *
 


router = APIRouter(prefix="/parent-profile", tags=["Parent Profile"])


@router.get(

    "",

    response_model=ParentProfileResponse

)

def get_profile(

    db: Session = Depends(get_db),

    current_user=Depends(

        required_role(["parent", "admin"])

    )

):

    return get_parent_profile(

        current_user,

        db

    )
 


@router.patch(
    "",
    response_model=MessageResponse
)
def update_profile(
    data: UpdateParentProfileRequest,
    db: Session = Depends(get_db),
    current_user=Depends(
        required_role(["parent", "admin"])
    )
):
    return update_parent_profile(
        data,
        current_user,
        db
    )



@router.post(

    "/children",

    response_model=MessageResponse

)

def add_child_route(

    data: AddChildRequest,

    db: Session = Depends(get_db),

    current_user=Depends(

        required_role(["parent", "admin"])

    )

):

    return add_child(

        data,

        current_user,

        db

    )
 
@router.delete(
    "/children/{child_id}",
    response_model=MessageResponse
)
def remove_child_route(
    child_id: str,
    db: Session = Depends(get_db),
    current_user=Depends(
        required_role(["parent", "admin"])
    )
):
    return remove_child(
        child_id,
        current_user,
        db
    )
    

@router.patch(
    "/password",
    response_model=MessageResponse,
)
def update_parent_password(
    password_update: ParentPasswordUpdate,
    db: Session = Depends(get_db),
    current_user=Depends(
        required_role(["parent"])
    ),
):
    return update_parent_password_service(
        db=db,
        current_user=current_user,
        password_update=password_update,
    )   
    

@router.get(
    "/dashboard",
    response_model=ParentDashboardResponse
)
def get_parent_dashboard(
    db: Session = Depends(get_db),
    current_user=Depends(
        required_role(["parent"])
    )
):
    return get_parent_dashboard_service(
        db,
        current_user
    )    