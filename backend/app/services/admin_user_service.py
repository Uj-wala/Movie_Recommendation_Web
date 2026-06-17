from fastapi import HTTPException
from sqlalchemy.orm import Session, joinedload
from sqlalchemy import or_
from app.models.user_model import User
from app.models.role_model import Role


class UserService:

    @staticmethod
    def update_user_role_status(
        db: Session,
        user_id: str,
        payload
    ):

        user = (
            db.query(User)
            .filter(
                User.id == user_id
            )
            .first()
        )

        if not user:
            raise HTTPException(
                status_code=404,
                detail="User not found"
            )

        # -------------------------
        # Update Role
        # -------------------------

        if payload.role_id:

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

            user.role_id = (
                payload.role_id
            )

        # -------------------------
        # Update Status
        # -------------------------

        if payload.is_active is not None:

            user.is_active = (
                payload.is_active
            )

        db.commit()
        db.refresh(user)

        return {
            "message":
            "User updated successfully",
            "data": {
                "user_id":
                user.id,
                "role_id":
                user.role_id,
                "is_active":
                user.is_active
            }
        }
    
    @staticmethod
    def get_all_users(
        db: Session,
        role_id: str = None,
        is_active: bool = None,
        search: str = None
    ):

        query = (
            db.query(User)
            .filter(User.email != "admin@aipeta.com")
            .options(
                joinedload(User.role)
            )
        )

        # -------------------------
        # Filter by Role
        # -------------------------

        if role_id:
            query = query.filter(
                User.role_id == role_id
            )

        # -------------------------
        # Filter by Active Status
        # -------------------------

        if is_active is not None:
            query = query.filter(
                User.is_active == is_active
            )

        # -------------------------
        # Search
        # -------------------------

        if search:

            search_term = (
                f"%{search.strip()}%"
            )

            query = query.filter(
                or_(
                    User.full_name.ilike(
                        search_term
                    ),
                    User.email.ilike(
                        search_term
                    )
                )
            )

        users = query.all()

        response = []

        for user in users:

            response.append({
                "id":
                user.id,

                "full_name":
                user.full_name,

                "email":
                user.email,

                "role_id":
                user.role_id,

                "role_name":
                (
                    user.role.name
                    if user.role
                    else None
                ),

                "is_active":
                user.is_active
            })

        return response
        
    @staticmethod
    def get_user_by_id(
        db: Session,
        user_id: str
    ):

        user = (
            db.query(User)
            .options(
                joinedload(User.role)
            )
            .filter(
                User.id == user_id
            )
            .first()
        )

        if not user:
            raise HTTPException(
                status_code=404,
                detail=
                "User not found"
            )

        return {
            "id":
            user.id,

            "full_name":
            getattr(
                user,
                "full_name",
                None
            ),

            "email":
            user.email,

            "role_id":
            user.role_id,

            "role_name":
            (
                user.role.name
                if user.role
                else None
            ),

            "is_active":
            user.is_active
        }