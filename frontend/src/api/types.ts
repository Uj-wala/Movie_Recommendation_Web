export interface Genre {
  id: string;
  name: string;
  slug: string;
}

export interface Person {
  id: string;
  name: string;
  photo_url: string | null;
  bio?: string | null;
}

export interface Movie {
  id: string;
  title: string;
  slug: string;
  poster_url: string | null;
  backdrop_url: string | null;
  release_date: string | null;
  rating: number;
  runtime: number | null;
  genres: Genre[];
}

export interface MovieDetail extends Movie {
  overview: string | null;
  trailer_url: string | null;
  language: string;
  popularity: number;
  director: Person | null;
  cast: Person[];
}

export interface Review {
  id: string;
  user_id: string;
  movie_id: string;
  rating: number;
  comment: string | null;
  created_at: string;
  user_name?: string | null;
}

export interface Profile {
  id: string;
  full_name: string;
  username: string | null;
  email: string;
  phone_number: string | null;
  country: string | null;
  date_of_birth: string | null;
  gender: string | null;
  profile_image_url: string | null;
  preferred_language: string;
  email_notifications: boolean;
  is_admin: boolean;
  created_at: string;
  favorite_genres: Genre[];
  favorites_count: number;
  watchlist_count: number;
  reviews_count: number;
}

export interface Notification {
  id: string;
  type: string;
  title: string;
  message: string | null;
  is_read: boolean;
  created_at: string;
}

export interface AdminStats {
  total_users: number;
  total_movies: number;
  total_reviews: number;
  total_favorites: number;
  total_genres: number;
  total_actors: number;
  total_directors: number;
  trending_movies: number;
  most_searched_movie: string | null;
}

export interface AdminUser {
  id: string;
  full_name: string;
  email: string;
  phone_number: string | null;
  country: string | null;
  is_admin: boolean;
  is_active: boolean;
  is_blocked: boolean;
  is_verified: boolean;
  created_at: string;
}

export const GENRE_OPTIONS = [
  "Action", "Comedy", "Sci-Fi", "Adventure", "Crime", "Thriller",
  "Animation", "Fantasy", "Horror", "Romance", "Documentary",
  "Mystery", "Drama", "Family",
];
