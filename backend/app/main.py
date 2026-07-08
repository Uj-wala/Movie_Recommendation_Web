from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.core.database import Base, engine

# Import models so metadata is registered before create_all.
import app.models  # noqa: F401
from app.routers import admin, auth, catalog, library, movies, omdb, profile, reviews
from app.seed import seed

Base.metadata.create_all(bind=engine)

app = FastAPI(title=settings.PROJECT_NAME)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(movies.router)
app.include_router(catalog.router)
app.include_router(reviews.router)
app.include_router(library.router)
app.include_router(profile.router)
app.include_router(admin.router)
app.include_router(omdb.router)

seed()


@app.get("/")
def root():
    return {"message": f"{settings.PROJECT_NAME} API is running"}
