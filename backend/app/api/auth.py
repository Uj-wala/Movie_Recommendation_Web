from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
 
from app.core.database import get_db
from app.schemas.user_schema import (
    RegisterRequest,
    UserResponse
)
from app.services.auth_service import AuthService
from app.schemas.user_schema import ResetPasswordRequest
from app.schemas.user_schema import CreateNewPasswordRequest
 
router = APIRouter(
    prefix="/auth",
    tags=["Authentication"]
)
 
 
@router.post(
    "/register",
    response_model=UserResponse
)
def register_user(
    request: RegisterRequest,
    db: Session = Depends(get_db)
):
    return AuthService.register(
        db=db,
        request=request
    )
 
@router.post("/create-new-password")
def create_new_password(
    request: CreateNewPasswordRequest
):
    return {
        "message": "Password validated successfully"
    }
 