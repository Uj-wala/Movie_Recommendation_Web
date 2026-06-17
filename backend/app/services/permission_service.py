from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.models import (
    UserPermission,
    Role,
    Permission,
    RolePermission
)

from app.repository.roles_permission_repository import (
    PermissionRepository,
    RolePermissionRepository
)


class PermissionService:

    @staticmethod
    def get_user_permissions(
        db: Session,
        user_id: str
    ):

        user = (
            PermissionRepository
            .get_user(
                db,
                user_id
            )
        )

        if not user:
            raise HTTPException(
                status_code=404,
                detail="User not found"
            )

        role_permissions = (
            PermissionRepository
            .get_role_permissions(
                db,
                user.role_id
            )
        )

        user_permissions = (
            PermissionRepository
            .get_user_permissions(
                db,
                user_id
            )
        )

        default_permissions = [
            {
                "permission_id":
                rp.permission.id,
                "name":
                rp.permission.name
            }
            for rp in role_permissions
        ]

        granted_permissions = [
            {
                "permission_id":
                up.permission.id,
                "name":
                up.permission.name
            }
            for up in user_permissions
            if up.is_granted
        ]

        revoked_permissions = [
            {
                "permission_id":
                up.permission.id,
                "name":
                up.permission.name
            }
            for up in user_permissions
            if not up.is_granted
        ]

        return {
            "user_id":
            user.id,

            "role_name":
            user.role.name,

            "default_permissions":
            default_permissions,

            "granted_permissions":
            granted_permissions,

            "revoked_permissions":
            revoked_permissions
        }

    @staticmethod
    def update_permissions(
        db: Session,
        user_id: str,
        payload
    ):

        user = (
            PermissionRepository
            .get_user(
                db,
                user_id
            )
        )

        if not user:
            raise HTTPException(
                status_code=404,
                detail="User not found"
            )

        PermissionRepository\
            .delete_user_permissions(
                db,
                user_id
            )

        permission_objects = []

        # Granted permissions
        for permission_id in (
            payload.granted_permission_ids
        ):

            permission_objects.append(
                UserPermission(
                    user_id=user_id,
                    permission_id=
                    permission_id,
                    is_granted=True
                )
            )

        # Revoked permissions
        for permission_id in (
            payload.revoked_permission_ids
        ):

            permission_objects.append(
                UserPermission(
                    user_id=user_id,
                    permission_id=
                    permission_id,
                    is_granted=False
                )
            )

        PermissionRepository\
            .bulk_create_permissions(
                db,
                permission_objects
            )

        return {
            "message":
            "Permissions updated successfully"
        }

    @staticmethod
    def clear_user_permissions(
        db: Session,
        user_id: str
    ):

        user = (
            PermissionRepository
            .get_user(
                db,
                user_id
            )
        )

        if not user:
            raise HTTPException(
                status_code=404,
                detail="User not found"
            )

        PermissionRepository\
            .delete_user_permissions(
                db,
                user_id
            )

        db.commit()

        return {
            "message":
            "User permission overrides cleared"
        }


class RolePermissionService:

    @staticmethod
    def get_all_roles(
        db: Session
    ):

        roles = db.query(
            Role
        ).all()

        return [
            {
                "id":
                role.id,

                "name":
                role.name,

                "description":
                role.description
            }
            for role in roles
        ]

    @staticmethod
    def get_role_by_id(
        db: Session,
        role_id: str
    ):

        role = (
            db.query(Role)
            .filter(
                Role.id == role_id
            )
            .first()
        )

        if not role:
            raise HTTPException(
                status_code=404,
                detail="Role not found"
            )

        return {
            "id":
            role.id,

            "name":
            role.name,

            "description":
            role.description
        }

    @staticmethod
    def get_all_permissions(
        db: Session
    ):

        permissions = db.query(
            Permission
        ).all()

        return [
            {
                "id":
                permission.id,

                "name":
                permission.name,

                "description":
                permission.description
            }
            for permission in permissions
        ]

    @staticmethod
    def get_role_permissions(
        db: Session,
        role_id: str
    ):

        role = (
            db.query(Role)
            .filter(
                Role.id == role_id
            )
            .first()
        )

        if not role:
            raise HTTPException(
                status_code=404,
                detail="Role not found"
            )

        role_permissions = (
            db.query(RolePermission)
            .filter(
                RolePermission.role_id
                == role_id
            )
            .all()
        )

        permission_ids = [
            rp.permission_id
            for rp in role_permissions
        ]

        permissions = (
            db.query(Permission)
            .filter(
                Permission.id.in_(
                    permission_ids
                )
            )
            .all()
        )

        return {
            "role_id":
            role.id,

            "role_name":
            role.name,

            "permissions": [
                {
                    "id":
                    permission.id,

                    "name":
                    permission.name
                }
                for permission
                in permissions
            ]
        }

    @staticmethod
    def create_role_permissions(
        db: Session,
        payload
    ):

        role = (
            db.query(Role)
            .filter(
                Role.id
                == payload.role_id
            )
            .first()
        )

        if not role:
            raise HTTPException(
                status_code=404,
                detail="Role not found"
            )

        permissions = (
            db.query(Permission)
            .filter(
                Permission.id.in_(
                    payload.permission_ids
                )
            )
            .all()
        )

        if len(permissions) != len(
            payload.permission_ids
        ):
            raise HTTPException(
                status_code=400,
                detail=
                "Invalid permission ids"
            )

        RolePermissionRepository\
            .delete_role_permissions(
                db,
                payload.role_id
            )

        role_permissions = []

        for permission_id in (
            payload.permission_ids
        ):

            role_permissions.append(
                RolePermission(
                    role_id=
                    payload.role_id,
                    permission_id=
                    permission_id
                )
            )

        RolePermissionRepository\
            .bulk_create(
                db,
                role_permissions
            )

        return {
            "message":
            "Role permissions updated successfully"
        }

    @staticmethod
    def delete_role_permission(
        db: Session,
        role_id: str,
        permission_id: str
    ):

        role_permission = (
            db.query(RolePermission)
            .filter(
                RolePermission.role_id
                == role_id,

                RolePermission.permission_id
                == permission_id
            )
            .first()
        )

        if not role_permission:
            raise HTTPException(
                status_code=404,
                detail=
                "Role permission not found"
            )

        db.delete(role_permission)
        db.commit()

        return {
            "message":
            "Role permission deleted successfully"
        }