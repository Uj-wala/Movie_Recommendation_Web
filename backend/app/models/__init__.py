from app.models.associations import movie_actors, movie_genres, user_genres
from app.models.favorite import Favorite, Watchlist
from app.models.genre import Genre
from app.models.movie import Movie
from app.models.notification import Notification
from app.models.omdb_review import OmdbReview
from app.models.otp import OTPVerification
from app.models.person import Actor, Director
from app.models.review import Review
from app.models.search_history import SearchHistory
from app.models.user import User

__all__ = [
    "User",
    "Movie",
    "Genre",
    "Actor",
    "Director",
    "Review",
    "OmdbReview",
    "SearchHistory",
    "Favorite",
    "Watchlist",
    "Notification",
    "OTPVerification",
    "movie_genres",
    "movie_actors",
    "user_genres",
]
