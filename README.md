# 🎬 MovieVerse AI

A modern, dark-themed movie recommendation platform. FastAPI + MySQL backend, React + TypeScript + Vite frontend. Passwordless login via **Email OTP** or **Phone OTP**, JWT auth, personalized recommendations, watchlists, favorites, reviews, and an admin console.

> Transformed from the previous education-tutoring app — no education code, tables, routes, or assets remain.

---

## Tech Stack

**Backend:** FastAPI · SQLAlchemy 2 · Alembic · MySQL · Pydantic · Passlib (bcrypt) · python-jose (JWT)
**Frontend:** React 19 · TypeScript · Vite · React Router v7 · Axios · Context API · Formik/Yup · Lucide icons · react-hot-toast · Tailwind CSS v4

---

## Prerequisites

- Python 3.11+
- Node 18+
- MySQL running locally

---

## 1. Backend setup

```bash
cd backend
python -m venv venv
venv/Scripts/activate      # Windows
# source venv/bin/activate # macOS/Linux
pip install -r requirements.txt
```

Configure `backend/.env` (already provided for local dev):

```env
DB_USER=root
DB_PASSWORD=yourpassword
DB_HOST=localhost
DB_PORT=3306
DB_NAME=movieverse_ai        # created automatically on startup if the DB user has permission

JWT_SECRET_KEY=change-me-in-production
DEV_MODE=True                # forces every OTP to 123456 and makes email best-effort

ADMIN_EMAIL=admin@movieverse.ai
ADMIN_PASSWORD=Admin@123
```

If your MySQL user cannot create databases, create it once manually:

```bash
mysql -u root -p -e "CREATE DATABASE IF NOT EXISTS movieverse_ai CHARACTER SET utf8mb4;"
```

Run the API. Tables are created and seed data (14 genres, 25 real movies with TMDB imagery, cast/directors, admin user) is loaded automatically on startup:

```bash
uvicorn app.main:app --reload --port 8000
```

- API docs: http://localhost:8000/docs
- Admin login: `admin@movieverse.ai` → OTP `123456`

## 2. Frontend setup

`frontend/.env` already points at the API:

```env
VITE_API_BASE_URL=http://localhost:8000
```

```bash
cd frontend
npm install
npm run dev        # http://localhost:5173
```

---

## Authentication (passwordless login)

- **Email/Phone login:** enter email or phone → "Send OTP" → enter code → signed in. No password needed.
- **Dev OTP is always `123456`** (both email and phone) while `DEV_MODE=True`. OTPs are stored in `otp_verifications` and expire after 5 minutes.
- **Register** sets a password too — used for **Forgot Password** and **Change Password** flows (both OTP-verified via email).

Turn `DEV_MODE=False` and configure SMTP (`EMAIL_USERNAME` / `EMAIL_PASSWORD`) to send real email OTPs.

---

## API overview

| Area | Endpoints |
|------|-----------|
| Auth | `POST /auth/register`, `/auth/send-email-otp`, `/auth/send-phone-otp`, `/auth/verify-email-otp` (= `/auth/login/email`), `/auth/verify-phone-otp` (= `/auth/login/phone`), `/auth/forgot-password`, `/auth/reset-password`, `/auth/change-password`, `/auth/refresh` |
| Movies | `GET /movies`, `/movies/trending`, `/movies/popular`, `/movies/top-rated`, `/movies/upcoming`, `/movies/now-playing`, `/movies/recommended`, `/movies/{id_or_slug}`, `/movies/{id}/related` |
| Catalog | `GET /genres`, `/actors`, `/directors`, `/search?q=` |
| Reviews | `GET /reviews/mine`, `/reviews/movie/{id}` · `POST /reviews` · `PUT/DELETE /reviews/{id}` |
| Library | `GET/POST/DELETE /favorites`, `/watchlist`, `/omdb-watchlist` |
| Watched | `GET/POST /watched` · `GET /watched/status/{movieId}` · `DELETE /watched/{movieId}` · `POST /watched/{movieId}/move-to-watchlist` |
| Profile | `GET/PUT /profile`, `GET /profile/stats`, `GET /notifications` |
| Preferences | `GET/POST /preferences` · `DELETE /preferences/{id}` |
| Dashboard | `GET /dashboard` · `/dashboard/genres` · `/dashboard/monthly` · `/dashboard/recent` |
| Admin | `GET /admin/stats`, `/admin/users`, `POST /admin/users/{id}/block`, `POST/PUT/DELETE /admin/movies`, `GET/DELETE /admin/reviews` |

## Database tables

`users` · `movies` · `genres` · `movie_genres` · `actors` · `directors` · `movie_actors` · `user_genres` · `favorites` · `watchlist` · `omdb_watchlist` · `watched_movies` · `reviews` · `notifications` · `otp_verifications`

### Analytics dashboard

Protected `/dashboard` page (`pages/Dashboard.tsx`, **Recharts** + Tailwind, all requests via
`dashboardApi` in `api/movieverse.ts`). Backend logic lives in `services/dashboard_service.py`
(no separate `crud/` layer — consistent with the rest of this codebase):

- **`GET /dashboard`** — 6 stat counts: `watched · favorites · watchlist · reviews · collections · searches`.
  Sourced from the live OMDb tables (`watched_movies`, `omdb_watchlist`, `omdb_reviews`), catalog
  `favorites`, and `search_history`. `collections_count` is `0` (no Collections module exists yet).
- **`GET /dashboard/genres`** — top 5 genres, splitting the comma-separated `watched_movies.genre` in Python.
- **`GET /dashboard/monthly`** — watched counts bucketed into the last 6 calendar months (zero-filled).
- **`GET /dashboard/recent`** — recent watched / favorites / reviews for the activity lists.
- **Charts**: Bar (top genres), Line (monthly), Pie (watchlist vs watched). Stat cards animate with a
  lightweight `requestAnimationFrame` count-up; skeletons, empty state, and toast errors included.

### Profile dashboard

The Profile page (`pages/Profile.tsx`, Tailwind + `react-hot-toast`, all requests through
`api/movieverse.ts`) shows editable info, a stats row, genre preferences, and password change:

- **Stats**: `watched · favorites · watchlist · reviews`, computed on demand in `_stats()` and served
  both inline on `GET /profile` (consumed app-wide via `AuthContext`) and standalone on `GET /profile/stats`.
- **Genre preferences**: manual add/remove backed by the existing `user_preferences` table —
  `GET/POST /preferences`, `DELETE /preferences/{id}` (owner-scoped). Adding a duplicate genre returns **409**.
- **Change password** keeps the existing **OTP-verified** flow (`/auth/change-password` → verify) rather
  than a plain old/new swap — a deliberate upgrade over the brief's simpler endpoint.

### Watched History & Watch Status

Marks OMDb movies (imdb id) as watched and keeps a per-user history. Backend follows the existing
`model → schema → service → router` layout (no separate `crud/` layer; the response envelope is applied
globally in `main.py`):

- **`watched_movies`** table: `id`, `user_id → users.id (cascade)`, `movie_id`, `movie_title`, `poster`,
  `genre`, `imdb_rating`, `watched_at`. Unique `(user_id, movie_id)` prevents duplicates (**409**).
- **Auto watchlist management**: `POST /watched` inserts the record *and* removes the movie from
  `omdb_watchlist` in one call — logic lives in `services/watched_service.py`, not the route.
- **Frontend**: `Watched History` nav link + `/watched` page (genre filter, newest/oldest sort, remove,
  move-back-to-watchlist), a `✔ Watched` badge across cards/details, a `Mark Watched` button on
  `OmdbSaveButtons`, and a Watched tab on the My List page. State is centralized in `WatchlistContext`
  (backend-persisted, optimistic updates) via `watchedApi` in `api/movieverse.ts`.

---

## Notes / deviations from the brief

- **Forms** use the already-installed **Formik/Yup + native state** rather than React Hook Form (no new dependency).
- **Animations** use Tailwind/CSS transitions instead of Framer Motion (not installed). Add `framer-motion` if you want richer page transitions.
- **Movie imagery** uses real TMDB CDN URLs (all verified to resolve) — an internet connection is needed to display posters/backdrops.
- **Rate limiting** is a simple in-process limiter (`app/utils/rate_limit.py`); swap for Redis/slowapi for multi-worker deployments.
- **Alembic** is present; the app also runs `Base.metadata.create_all` on startup, so migrations are optional for local dev.
