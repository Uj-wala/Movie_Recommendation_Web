from fastapi import APIRouter, Depends, HTTPException
from starlette import status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.schemas.user_schema import RegisterRequest, UserRegisterResponse,UserResponse
from app.models.user_model import User
from app.core.security import hash_password
from app.services.email_register import EmailRegister

router=APIRouter(prefix="/auth", tags=["auth"])
register_service=EmailRegister()

@router.post("/register",status_code=status.HTTP_201_CREATED , summary="Email Register" ,response_model=UserRegisterResponse)
def register_user(data:RegisterRequest ,db:Session=Depends(get_db)):
    user = register_service.register_email(data,db)
    return UserRegisterResponse(data=UserResponse.model_validate(user),message="User registered successfully")
 