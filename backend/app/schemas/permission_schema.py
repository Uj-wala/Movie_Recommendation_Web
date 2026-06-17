from pydantic import BaseModel, Field
from typing import List, Optional


class PermissionItem(BaseModel):
    permission_id: str
    name: str


class UserPermissionResponse(BaseModel):
    user_id: str
    role_name: str

    default_permissions: List[
        PermissionItem
    ]

    granted_permissions: List[
        PermissionItem
    ]

    revoked_permissions: List[
        PermissionItem
    ]


class UpdateUserPermissionSchema(
    BaseModel
):
    granted_permission_ids: List[str] = Field(
        default_factory=list
    )

    revoked_permission_ids: List[str] = Field(
        default_factory=list
    )
class CreateRolePermissionSchema(
    BaseModel
):
    role_id: str
    permission_ids: List[str]
    

class UpdateUserRoleStatusSchema(
    BaseModel
):
    role_id: Optional[str] = None
    is_active: Optional[bool] = None
    
class UserBasicResponse(
    BaseModel
):
    id: str
    full_name: str
    email: str
    role_id: Optional[str]
    role_name: Optional[str]
    is_active: bool

    class Config:
        from_attributes = True

