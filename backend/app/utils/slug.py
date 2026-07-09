import re

from sqlalchemy.orm import Session

from app.models.movie import Movie


def slugify(text: str, db: Session | None = None) -> str:
    base = re.sub(r"[^a-z0-9]+", "-", text.lower()).strip("-") or "movie"
    if db is None:
        return base
    slug, i = base, 2
    while db.query(Movie).filter(Movie.slug == slug).first():
        slug = f"{base}-{i}"
        i += 1
    return slug
