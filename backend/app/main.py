import json

from fastapi import FastAPI, Request
from fastapi.encoders import jsonable_encoder
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, Response
from starlette.exceptions import HTTPException as StarletteHTTPException

from app.core.config import settings
from app.core.database import Base, engine
from app.utils.response import failure

# Import models so metadata is registered before create_all.
import app.models  # noqa: F401
from app.routers import (
    admin,
    auth,
    catalog,
    dashboard,
    history,
    library,
    movies,
    omdb,
    omdb_reviews,
    profile,
    recently_viewed,
    recommendations,
    reviews,
)
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
app.include_router(history.router)
app.include_router(omdb_reviews.router)
app.include_router(dashboard.router)
app.include_router(recently_viewed.router)
app.include_router(recommendations.router)

seed()

# Paths whose JSON must NOT be wrapped (Swagger/OpenAPI would break otherwise).
_ENVELOPE_EXEMPT = ("/openapi.json", "/docs", "/redoc")


@app.middleware("http")
async def standardize_success_response(request: Request, call_next):
    """Wrap successful JSON responses in {success, message, data}.

    Errors are handled by the exception handlers below, so this only touches
    2xx/3xx JSON. ponytail: rebuilds the JSON response but preserves headers
    (CORS etc.); fine for our JSON-only API — revisit if we ever stream files.
    """
    response = await call_next(request)
    content_type = response.headers.get("content-type", "")
    if (
        response.status_code < 400
        and content_type.startswith("application/json")
        and not any(request.url.path.startswith(p) for p in _ENVELOPE_EXEMPT)
    ):
        body = b"".join([chunk async for chunk in response.body_iterator])
        try:
            payload = json.loads(body) if body else None
        except ValueError:
            return Response(body, response.status_code, dict(response.headers), content_type)
        # Don't double-wrap anything already in envelope form.
        wrapped = payload if isinstance(payload, dict) and "success" in payload else {
            "success": True,
            "message": "OK",
            "data": payload,
        }
        new = JSONResponse(content=wrapped, status_code=response.status_code)
        for key, value in response.headers.items():
            if key.lower() not in ("content-length", "content-type"):
                new.headers[key] = value
        return new
    return response


@app.exception_handler(StarletteHTTPException)
async def http_exception_handler(request: Request, exc: StarletteHTTPException):
    return JSONResponse(status_code=exc.status_code, content=failure(str(exc.detail)))


@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    return JSONResponse(
        status_code=422,
        content=failure("Validation error", errors=jsonable_encoder(exc.errors())),
    )


@app.exception_handler(Exception)
async def unhandled_exception_handler(request: Request, exc: Exception):
    # ponytail: consistent 500 envelope per spec; note it also hides tracebacks.
    return JSONResponse(status_code=500, content=failure("Internal server error"))


@app.get("/")
def root():
    return {"message": f"{settings.PROJECT_NAME} API is running"}
