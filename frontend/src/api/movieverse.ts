import api from "./axios";
import type {
  AdminStats,
  AdminUser,
  Genre,
  Movie,
  MovieDetail,
  Notification,
  Person,
  Preference,
  Profile,
  Review,
} from "./types";

// ── Auth ──────────────────────────────────────────────────────────────
export interface RegisterPayload {
  full_name: string;
  email: string;
  phone_number: string;
  date_of_birth: string;
  gender: string;
  country: string;
  password: string;
  confirm_password: string;
  favorite_genres: string[];
}

export const authApi = {
  register: (data: RegisterPayload) => api.post("/auth/register", data),
  login: (email: string, password: string) =>
    api.post("/auth/login", { email, password }),
  sendEmailOtp: (email: string) => api.post("/auth/send-email-otp", { email }),
  sendPhoneOtp: (phone_number: string) => api.post("/auth/send-phone-otp", { phone_number }),
  verifyEmailOtp: (email: string, otp: string) =>
    api.post("/auth/verify-email-otp", { email, otp }),
  verifyPhoneOtp: (phone_number: string, otp: string) =>
    api.post("/auth/verify-phone-otp", { phone_number, otp }),
  forgotPassword: (email: string) => api.post("/auth/forgot-password", { email }),
  resetPassword: (email: string, otp: string, new_password: string, confirm_password: string) =>
    api.post("/auth/reset-password", { email, otp, new_password, confirm_password }),
  changePassword: (current_password: string, new_password: string, confirm_password: string) =>
    api.post("/auth/change-password", { current_password, new_password, confirm_password }),
  verifyChangePassword: (otp: string, new_password: string, confirm_password: string) =>
    api.post("/auth/change-password/verify", { otp, new_password, confirm_password }),
};

// ── Movies ────────────────────────────────────────────────────────────
export const moviesApi = {
  list: (params?: Record<string, unknown>) =>
    api.get<Movie[]>("/movies", { params }).then((r) => r.data),
  trending: () => api.get<Movie[]>("/movies/trending").then((r) => r.data),
  popular: () => api.get<Movie[]>("/movies/popular").then((r) => r.data),
  topRated: () => api.get<Movie[]>("/movies/top-rated").then((r) => r.data),
  upcoming: () => api.get<Movie[]>("/movies/upcoming").then((r) => r.data),
  nowPlaying: () => api.get<Movie[]>("/movies/now-playing").then((r) => r.data),
  recommended: () => api.get<Movie[]>("/movies/recommended").then((r) => r.data),
  detail: (idOrSlug: string) => api.get<MovieDetail>(`/movies/${idOrSlug}`).then((r) => r.data),
  related: (idOrSlug: string) =>
    api.get<Movie[]>(`/movies/${idOrSlug}/related`).then((r) => r.data),
};

// ── Catalog ───────────────────────────────────────────────────────────
export const catalogApi = {
  genres: () => api.get<Genre[]>("/genres").then((r) => r.data),
  actors: (search?: string) =>
    api.get<Person[]>("/actors", { params: { search } }).then((r) => r.data),
  directors: (search?: string) =>
    api.get<Person[]>("/directors", { params: { search } }).then((r) => r.data),
  search: (q: string) => api.get("/search", { params: { q } }).then((r) => r.data),
};

// ── Reviews ───────────────────────────────────────────────────────────
export const reviewsApi = {
  mine: () => api.get<Review[]>("/reviews/mine").then((r) => r.data),
  forMovie: (movieId: string) =>
    api.get<Review[]>(`/reviews/movie/${movieId}`).then((r) => r.data),
  create: (movie_id: string, rating: number, comment: string) =>
    api.post<Review>("/reviews", { movie_id, rating, comment }).then((r) => r.data),
  update: (id: string, rating: number, comment: string) =>
    api.put<Review>(`/reviews/${id}`, { rating, comment }).then((r) => r.data),
  remove: (id: string) => api.delete(`/reviews/${id}`),
};

// ── Library ───────────────────────────────────────────────────────────
export const libraryApi = {
  favorites: () => api.get<Movie[]>("/favorites").then((r) => r.data),
  addFavorite: (movieId: string) => api.post(`/favorites/${movieId}`),
  removeFavorite: (movieId: string) => api.delete(`/favorites/${movieId}`),
  watchlist: () => api.get<Movie[]>("/watchlist").then((r) => r.data),
  addWatchlist: (movieId: string) => api.post(`/watchlist/${movieId}`),
  removeWatchlist: (movieId: string) => api.delete(`/watchlist/${movieId}`),
};

// ── OMDb (proxied through the backend; key stays server-side) ──────────
export interface OmdbSearchItem {
  imdbID: string;
  Title: string;
  Year: string;
  Poster: string;
  Type: string;
}

export interface OmdbSearchResponse {
  results: OmdbSearchItem[];
  total: number;
  page: number;
  total_pages: number;
}

/** Full OMDb record. All fields are strings (OMDb returns "N/A" when unknown). */
export type OmdbDetail = Record<string, string> & {
  imdbID: string;
  Title: string;
  Year: string;
  Poster: string;
};

export const omdbApi = {
  search: (search: string, page = 1) =>
    api
      .get<OmdbSearchResponse>("/omdb/search", { params: { search, page } })
      .then((r) => r.data),
  detail: (imdbId: string) =>
    api.get<OmdbDetail>(`/omdb/${imdbId}`).then((r) => r.data),
};

// ── Movie comparison ──────────────────────────────────────────────────
export interface ComparedMovie {
  movie_id: string;
  title: string;
  poster: string | null;
  year: string | null;
  genre: string | null;
  runtime: string | null;
  director: string | null;
  cast: string | null;
  plot: string | null;
  imdb_rating: number | null;
  user_average_rating: number;
  total_reviews: number;
}

export interface ComparisonResult {
  movie1: ComparedMovie;
  movie2: ComparedMovie;
  comparison_summary: string[];
}

export const compareApi = {
  compare: (movie1: string, movie2: string) =>
    api.get<ComparisonResult>("/compare", { params: { movie1, movie2 } }).then((r) => r.data),
};

// ── OMDb movie reviews ────────────────────────────────────────────────
export interface MovieReview {
  id: string;
  user_name: string;
  movie_title: string;
  imdb_id: string;
  rating: number;
  review: string;
  created_at: string;
  updated_at: string;
}

export interface MovieReviewPage {
  page: number;
  limit: number;
  total: number;
  data: MovieReview[];
}

export const movieReviewsApi = {
  list: (imdbId: string, page = 1, limit = 10) =>
    api
      .get<MovieReviewPage>(`/movie-reviews/${imdbId}`, { params: { page, limit } })
      .then((r) => r.data),
  rating: (imdbId: string) =>
    api
      .get<{ average_rating: number; total_reviews: number }>(`/movie-reviews/${imdbId}/rating`)
      .then((r) => r.data),
  add: (movie_id: string, movie_title: string, rating: number, review: string) =>
    api.post<MovieReview>("/movie-reviews", { imdb_id: movie_id, movie_title, rating, review }).then((r) => r.data),
  update: (reviewId: string, rating: number, review: string) =>
    api.put<MovieReview>(`/movie-reviews/${reviewId}`, { rating, review }).then((r) => r.data),
  remove: (reviewId: string) => api.delete(`/movie-reviews/${reviewId}`),
};

// ── Recommendations & activity ────────────────────────────────────────
export interface RecommendedMovie {
  imdb_id: string;
  title: string;
  genre?: string | null;
  poster?: string | null;
  reason: string;
  score: number;
}

export const recommendationApi = {
  list: () =>
    api
      .get<{ recommended_movies: RecommendedMovie[] }>("/recommendations")
      .then((r) => r.data.recommended_movies),
  preferences: () => api.get<Preference[]>("/preferences").then((r) => r.data),
  addPreference: (genre: string) =>
    api.post<Preference>("/preferences", { genre }).then((r) => r.data),
  deletePreference: (id: string) => api.delete(`/preferences/${id}`),
};

export interface OmdbWatchlistItem {
  movie_id: string;
  movie_title: string;
  poster: string | null;
  genre: string | null;
  year: string | null;
}

export const watchlistApi = {
  list: () =>
    api.get<OmdbWatchlistItem[]>("/omdb-watchlist").then((r) => r.data),
  add: (item: OmdbWatchlistItem) => api.post("/omdb-watchlist", item),
  remove: (movieId: string) => api.delete(`/omdb-watchlist/${movieId}`),
};

// ── Watched history ───────────────────────────────────────────────────
export interface WatchedItem {
  id: string;
  movie_id: string;
  movie_title: string;
  poster: string | null;
  genre: string | null;
  imdb_rating: number | null;
  watched_at: string;
}

export interface WatchedCreate {
  movie_id: string;
  movie_title: string;
  poster?: string | null;
  genre?: string | null;
  imdb_rating?: number | null;
}

export const watchedApi = {
  list: () => api.get<WatchedItem[]>("/watched").then((r) => r.data),
  mark: (item: WatchedCreate) => api.post<WatchedItem>("/watched", item).then((r) => r.data),
  remove: (movieId: string) => api.delete(`/watched/${movieId}`),
  status: (movieId: string) =>
    api.get<{ is_watched: boolean }>(`/watched/status/${movieId}`).then((r) => r.data.is_watched),
  moveToWatchlist: (movieId: string) => api.post(`/watched/${movieId}/move-to-watchlist`),
};

// ── Analytics dashboard ───────────────────────────────────────────────
// Collections
export interface CollectionMovie {
  id: string;
  movie_id: string;
  movie_title: string;
  poster: string | null;
  genre: string | null;
  year: string | null;
  created_at: string;
}

export interface MovieCollection {
  id: string;
  name: string;
  description: string | null;
  created_at: string;
  updated_at: string;
  movies: CollectionMovie[];
}

export interface CollectionMoviePayload {
  movie_id: string;
  movie_title: string;
  poster?: string | null;
  genre?: string | null;
  year?: string | null;
}

export interface MovieCollectionStatus {
  collection_id: string;
  name: string;
  contains_movie: boolean;
}

export const collectionsApi = {
  list: () => api.get<MovieCollection[]>("/collections").then((r) => r.data),
  create: (name: string, description?: string | null) =>
    api.post<MovieCollection>("/collections", { name, description }).then((r) => r.data),
  update: (id: string, data: { name?: string; description?: string | null }) =>
    api.put<MovieCollection>(`/collections/${id}`, data).then((r) => r.data),
  remove: (id: string) => api.delete(`/collections/${id}`),
  addMovie: (collectionId: string, item: CollectionMoviePayload) =>
    api
      .post<CollectionMovie>(`/collections/${collectionId}/movies`, item)
      .then((r) => r.data),
  removeMovie: (collectionId: string, movieId: string) =>
    api.delete(`/collections/${collectionId}/movies/${movieId}`),
  memberships: (movieId: string) =>
    api.get<MovieCollectionStatus[]>(`/collections/movie/${movieId}`).then((r) => r.data),
};

export interface DashboardStats {
  watched_count: number;
  favorites_count: number;
  watchlist_count: number;
  reviews_count: number;
  collections_count: number;
  total_searches: number;
}

export interface GenreCount {
  genre: string;
  count: number;
}

export interface MonthlyCount {
  month: string;
  count: number;
}

export interface RecentActivity {
  recent_watched: { title: string; poster: string | null; watched_date: string }[];
  recent_favorites: { title: string; poster: string | null }[];
  recent_reviews: { movie_title: string; rating: number; created_at: string }[];
}

export const dashboardApi = {
  stats: () => api.get<DashboardStats>("/dashboard").then((r) => r.data),
  genres: () => api.get<GenreCount[]>("/dashboard/genres").then((r) => r.data),
  monthly: () => api.get<MonthlyCount[]>("/dashboard/monthly").then((r) => r.data),
  recent: () => api.get<RecentActivity>("/dashboard/recent").then((r) => r.data),
};

export const activityApi = {
  recordView: (imdb_id: string, movie_title: string, genre?: string | null) =>
    api.post("/recently-viewed", { imdb_id, movie_title, genre }),
};

// ── Profile ───────────────────────────────────────────────────────────
export interface ProfileStats {
  watched_count: number;
  favorites_count: number;
  watchlist_count: number;
  reviews_count: number;
  collections_count: number;
}

export const profileApi = {
  get: () => api.get<Profile>("/profile").then((r) => r.data),
  stats: () => api.get<ProfileStats>("/profile/stats").then((r) => r.data),
  update: (data: Omit<Partial<Profile>, "favorite_genres"> & { favorite_genres?: string[] }) =>
    api.put<Profile>("/profile", data).then((r) => r.data),
  notifications: () => api.get<Notification[]>("/notifications").then((r) => r.data),
  markRead: (id: string) => api.post(`/notifications/${id}/read`),
};

// ── Notifications ─────────────────────────────────────────────────────
export const notificationsApi = {
  list: () => api.get<Notification[]>("/notifications").then((r) => r.data),
  unreadCount: () =>
    api.get<{ count: number }>("/notifications/unread-count").then((r) => r.data.count),
  markRead: (id: string) => api.put(`/notifications/${id}/read`),
  markAllRead: () => api.put("/notifications/read-all"),
};

// ── Admin ─────────────────────────────────────────────────────────────
export const adminApi = {
  stats: () => api.get<AdminStats>("/admin/stats").then((r) => r.data),
  users: (search?: string) =>
    api.get<AdminUser[]>("/admin/users", { params: { search } }).then((r) => r.data),
  setBlock: (userId: string, blocked: boolean) =>
    api.post(`/admin/users/${userId}/block`, null, { params: { blocked } }),
  reviews: () => api.get<Review[]>("/admin/reviews").then((r) => r.data),
  deleteReview: (id: string) => api.delete(`/admin/reviews/${id}`),
  deleteMovie: (id: string) => api.delete(`/admin/movies/${id}`),
};
