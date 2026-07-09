from sqlalchemy import create_engine, MetaData, text
from sqlalchemy.engine import make_url
from sqlalchemy.orm import sessionmaker, declarative_base
from app.core.config import settings


convention = {
    "ix": "ix_%(column_0_label)s",
    "uq": "uq_%(table_name)s_%(column_0_name)s",
    "ck": "ck_%(table_name)s_%(constraint_name)s",
    "fk": "fk_%(table_name)s_%(column_0_name)s",
    "pk": "pk_%(table_name)s"
}

metadata = MetaData(naming_convention=convention)

Base = declarative_base(metadata=metadata)


def _ensure_mysql_database(database_url: str) -> None:
    url = make_url(database_url)
    if url.get_backend_name() != "mysql" or not url.database:
        return

    database_name = url.database
    if not database_name.replace("_", "").isalnum():
        raise ValueError(f"Unsafe MySQL database name: {database_name}")

    server_url = url.set(database="")
    server_engine = create_engine(
        server_url,
        pool_pre_ping=True,
        future=True,
        isolation_level="AUTOCOMMIT",
    )
    try:
        with server_engine.connect() as connection:
            connection.execute(
                text(
                    f"CREATE DATABASE IF NOT EXISTS `{database_name}` "
                    "CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci"
                )
            )
    finally:
        server_engine.dispose()


_ensure_mysql_database(settings.DATABASE_URL)

engine = create_engine(
    settings.DATABASE_URL,
    pool_pre_ping=True,
    future=True,
    # SQLite needs check_same_thread disabled for FastAPI's threaded requests.
    connect_args=(
        {"check_same_thread": False}
        if settings.DATABASE_URL.startswith("sqlite")
        else {}
    ),
)

SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)


def get_db():
    db = SessionLocal()

    try:
        yield db

    finally:
        db.close()


def ensure_collection_schema() -> None:
    """Keep early local collection tables compatible with internal movie UUIDs.

    SQLAlchemy create_all creates missing tables, but it does not widen an existing
    column. The first collection version stored only short IMDb IDs, while the app
    now also saves internal movie UUIDs from /movie/:slug pages.
    """
    url = make_url(settings.DATABASE_URL)
    if url.get_backend_name() != "mysql":
        return

    with engine.begin() as connection:
        connection.execute(
            text("ALTER TABLE collection_movies MODIFY movie_id VARCHAR(64) NOT NULL")
        )
