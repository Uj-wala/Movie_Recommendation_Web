import { ArrowLeft, Star } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { activityApi, omdbApi, type OmdbDetail } from "../api/movieverse";
import { useAuth } from "../context/AuthContext";
import MovieReviews from "../components/MovieReviews";
import OmdbSaveButtons from "../components/OmdbSaveButtons";
import { Spinner } from "../components/ui";
import { OMDB_DETAIL_FIELDS, omdbErrText, omdbPoster } from "../lib/omdb";

export default function OmdbMovieDetails() {
  const { imdbId = "" } = useParams();
  const { isAuthenticated } = useAuth();
  const [movie, setMovie] = useState<OmdbDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    setError("");
    setMovie(null);
    omdbApi
      .detail(imdbId)
      .then((m) => {
        setMovie(m);
        // Record the view (feeds recommendations); best-effort, only when logged in.
        if (isAuthenticated) {
          activityApi.recordView(m.imdbID, m.Title, m.Genre).catch(() => {});
        }
      })
      .catch((e) => setError(omdbErrText(e)))
      .finally(() => setLoading(false));
  }, [imdbId, isAuthenticated]);

  return (
    <div className="animate-in">
      <Link
        to="/explore"
        className="mb-5 inline-flex items-center gap-1.5 text-sm text-muted hover:text-text"
      >
        <ArrowLeft size={16} /> Back to Movies
      </Link>

      {loading && (
        <div className="grid gap-8 md:grid-cols-[300px_1fr]">
          <div className="skeleton aspect-[2/3] w-full rounded-2xl" />
          <div className="space-y-4">
            <div className="skeleton h-8 w-2/3 rounded" />
            <div className="skeleton h-4 w-1/3 rounded" />
            <div className="skeleton h-24 w-full rounded" />
          </div>
        </div>
      )}

      {!loading && error && (
        <div className="rounded-2xl border border-border bg-card p-10 text-center">
          <p className="text-lg font-semibold text-primary">{error}</p>
          <p className="mt-1 text-sm text-muted">Please try another movie.</p>
        </div>
      )}

      {!loading && movie && (
        <div className="grid gap-8 md:grid-cols-[300px_1fr]">
          {/* Left: poster */}
          <img
            src={omdbPoster(movie.Poster)}
            alt={movie.Title}
            className="mx-auto w-full max-w-[300px] rounded-2xl object-cover shadow-2xl"
          />

          {/* Right: details */}
          <div className="min-w-0">
            <h1 className="text-3xl font-extrabold">{movie.Title}</h1>
            <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-muted">
              <span>{movie.Year}</span>
              {movie.Rated && movie.Rated !== "N/A" && (
                <span className="rounded bg-chip px-2 py-0.5">{movie.Rated}</span>
              )}
              {movie.imdbRating && movie.imdbRating !== "N/A" && (
                <span className="inline-flex items-center gap-1 font-semibold text-rating">
                  <Star size={15} className="fill-rating text-rating" /> {movie.imdbRating}
                </span>
              )}
            </div>

            <div className="mt-4">
              <OmdbSaveButtons
                movie={{
                  imdbID: movie.imdbID,
                  Title: movie.Title,
                  Year: movie.Year,
                  Poster: movie.Poster,
                }}
                size="lg"
              />
            </div>

            {movie.Plot && movie.Plot !== "N/A" && (
              <p className="mt-5 max-w-2xl text-text-secondary">{movie.Plot}</p>
            )}

            <dl className="mt-6 grid grid-cols-1 gap-x-8 gap-y-2 text-sm sm:grid-cols-2">
              {OMDB_DETAIL_FIELDS.map(([key, label]) =>
                movie[key] && movie[key] !== "N/A" ? (
                  <div key={key} className="flex gap-2">
                    <dt className="shrink-0 text-muted">{label}:</dt>
                    <dd className="font-medium">{movie[key]}</dd>
                  </div>
                ) : null
              )}
            </dl>
          </div>
        </div>
      )}

      {!loading && movie && <MovieReviews imdbId={movie.imdbID} title={movie.Title} />}
    </div>
  );
}
