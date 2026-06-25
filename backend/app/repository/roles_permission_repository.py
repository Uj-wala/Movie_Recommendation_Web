from sqlalchemy.orm import (
    Session,
    joinedload
)

from app.models import (
    User,
    RolePermission,
    UserPermission,
    Permission,
    Role
)


class PermissionRepository:

    @staticmethod
    def get_user(
        db: Session,
        user_id: str
    ):
        return (
            db.query(User)
            .options(
                joinedload(User.role)
            )
            .filter(
                User.id == user_id
            )
            .first()
        )

    @staticmethod
    def get_role_permissions(
        db: Session,
        role_id: str
    ):
        return (
            db.query(RolePermission)
            .options(
                joinedload(
                    RolePermission.permission
                )
            )
            .filter(
                RolePermission.role_id
                == role_id
            )
            .all()
        )

    @staticmethod
    def get_user_permissions(
        db: Session,
        user_id: str
    ):
        return (
            db.query(UserPermission)
            .options(
                joinedload(
                    UserPermission.permission
                )
            )
            .filter(
                UserPermission.user_id
                == user_id
            )
            .all()
        )

    @staticmethod
    def delete_user_permissions(
        db: Session,
        user_id: str
    ):
        (
            db.query(UserPermission)
            .filter(
                UserPermission.user_id
                == user_id
            )
            .delete()
        )

    @staticmethod
    def bulk_create_permissions(
        db: Session,
        permissions: list
    ):
        db.add_all(permissions)
        db.commit()

    @staticmethod
    def get_all_permissions(    
        db: Session
    ):
        return db.query(
            Permission
        ).all()
    @staticmethod
    def get_user_by_email(db: Session, email: str):
        return db.query(User).filter(User.email == email).first()

    @staticmethod
    def get_role_by_id(db: Session, role_id: str):
        return db.query(Role).filter(Role.id == role_id).first()
    @staticmethod
    def get_permissions_by_ids(
        db: Session,
        permission_ids: list[str]
    ):
        return (
            db.query(Permission)
            .filter(Permission.id.in_(permission_ids))
            .all()
        )
    
class RolePermissionRepository:

    
    @staticmethod
    def delete_role_permissions(
        db: Session,
        role_id: str
    ):

        (
            db.query(RolePermission)
            .filter(
                RolePermission.role_id
                == role_id
            )
            .delete()
        )

    @staticmethod
    def bulk_create(
        db: Session,
        role_permissions: list
    ):

        db.add_all(
            role_permissions
        )

        db.commit()

    @staticmethod
    def get_role_permissions(
        db: Session,
        role_id: str
    ):

        return (
            db.query(RolePermission)
            .filter(
                RolePermission.role_id
                == role_id
            )
            .all()
        )