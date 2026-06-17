from app.core.database import get_db



from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlalchemy.orm import Session
 
from app.core.database import get_db
from app.core.jwt_handler import decode_token
from app.repository.user_repository import get_user_by_id
from app.services.permission_service import (
    PermissionService
)
 
bearer_scheme = HTTPBearer()
 
 
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.jwt_handler import decode_token
from app.repository.user_repository import get_user_by_id


bearer_scheme = HTTPBearer()

def get_database():
    yield from get_db()


def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(bearer_scheme),
    db: Session = Depends(get_db)
):
    payload = decode_token(credentials.credentials)
 

    if payload.get("type") != "access":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token type"
        )
 
    user_id = payload.get("sub")
 

    user_id = payload.get("sub")

    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token payload"
        )
 
    user = get_user_by_id(db, user_id)
 

    user = get_user_by_id(db, user_id)

    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found"
        )
 

    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="User is inactive"
        )
 

    if user.is_blocked:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="User is blocked"
        )
 
    return user
 


def required_role(
    allowed_roles: list[str]
):

    def role_checker(
        current_user=Depends(
            get_current_user
        )
    ):

        user_role = (
            current_user.role.name
            .lower()
        )

        allowed_roles_lower = [
            role.lower()
            for role in allowed_roles
        ]

        if (
            user_role
            not in allowed_roles_lower
        ):

            raise HTTPException(
                status_code=
                status.HTTP_403_FORBIDDEN,
                detail=
                "Access denied"
            )

        return current_user

    return role_checker
 

def has_permission(
    permission_name: str
):

    def checker(
        current_user=Depends(
            get_current_user
        ),
        db=Depends(get_db)
    ):

        permissions = (
            PermissionService
            .get_user_permissions(
                db,
                current_user.id
            )
        )

        all_permissions = {
            p["name"]
            for p in (
                permissions[
                    "default_permissions"
                ]
                +
                permissions[
                    "granted_permissions"
                ]
            )
        }

        revoked = {
            p["name"]
            for p in (
                permissions[
                    "revoked_permissions"
                ]
            )
        }

        final_permissions = (
            all_permissions
            - revoked
        )

        if permission_name \
            not in final_permissions:

            raise HTTPException(
                status_code=403,
                detail=
                "Permission denied"
            )

        return current_user

    return checker