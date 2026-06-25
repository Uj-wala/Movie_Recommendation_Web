from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.dependencies import get_current_user
from app.schemas.user_schema import (
    BlockedAccountResetRequest,
    ForgotPasswordRequest,
    LoginRequest,
    LogoutRequest,
    RefreshTokenRequest,
    TokenResponse,
    VerifyForgotPasswordOtpRequest,
    CreateNewPasswordRequest,
    RefreshTokenResponse
)
from app.services.auth_service import (
    CreateNewPasswordRequest
)
from app.services.auth_service import (
    AuthService,
    create_new_password,
    forgot_password,
    login_user,
    logout_user,
    refresh_tokens,
    reset_blocked_account_password,verify_forgot_password_otp
)

 
router = APIRouter(prefix="/auth", tags=["Auth"])
 
 
@router.post("/login", response_model=TokenResponse)
def login(
    payload: LoginRequest,
    db: Session = Depends(get_db)
):
    return login_user(db, payload)
 
 
@router.post("/refresh", response_model=RefreshTokenResponse)
def refresh(
    payload: RefreshTokenRequest,
    db: Session = Depends(get_db)
):
    return refresh_tokens(db, payload)
 
 
@router.post("/logout")
def logout(
    payload: LogoutRequest,
    db: Session = Depends(get_db)
):
    return logout_user(db, payload)
 
 
@router.post("/forgot-password")
def forgot_password_route(
    payload: ForgotPasswordRequest,
    db: Session = Depends(get_db)
):
    return forgot_password(db, payload)

@router.post("/verify-forgot-password-otp")
def verify_forgot_password_otp_route(
    payload: VerifyForgotPasswordOtpRequest,
    db: Session = Depends(get_db)
):
    return verify_forgot_password_otp(db, payload)


@router.post("/reset-blocked-account-password")
def reset_blocked_account_password_route(
    payload: BlockedAccountResetRequest,
    db: Session = Depends(get_db)
):
    return reset_blocked_account_password(db, payload)
 

@router.post("/create-new-password")
def create_new_password_route(
    request: CreateNewPasswordRequest,
    db: Session = Depends(get_db)
):
    return create_new_password(
        db,
        request
    )
 
@router.get("/me")
def me(current_user=Depends(get_current_user)):
    return current_user
 
 
