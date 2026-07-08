import api from "./axios";
import type {
  AdminStats,
  AdminUser,
  Genre,
  Movie,
  MovieDetail,
  Notification,
  Person,
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
  preferences: () =>
    api.get<{ genre: string; score: number }[]>("/preferences").then((r) => r.data),
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

export const activityApi = {
  recordView: (imdb_id: string, movie_title: string, genre?: string | null) =>
    api.post("/recently-viewed", { imdb_id, movie_title, genre }),
};

// ── Profile ───────────────────────────────────────────────────────────
export const profileApi = {
  get: () => api.get<Profile>("/profile").then((r) => r.data),
  update: (data: Omit<Partial<Profile>, "favorite_genres"> & { favorite_genres?: string[] }) =>
    api.put<Profile>("/profile", data).then((r) => r.data),
  notifications: () => api.get<Notification[]>("/notifications").then((r) => r.data),
  markRead: (id: string) => api.post(`/notifications/${id}/read`),
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
