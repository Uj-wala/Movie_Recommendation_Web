from fastapi import (
    APIRouter,
    Depends
)
from sqlalchemy.orm import Session
from typing import Optional
from fastapi import Query
from app.core.database import (
    get_db
)

from app.schemas.permission_schema import (
    CreateRolePermissionSchema,
    UpdateUserPermissionSchema,
    UpdateUserRoleStatusSchema
)

from app.services.permission_service import (
    PermissionService,
    RolePermissionService
)
from app.core.dependencies import required_role
from app.services.admin_user_service import (
    UserService
)

router = APIRouter(
    prefix="/admin",
    tags=["Admin Manage User"], dependencies=[
        Depends(
            required_role(
                ["admin"]
            )
        )
    ]
)


@router.get("/users")
def get_all_users(

    role_id: Optional[str] = None,

    is_active: Optional[bool] = None,

    search: Optional[str] = Query(
        None,
        description="Search by name/email"
    ),

    db: Session = Depends(
        get_db
    )
):

    return (
        UserService
        .get_all_users(
            db=db,
            role_id=role_id,
            is_active=is_active,
            search=search
        )
    )


@router.get(
    "/users/{user_id}"
)
def get_user_by_id(
    user_id: str,
    db: Session = Depends(
        get_db
    )
):

    return (
        UserService
        .get_user_by_id(
            db,
            user_id
        )
    )

@router.get(
    "/users/{user_id}/permissions"
)
def get_user_permissions(
    user_id: str,
    db: Session = Depends(
        get_db
    )
):

    return (
        PermissionService
        .get_user_permissions(
            db,
            user_id
        )
    )


@router.put(
    "/users/{user_id}/permissions"
)
def update_permissions(
    user_id: str,
    payload:
    UpdateUserPermissionSchema,
    db: Session = Depends(
        get_db
    )
):

    return (
        PermissionService
        .update_permissions(
            db,
            user_id,
            payload
        )
    )


@router.put(
    "/users/{user_id}/change-role-status"
)
def update_user_role_status(
    user_id: str,

    payload:
    UpdateUserRoleStatusSchema,

    db: Session = Depends(
        get_db
    )
):

    return (
        UserService
        .update_user_role_status(
            db,
            user_id,
            payload
        )
    )    

