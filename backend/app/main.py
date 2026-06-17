from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.database import Base, engine
from app.api import auth_routes, auth_login, phone_registration,admin_rbca,admin_manage_user


from app.models.user_model import User
from app.models.otp_verification_model import OTPVerification
from app.models.user_session_model import UserSession
from app.models.student_profile_model import StudentProfile
from app.models.teacher_profile_model import TeacherProfile
from app.models.parent_profile_model import ParentProfile
from app.authotp.otp_router import router as otp_router
from app.api.phone_registration import router as phone_router
from app.api.auth_login import router as auth_login
from app.api.dropdown_router import router as dropdown_router
from app.scripts.seed_roles import seed_roles
from app.scripts.seed_countries import seed_countries
from app.scripts.seed_subjects import seed_subjects
from app.scripts.seed_permissions import seed_permissions

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="AI Powered Education Tutoring App"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

app.include_router(auth_routes.router)
app.include_router(phone_router)
app.include_router(otp_router)
app.include_router(auth_login)
app.include_router(dropdown_router)
app.include_router(admin_rbca.router)
app.include_router(admin_manage_user.router)

seed_countries();   
seed_roles();
seed_subjects();
seed_permissions();

@app.get("/")
def root():
    return {"message": "AI Powered Education Tutoring App is running"}

