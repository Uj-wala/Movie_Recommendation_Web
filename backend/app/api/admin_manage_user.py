from fastapi import (
    APIRouter,
    Depends
)
from sqlalchemy.orm import Session
from typing import Optional,List
from fastapi import Query
from app.core.database import (
    get_db
)

from app.schemas.permission_schema import (
    CreateRolePermissionSchema,
    CreateUserSchema,
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
def get_users(
    role_ids: Optional[List[str]] = Query(None, alias="role_ids[]"),
    is_active: Optional[bool] = Query(None),
    search: Optional[str] = Query(None),
    db: Session = Depends(get_db)
):
    return UserService.get_all_users(
        db=db,
        role_ids=role_ids,
        is_active=is_active,
        search=search
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


@router.post("/users-create/")
def create_user(
    payload: CreateUserSchema,
    db: Session = Depends(get_db)
):
    return PermissionService.create_user_with_permissions(db, payload)


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

