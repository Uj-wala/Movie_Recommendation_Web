import { Compass, RefreshCw, Sparkles } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { recommendationApi, type RecommendedMovie } from "../api/movieverse";
import { PosterSkeleton } from "./ui";
import { omdbPoster } from "../lib/omdb";
import ScrollReveal from "./ScrollReveal";

/** Personalized "Recommended For You" section, driven by the backend engine
 *  (search history + recently viewed). Re-fetches when `refreshKey` changes. */
export default function RecommendedForYou({ refreshKey = 0 }: { refreshKey?: number }) {
  const [movies, setMovies] = useState<RecommendedMovie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [nonce, setNonce] = useState(0);

  const refresh = useCallback(() => setNonce((n) => n + 1), []);

  useEffect(() => {
    setLoading(true);
    setError("");
    recommendationApi
      .list()
      .then(setMovies)
      .catch(() => setError("Couldn't load recommendations right now."))
      .finally(() => setLoading(false));
  }, [refreshKey, nonce]);

  return (
    <section className="mb-8">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="flex items-center gap-2 text-lg font-bold">
          <Sparkles size={18} className="text-primary" /> Recommended For You
        </h2>
        <button
          onClick={refresh}
          disabled={loading}
          className="button-glow inline-flex items-center gap-1.5 rounded-lg bg-chip px-3 py-1.5 text-sm hover:bg-chip-hover disabled:opacity-50"
        >
          <RefreshCw size={14} className={loading ? "animate-spin" : ""} /> Refresh
        </button>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5">
          {Array.from({ length: 5 }).map((_, i) => (
            <PosterSkeleton key={i} />
          ))}
        </div>
      ) : error ? (
        <p className="rounded-xl border border-border bg-card p-6 text-center text-sm text-muted">
          {error}
        </p>
      ) : movies.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5">
          {movies.map((m, index) => (
            <ScrollReveal key={m.imdb_id} delay={(index % 5) * 60}>
              <RecCard movie={m} />
            </ScrollReveal>
          ))}
        </div>
      )}
    </section>
  );
}

function RecCard({ movie }: { movie: RecommendedMovie }) {
  const navigate = useNavigate();
  return (
    <div
      onClick={() => navigate(`/omdb/movie/${movie.imdb_id}`)}
      className="group movie-card-motion animate-in cursor-pointer overflow-hidden rounded-xl bg-card"
    >
      <div className="aspect-[2/3] overflow-hidden">
        <img
          src={omdbPoster(movie.poster || undefined)}
          alt={movie.title}
          loading="lazy"
          className="poster-motion h-full w-full object-cover"
        />
      </div>
      <div className="p-3">
        <p className="truncate text-sm font-semibold">{movie.title}</p>
        <span className="mt-1 inline-block rounded-full bg-primary/15 px-2 py-0.5 text-[11px] font-medium text-primary">
          {movie.reason}
        </span>
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="rounded-2xl border border-border bg-card p-10 text-center">
      <Sparkles size={36} className="mx-auto mb-3 text-primary" />
      <p className="font-semibold">No recommendations yet</p>
      <p className="mt-1 text-sm text-muted">
        Start searching and viewing movies to get personalized picks.
      </p>
      <Link
        to="/explore"
        className="button-glow mt-4 inline-flex items-center gap-2 rounded-lg gradient-primary px-5 py-2.5 font-semibold text-white"
      >
        <Compass size={18} /> Browse Movies
      </Link>
    </div>
  );
}
