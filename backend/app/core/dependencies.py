from collections.abc import Callable

from fastapi import Depends, HTTPException, status
from fastapi.security import (
    HTTPAuthorizationCredentials,
    HTTPBearer,
)
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.jwt_handler import decode_token
from app.models.user_model import User
from app.repository.user_repository import get_user_by_id
from app.services.permission_service import (
    PermissionService
)
 
bearer_scheme = HTTPBearer()


def get_database():
    """Compatibility dependency. Prefer using get_db directly."""
    yield from get_db()


def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(bearer_scheme),
    db: Session = Depends(get_db),
) -> User:
    try:
        payload = decode_token(credentials.credentials)
    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token",
        ) from exc

    if not payload or payload.get("type") != "access":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token type",
        )

    user_id = payload.get("sub")

    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token payload",
        )

    user = get_user_by_id(db, user_id)

    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found",
        )

    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="User is inactive",
        )

    if user.is_blocked:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="User is blocked",
        )

    return user


def get_current_role_name(current_user: User) -> str:
    if current_user.role is None:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="User role not assigned",
        )

    return current_user.role.name.strip().lower()


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


def get_current_active_student(
    current_user: User = Depends(get_current_user),
) -> User:
    """
    Allow only active, non-blocked users with the student role.
    Active and blocked checks are already handled by get_current_user().
    """
    current_role = get_current_role_name(current_user)

    if current_role != "student":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Student access required",
        )

    return current_user


def get_current_active_teacher(
    current_user: User = Depends(get_current_user),
) -> User:
    """
    Allow only active, non-blocked users with the teacher role.
    Active and blocked checks are already handled by get_current_user().
    """
    current_role = get_current_role_name(current_user)

    if current_role != "teacher":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Teacher access required",
        )

    return current_user