from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.database import Base, engine

from app.modules.auth.router import router as auth_router
from app.modules.login.router import router as login_router
from app.modules.language.router import router as language_router
from app.modules.home.router import router as home_router

Base.metadata.create_all(bind=engine)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

app.include_router(auth_router)
app.include_router(login_router)
app.include_router(language_router)
app.include_router(home_router)