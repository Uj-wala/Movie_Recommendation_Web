from fastapi import APIRouter, Depends, HTTPException
from starlette import status
from sqlalchemy.orm import Session
from app.schemas.user_schema import RegisterRequest
from app.models.user_model import User
from app.core.security import hash_password, hash_security_answer
from app.models.role_model import Role

class EmailRegister:
    def register_email(self,data:RegisterRequest,db:Session):
        try:
            existing_user = db.query(User).filter(User.email==data.email).first()
            if existing_user:
                raise HTTPException(status_code=status.HTTP_409_CONFLICT,detail="you already registered with this email")
            
            user = User(
                full_name=data.full_name,
                email=data.email,
                phone_number=data.phone_number,
                country_id=data.country_id,
                password_hash=hash_password(data.password),
                security_question=data.security_question,
                security_answer_hash=hash_security_answer(data.security_answer),
                agree_to_terms=data.agree_to_terms
            )
            db.add(user)
            db.commit()
            db.refresh(user)
            return user
        except Exception:
            db.rollback()
            raise