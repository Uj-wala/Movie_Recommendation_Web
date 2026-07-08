import { lazy, Suspense } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { AdminRoute, ProtectedRoute } from "./components/guards";
import Layout from "./components/Layout";
import { PageLoader } from "./components/ui";

const Login = lazy(() => import("./pages/auth/Login"));
const Register = lazy(() => import("./pages/auth/Register"));
const ForgotPassword = lazy(() => import("./pages/auth/ForgotPassword"));

const Home = lazy(() => import("./pages/Home"));
const Browse = lazy(() => import("./pages/Browse"));
const Explore = lazy(() => import("./pages/Explore"));
const OmdbMovieDetails = lazy(() => import("./pages/OmdbMovieDetails"));
const Trending = lazy(() => import("./pages/Trending"));
const Search = lazy(() => import("./pages/Search"));
const MovieDetails = lazy(() => import("./pages/MovieDetails"));
const Watchlist = lazy(() => import("./pages/Watchlist"));
const Favorites = lazy(() => import("./pages/Favorites"));
const Reviews = lazy(() => import("./pages/Reviews"));
const Profile = lazy(() => import("./pages/Profile"));
const Settings = lazy(() => import("./pages/Settings"));
const Admin = lazy(() => import("./pages/Admin"));

export default function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          {/* Auth */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />

          {/* App shell */}
          <Route element={<Layout />}>
            {/* Public browsing */}
            <Route path="/" element={<Home />} />
            <Route path="/movies" element={<Browse heading="Movies" />} />
            <Route path="/explore" element={<Explore />} />
            <Route path="/omdb/movie/:imdbId" element={<OmdbMovieDetails />} />
            <Route path="/genres" element={<Browse heading="Genres" />} />
            <Route path="/trending" element={<Trending />} />
            <Route path="/search" element={<Search />} />
            <Route path="/movie/:slug" element={<MovieDetails />} />

            {/* Auth-only */}
            <Route path="/watchlist" element={<ProtectedRoute><Watchlist /></ProtectedRoute>} />
            <Route path="/favorites" element={<ProtectedRoute><Favorites /></ProtectedRoute>} />
            <Route path="/reviews" element={<ProtectedRoute><Reviews /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />

            {/* Admin */}
            <Route path="/admin" element={<AdminRoute><Admin /></AdminRoute>} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
