from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.database import Base, engine
from app.api import auth_routes


from app.models.user_model import User
from app.models.otp_verification_model import OTPVerification
from app.models.user_session_model import UserSession
from app.models.student_profile_model import StudentProfile
from app.models.teacher_profile_model import TeacherProfile
from app.models.parent_profile_model import ParentProfile
from app.authotp.otp_router import router as otp_router
from app.api.phone_registration import router as phone_router

from app.api.auth_login import router as login_router

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="AI Powered Education Tutoring App",
    version="1.0.0"
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
@app.get("/")
def root():
    return {"message": "AI Powered Education Tutoring App is running"}

app.include_router(login_router)

