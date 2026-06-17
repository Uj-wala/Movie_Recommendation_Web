from fastapi import (
    APIRouter,
    Depends
)
from sqlalchemy.orm import Session

from app.core.database import (
    get_db
)

from app.schemas.permission_schema import (
    CreateRolePermissionSchema
)
from app.core.dependencies import required_role
from app.services.permission_service import (
    RolePermissionService
)

router = APIRouter(
    prefix="/admin",
    tags=["RBAC"],
     dependencies=[
        Depends(
            required_role(
                ["admin"]
            )
        )
    ]
)


# ==================================================
# ROLES
# ==================================================

@router.get("/roles")
def get_all_roles(
    db: Session = Depends(
        get_db
    )
):
    return (
        RolePermissionService
        .get_all_roles(db)
    )


# @router.get(
#     "/roles/{role_id}"
# )
# def get_role_by_id(
#     role_id: str,
#     db: Session = Depends(
#         get_db
#     )
# ):
#     return (
#         RolePermissionService
#         .get_role_by_id(
#             db,
#             role_id
#         )
#     )


# ==================================================
# PERMISSIONS
# ==================================================

@router.get("/permissions")
def get_all_permissions(
    db: Session = Depends(
        get_db
    )
):
    return (
        RolePermissionService
        .get_all_permissions(
            db
        )
    )


@router.get(
    "/roles/{role_id}/permissions"
)
def get_role_permissions(
    role_id: str,
    db: Session = Depends(
        get_db
    )
):
    return (
        RolePermissionService
        .get_role_permissions(
            db,
            role_id
        )
    )


# ==================================================
# ROLE PERMISSIONS
# ==================================================

@router.post(
    "/role-permissions"
)
def create_role_permissions(
    payload:
    CreateRolePermissionSchema,

    db: Session = Depends(
        get_db
    )
):
    return (
        RolePermissionService
        .create_role_permissions(
            db,
            payload
        )
    )


@router.put(
    "/role-permissions"
)
def update_role_permissions(
    payload:
    CreateRolePermissionSchema,

    db: Session = Depends(
        get_db
    )
):
    return (
        RolePermissionService
        .create_role_permissions(
            db,
            payload
        )
    )


# @router.delete(
#     "/roles/{role_id}/permissions/{permission_id}"
# )
# def delete_role_permission(
#     role_id: str,
#     permission_id: str,

#     db: Session = Depends(
#         get_db
#     )
# ):
#     return (
#         RolePermissionService
#         .delete_role_permission(
#             db,
#             role_id,
#             permission_id
#         )
#     )