import { CheckCircle2, Compass, RotateCcw, Star, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import type { WatchedItem } from "../api/movieverse";
import { Chip, PosterSkeleton } from "../components/ui";
import { useWatchlist } from "../context/WatchlistContext";
import { omdbPoster } from "../lib/omdb";

type Sort = "newest" | "oldest";

export default function WatchedHistory() {
  const { watched, watchedLoading, removeWatched, moveBackToWatchlist } = useWatchlist();
  const [sort, setSort] = useState<Sort>("newest");
  const [genre, setGenre] = useState("all");

  // Distinct genres across the history for the filter chips.
  const genres = useMemo(() => {
    const set = new Set<string>();
    watched.forEach((m) => (m.genre || "").split(",").forEach((g) => g.trim() && set.add(g.trim())));
    return ["all", ...[...set].sort()];
  }, [watched]);

  const movies = useMemo(() => {
    const filtered =
      genre === "all"
        ? watched
        : watched.filter((m) => (m.genre || "").split(",").map((g) => g.trim()).includes(genre));
    return [...filtered].sort((a, b) =>
      sort === "newest"
        ? b.watched_at.localeCompare(a.watched_at)
        : a.watched_at.localeCompare(b.watched_at)
    );
  }, [watched, genre, sort]);

  return (
    <div>
      <h1 className="mb-5 flex items-center gap-2 text-2xl font-bold">
        <CheckCircle2 className="text-watched" /> Watched History
        {watched.length > 0 && <span className="text-muted">({watched.length})</span>}
      </h1>

      {watchedLoading ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {Array.from({ length: 10 }).map((_, i) => (
            <PosterSkeleton key={i} />
          ))}
        </div>
      ) : watched.length === 0 ? (
        <EmptyState />
      ) : (
        <>
          <div className="mb-6 flex flex-wrap items-center gap-3">
            <div className="flex flex-wrap gap-2">
              {genres.map((g) => (
                <Chip key={g} active={genre === g} onClick={() => setGenre(g)}>
                  {g === "all" ? "All Genres" : g}
                </Chip>
              ))}
            </div>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as Sort)}
              className="ml-auto rounded-lg border border-border bg-surface px-3 py-2 text-sm outline-none focus:border-primary"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
            </select>
          </div>

          {movies.length === 0 ? (
            <p className="py-12 text-center text-muted">No watched movies in "{genre}".</p>
          ) : (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              {movies.map((m) => (
                <WatchedCard
                  key={m.id}
                  movie={m}
                  onRemove={() => removeWatched(m.id)}
                  onMoveBack={() => moveBackToWatchlist(m)}
                />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}

function WatchedCard({
  movie,
  onRemove,
  onMoveBack,
}: {
  movie: WatchedItem;
  onRemove: () => void;
  onMoveBack: () => void;
}) {
  const navigate = useNavigate();
  return (
    <div className="group animate-in overflow-hidden rounded-xl bg-card transition-transform hover:-translate-y-1">
      <div
        onClick={() => navigate(`/omdb/movie/${movie.movie_id}`)}
        className="relative aspect-[2/3] cursor-pointer overflow-hidden"
      >
        <img
          src={omdbPoster(movie.poster || undefined)}
          alt={movie.movie_title}
          loading="lazy"
          className="h-full w-full object-cover transition-transform group-hover:scale-105"
        />
        {movie.imdb_rating != null && (
          <span className="absolute right-2 top-2 inline-flex items-center gap-1 rounded-full bg-black/70 px-2 py-0.5 text-xs font-semibold text-rating">
            <Star size={12} className="fill-rating" /> {movie.imdb_rating}
          </span>
        )}
      </div>
      <div className="p-3">
        <p className="truncate text-sm font-semibold">{movie.movie_title}</p>
        {movie.genre && <p className="truncate text-xs text-muted">{movie.genre}</p>}
        <p className="mt-1 text-xs text-muted">
          Watched {new Date(movie.watched_at).toLocaleDateString()}
        </p>
        <div className="mt-3 flex gap-2">
          <button
            onClick={onMoveBack}
            title="Move back to watchlist"
            className="inline-flex flex-1 items-center justify-center gap-1 rounded-lg bg-chip px-2 py-1.5 text-xs font-medium text-text-secondary transition-colors hover:bg-chip-hover"
          >
            <RotateCcw size={13} /> Watchlist
          </button>
          <button
            onClick={onRemove}
            title="Remove from watched history"
            aria-label="Remove from watched history"
            className="inline-flex items-center justify-center rounded-lg bg-chip px-2 py-1.5 text-red-400 transition-colors hover:bg-chip-hover"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="rounded-2xl border border-border bg-card p-12 text-center">
      <div className="mx-auto mb-3 text-4xl">🎬</div>
      <p className="text-lg font-semibold">No Watched Movies Yet</p>
      <p className="mt-1 text-sm text-muted">
        Mark movies as watched to build your viewing history.
      </p>
      <Link
        to="/explore"
        className="mt-5 inline-flex items-center gap-2 rounded-lg gradient-primary px-5 py-2.5 font-semibold text-white transition-transform hover:scale-105"
      >
        <Compass size={18} /> Browse Movies
      </Link>
    </div>
  );
}
