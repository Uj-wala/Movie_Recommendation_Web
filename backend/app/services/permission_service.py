from fastapi import HTTPException
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
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
from app.schemas.permission_schema import CreateUserSchema
from app.models import User
from app.utils.temp_password_generate import generate_temp_password
from app.core.security import pwd_context
from app.utils.send_generated_pasword_mail import send_generated_password_mail
from app.utils.registration_number_util import (
    generate_registration_number,
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
    def create_user_with_permissions(
        db: Session,
        payload: CreateUserSchema
    ):
        try:
            # 1. Check duplicate email
            existing_user = PermissionRepository.get_user_by_email(
                db,
                payload.email
            )
            if existing_user:
                raise HTTPException(
                    status_code=400,
                    detail="Email already exists"
                )

            # 2. Validate role
            role = PermissionRepository.get_role_by_id(
                db,
                payload.role_id
            )
            if not role:
                raise HTTPException(
                    status_code=404,
                    detail="Role not found"
                )

            # 3. Validate permission IDs
            permissions = PermissionRepository.get_permissions_by_ids(
                db,
                payload.permissions
            )

            if len(permissions) != len(set(payload.permissions)):
                raise HTTPException(
                    status_code=400,
                    detail="Invalid permission ids"
                )

            # 4. Generate temp password
            temp_password = generate_temp_password(
                payload.name,
                payload.email
            )
            hashed_password = pwd_context.hash(temp_password)
            registration_number = generate_registration_number(db, role.name)  
            # 5. Create user
            new_user = User(
                full_name=payload.name,
                email=payload.email,
                role_id=payload.role_id,
                password_hash=hashed_password,
                registration_number=registration_number,
                is_active=True
            )

            db.add(new_user)
            db.flush()  

            # 6. Create user permissions
            permission_objects = [
                UserPermission(
                    user_id=new_user.id,
                    permission_id=permission.id,
                    is_granted=True
                )
                for permission in permissions
            ]

            if permission_objects:
                db.add_all(permission_objects)

            email_sent = send_generated_password_mail(
                new_user.email,
                new_user.full_name,
                temp_password,
            )
            if not email_sent:
                raise HTTPException(
                    status_code=502,
                    detail=(
                        "The user was not created because the invitation email "
                        "could not be sent. Please verify the email address and "
                        "try again."
                    ),
                )

            db.commit()
            db.refresh(new_user)

            return {
                "message": "User created successfully",
                "user": {
                    "id": str(new_user.id),
                    "name": new_user.full_name,
                    "email": new_user.email,
                    "role_id": str(new_user.role_id),
                    "role_name": role.name,
                    "is_active": new_user.is_active,
                    "registration_number":new_user.registration_number,
                    "temp_password": temp_password
                }
            }

        except HTTPException:
            db.rollback()
            raise

        except IntegrityError:
            db.rollback()
            raise HTTPException(
                status_code=400,
                detail="Email already exists"
            )

        except Exception as e:
            db.rollback()
            raise HTTPException(
                status_code=500,
                detail=f"Failed to create user: {str(e)}"
            )
    
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
