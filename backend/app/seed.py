"""Idempotent seed data: genres, movies (real TMDB imagery), people, admin user."""
from datetime import date

from sqlalchemy.orm import Session

from app.core.config import settings
from app.core.database import SessionLocal
from app.core.security import hash_password
from app.models.genre import Genre
from app.models.movie import Movie
from app.models.person import Actor, Director
from app.models.user import User
from app.utils.slug import slugify

IMG = "https://image.tmdb.org/t/p/w500"
BACK = "https://image.tmdb.org/t/p/w1280"
YT = "https://www.youtube.com/watch?v="

GENRES = [
    "Action", "Comedy", "Sci-Fi", "Adventure", "Crime", "Thriller",
    "Animation", "Fantasy", "Horror", "Romance", "Documentary",
    "Mystery", "Drama", "Family",
]

# title, poster, backdrop, year, runtime, rating, director, cast[], genres[], trailer_id, flags
MOVIES = [
    ("Inception", "/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg", "/8ZTVqvKDQ8emSGUEMjsS4yHAwrp.jpg", 2010, 148, 8.4,
     "Christopher Nolan", ["Leonardo DiCaprio", "Joseph Gordon-Levitt", "Elliot Page"],
     ["Sci-Fi", "Action", "Thriller"], "YoHD9XEInc0", "trending,popular,top_rated"),
    ("Interstellar", "/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg", "/rAiYTfKGqDCRIIqo664sY9XZIvQ.jpg", 2014, 169, 8.4,
     "Christopher Nolan", ["Matthew McConaughey", "Anne Hathaway", "Jessica Chastain"],
     ["Sci-Fi", "Adventure", "Drama"], "zSWdZVtXT7E", "trending,popular,top_rated"),
    ("The Dark Knight", "/qJ2tW6WMUDux911r6m7haRef0WH.jpg", "/nMKdUUepR0i5zn0y1T4CsSB5chy.jpg", 2008, 152, 8.5,
     "Christopher Nolan", ["Christian Bale", "Heath Ledger", "Aaron Eckhart"],
     ["Action", "Crime", "Drama"], "EXeTwQWrcwY", "trending,top_rated"),
    ("The Matrix", "/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg", "/icmmSD4vTTDKOq2vvdulafOGw93.jpg", 1999, 136, 8.2,
     "Lana Wachowski", ["Keanu Reeves", "Laurence Fishburne", "Carrie-Anne Moss"],
     ["Sci-Fi", "Action"], "vKQi3bBA1y8", "popular,top_rated"),
    ("Fight Club", "/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg", "/hZkgoQYus5vegHoetLkCJzb17zJ.jpg", 1999, 139, 8.4,
     "David Fincher", ["Brad Pitt", "Edward Norton", "Helena Bonham Carter"],
     ["Drama", "Thriller"], "qtRKdVHc-cE", "top_rated"),
    ("Pulp Fiction", "/d5iIlFn5s0ImszYzBPb8JPIfbXD.jpg", "/suaEOtk1N1sgg2MTM7oZd2cfVp3.jpg", 1994, 154, 8.5,
     "Quentin Tarantino", ["John Travolta", "Uma Thurman", "Samuel L. Jackson"],
     ["Crime", "Thriller", "Drama"], "s7EdQ4FqbhY", "popular,top_rated"),
    ("Forrest Gump", "/arw2vcBveWOVZr6pxd9XTd1TdQa.jpg", "/3h1JZGDhZ8nzxdgvkxha0qBqi05.jpg", 1994, 142, 8.5,
     "Robert Zemeckis", ["Tom Hanks", "Robin Wright", "Gary Sinise"],
     ["Drama", "Romance"], "bLvqoHBptjg", "top_rated"),
    ("The Godfather", "/3bhkrj58Vtu7enYsRolD1fZdja1.jpg", "/tmU7GeKVybMWFButWEGl2M4GeiP.jpg", 1972, 175, 8.7,
     "Francis Ford Coppola", ["Marlon Brando", "Al Pacino", "James Caan"],
     ["Crime", "Drama"], "sY1S34973zA", "top_rated"),
    ("The Shawshank Redemption", "/q6y0Go1tsGEsmtFryDOJo3dEmqu.jpg", "/kXfqcdQKsToO0OUXHcrrNCHDBzO.jpg", 1994, 142, 8.7,
     "Frank Darabont", ["Tim Robbins", "Morgan Freeman", "Bob Gunton"],
     ["Drama", "Crime"], "6hB3S9bIaco", "popular,top_rated"),
    ("Avatar", "/jRXYjXNq0Cs2TcJjLkki24MLp7u.jpg", "/Yc9q6QuWrMp9nuDm5R8ExNqbEq.jpg", 2009, 162, 7.6,
     "James Cameron", ["Sam Worthington", "Zoe Saldana", "Sigourney Weaver"],
     ["Sci-Fi", "Adventure", "Fantasy"], "5PSNL1qE6VY", "popular"),
    ("Avengers: Endgame", "/or06FN3Dka5tukK1e9sl16pB3iy.jpg", "/7RyHsO4yDXtBv1zUU3mTpHeQ0d5.jpg", 2019, 181, 8.2,
     "Anthony Russo", ["Robert Downey Jr.", "Chris Evans", "Scarlett Johansson"],
     ["Action", "Adventure", "Sci-Fi"], "TcMBFSGVi1c", "trending,popular"),
    ("Joker", "/udDclJoHjfjb8Ekgsd4FDteOkCU.jpg", "/n6bUvigpRFqSwmPp1m2YADdbRBc.jpg", 2019, 122, 8.1,
     "Todd Phillips", ["Joaquin Phoenix", "Robert De Niro", "Zazie Beetz"],
     ["Crime", "Thriller", "Drama"], "zAGVQLHvwOY", "trending,popular"),
    ("Parasite", "/7IiTTgloJzvGI1TAYymCfbfl3vT.jpg", "/TU9NIjwzjoKPwQHoHshkFcQUCG.jpg", 2019, 133, 8.5,
     "Bong Joon-ho", ["Song Kang-ho", "Lee Sun-kyun", "Cho Yeo-jeong"],
     ["Thriller", "Drama", "Comedy"], "5xH0HfJHsaY", "top_rated,popular"),
    ("Spirited Away", "/39wmItIWsg5sZMyRUHLkWBcuVCM.jpg", "/Ab8mkHmkYADjU7wQiOkia9BzGvS.jpg", 2001, 125, 8.5,
     "Hayao Miyazaki", ["Rumi Hiiragi", "Miyu Irino", "Mari Natsuki"],
     ["Animation", "Fantasy", "Family"], "ByXuk9QqQkk", "top_rated,family"),
    ("The Prestige", "/tRNlZbgNCNOpLpbPEz5L8G8A0JN.jpg", "/8pjWz2lt29KyVGoq1mXYu6Br7dE.jpg", 2006, 130, 8.2,
     "Christopher Nolan", ["Hugh Jackman", "Christian Bale", "Scarlett Johansson"],
     ["Drama", "Mystery", "Thriller"], "RLtaU9jjS5Y", "top_rated"),
    ("Titanic", "/9xjZS2rlVxm8SFx8kPC3aIGCOYQ.jpg", "/yDI6D5ZQh67YU4r2ms8qcSbAviZ.jpg", 1997, 194, 7.9,
     "James Cameron", ["Leonardo DiCaprio", "Kate Winslet", "Billy Zane"],
     ["Romance", "Drama"], "kVrqfYjkTdQ", "popular"),
    ("The Lord of the Rings: The Fellowship of the Ring", "/6oom5QYQ2yQTMJIbnvbkBL9cHo6.jpg", "/vRQnzOn4HjIMX4LBq9nHhFXbsSu.jpg", 2001, 178, 8.4,
     "Peter Jackson", ["Elijah Wood", "Ian McKellen", "Viggo Mortensen"],
     ["Fantasy", "Adventure", "Action"], "V75dMMIW2B4", "popular,top_rated"),
    ("Django Unchained", "/7oWY8VDWW7thTzWh3OKYRkWUlD5.jpg", "/2oZklIzUbvZXXzIFzv7Hi68d6xf.jpg", 2012, 165, 8.2,
     "Quentin Tarantino", ["Jamie Foxx", "Christoph Waltz", "Leonardo DiCaprio"],
     ["Drama", "Action"], "0fUCuvNlOCg", "top_rated"),
    ("Whiplash", "/7fn624j5lj3xTme2SgiLCeuedmO.jpg", "/fRGxZuo7jJUWQsVg9PREb98Aclp.jpg", 2014, 106, 8.4,
     "Damien Chazelle", ["Miles Teller", "J.K. Simmons", "Melissa Benoist"],
     ["Drama", "Mystery"], "7d_jQycdQGo", "top_rated"),
    ("Dune", "/d5NXSklXo0qyIYkgV94XAgMIckC.jpg", "/jYEW5xZkZk2WTrdbMGAPFuBqbDc.jpg", 2021, 155, 7.8,
     "Denis Villeneuve", ["Timothee Chalamet", "Rebecca Ferguson", "Zendaya"],
     ["Sci-Fi", "Adventure"], "8g18jFHCLXk", "trending,now_playing"),
    ("Oppenheimer", "/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg", "/fm6KqXpk3M2HVveHwCrBSSBaO0V.jpg", 2023, 181, 8.1,
     "Christopher Nolan", ["Cillian Murphy", "Emily Blunt", "Matt Damon"],
     ["Drama", "Thriller"], "uYPbbksJxIg", "trending,now_playing,popular"),
    ("Spider-Man: Into the Spider-Verse", "/iiZZdoQBEYBv6id8su7ImL0oCbD.jpg", "/uUiId6cG32JSRI6RyBQSvQtLjz2.jpg", 2018, 117, 8.4,
     "Bob Persichetti", ["Shameik Moore", "Jake Johnson", "Hailee Steinfeld"],
     ["Animation", "Action", "Adventure"], "g4Hbz2jLxvQ", "popular,family"),
    ("The Batman", "/74xTEgt7R36Fpooo50r9T25onhq.jpg", "/b0PlSFdDwbyK0cf5RxwDpaOJQvQ.jpg", 2022, 176, 7.7,
     "Matt Reeves", ["Robert Pattinson", "Zoe Kravitz", "Paul Dano"],
     ["Crime", "Mystery", "Action"], "mqqft2x_Aa4", "trending,now_playing"),
    ("John Wick", "/fZPSd91yGE9fCcCe6OoQr6E3Bev.jpg", "/7dzngS8pLkGJpyeskCFcjPO9qLF.jpg", 2014, 101, 7.4,
     "Chad Stahelski", ["Keanu Reeves", "Michael Nyqvist", "Willem Dafoe"],
     ["Action", "Thriller"], "C0BMx-qxsP4", "popular"),
    ("Nightcrawler", "/j9HrX8f7GbZQm1BrBiR40uFQZSb.jpg", "/qbYgqOczabWNn2XKwgMtVrntD6P.jpg", 2014, 117, 7.8,
     "Dan Gilroy", ["Jake Gyllenhaal", "Rene Russo", "Riz Ahmed"],
     ["Crime", "Thriller", "Drama"], "u1uPHwSeE-o", "upcoming"),
]


def _get_or_create_genres(db: Session) -> dict[str, Genre]:
    existing = {g.name: g for g in db.query(Genre).all()}
    for name in GENRES:
        if name not in existing:
            g = Genre(name=name, slug=slugify(name))
            db.add(g)
            existing[name] = g
    db.commit()
    return {g.name: g for g in db.query(Genre).all()}


def _get_or_create_director(db: Session, cache: dict, name: str) -> Director:
    if name not in cache:
        d = db.query(Director).filter(Director.name == name).first() or Director(name=name)
        db.add(d)
        cache[name] = d
    return cache[name]


def _get_or_create_actor(db: Session, cache: dict, name: str) -> Actor:
    if name not in cache:
        a = db.query(Actor).filter(Actor.name == name).first() or Actor(name=name)
        db.add(a)
        cache[name] = a
    return cache[name]


def seed() -> None:
    db: Session = SessionLocal()
    try:
        genres = _get_or_create_genres(db)
        director_cache: dict[str, Director] = {}
        actor_cache: dict[str, Actor] = {}

        if db.query(Movie).count() == 0:
            for (title, poster, backdrop, year, runtime, rating, director_name,
                 cast, genre_names, trailer, flags) in MOVIES:
                director = _get_or_create_director(db, director_cache, director_name)
                movie = Movie(
                    title=title,
                    slug=slugify(title),
                    overview=f"{title} ({year}) — a landmark film directed by {director_name}.",
                    poster_url=IMG + poster,
                    backdrop_url=BACK + backdrop,
                    trailer_url=YT + trailer,
                    release_date=date(year, 1, 1),
                    runtime=runtime,
                    rating=rating,
                    popularity=rating * 10,
                    director=director,
                    genres=[genres[g] for g in genre_names if g in genres],
                    cast=[_get_or_create_actor(db, actor_cache, n) for n in cast],
                    is_trending="trending" in flags,
                    is_popular="popular" in flags,
                    is_top_rated="top_rated" in flags,
                    is_upcoming="upcoming" in flags,
                    is_now_playing="now_playing" in flags,
                )
                db.add(movie)
            db.commit()

        _seed_admin(db)
    finally:
        db.close()


def _seed_admin(db: Session) -> None:
    email = (settings.ADMIN_EMAIL or "admin@movieverse.ai").lower()
    if db.query(User).filter(User.email == email).first():
        return
    admin = User(
        full_name=settings.ADMIN_FULL_NAME or "MovieVerse Admin",
        username="admin",
        email=email,
        phone_number=settings.ADMIN_PHONE_NUMBER or "+10000000000",
        country="United States",
        password_hash=hash_password(settings.ADMIN_PASSWORD or "Admin@123"),
        is_admin=True,
        is_verified=True,
    )
    db.add(admin)
    db.commit()
