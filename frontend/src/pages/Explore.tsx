import { Bookmark, Heart, Search, X } from "lucide-react";
import { useEffect, useState } from "react";
import type { AxiosError } from "axios";
import {
  omdbApi,
  type OmdbDetail,
  type OmdbSearchItem,
} from "../api/movieverse";
import { useWatchlist, type SavedMovie } from "../context/WatchlistContext";
import { Button, PosterSkeleton, Spinner } from "../components/ui";
import { PLACEHOLDER_POSTER } from "../lib/format";

const poster = (p: string) => (p && p !== "N/A" ? p : PLACEHOLDER_POSTER);
const errText = (e: unknown) =>
  ((e as AxiosError<{ detail?: string }>)?.response?.data?.detail) ||
  "Something went wrong. Please try again.";

export default function Explore() {
  const [term, setTerm] = useState("");
  const [query, setQuery] = useState(""); // debounced value that actually triggers the fetch
  const [page, setPage] = useState(1);
  const [data, setData] = useState<{ results: OmdbSearchItem[]; total_pages: number; total: number } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [detailId, setDetailId] = useState<string | null>(null);

  // Debounce: wait 500ms after the last keystroke before searching.
  useEffect(() => {
    const t = setTimeout(() => {
      setQuery(term.trim());
      setPage(1);
    }, 500);
    return () => clearTimeout(t);
  }, [term]);

  useEffect(() => {
    if (!query) {
      setData(null);
      setError("");
      return;
    }
    setLoading(true);
    setError("");
    omdbApi
      .search(query, page)
      .then(setData)
      .catch((e) => {
        setData(null);
        setError(errText(e));
      })
      .finally(() => setLoading(false));
  }, [query, page]);

  return (
    <div>
      <h1 className="mb-1 text-2xl font-bold">
        Explore <span className="text-gradient">OMDb</span>
      </h1>
      <p className="mb-5 text-sm text-muted">Search millions of movies live from the OMDb catalog.</p>

      <div className="relative mb-6 max-w-xl">
        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
        <input
          value={term}
          onChange={(e) => setTerm(e.target.value)}
          placeholder="Search movies (e.g. Batman, Avatar, Inception)..."
          className="w-full rounded-lg border border-border bg-surface py-2.5 pl-10 pr-4 text-sm outline-none focus:border-primary"
        />
      </div>

      {loading && (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {Array.from({ length: 10 }).map((_, i) => (
            <PosterSkeleton key={i} />
          ))}
        </div>
      )}

      {!loading && error && (
        <div className="rounded-xl border border-border bg-card p-8 text-center">
          <p className="font-semibold text-primary">{error}</p>
        </div>
      )}

      {!loading && !error && query && data && data.results.length === 0 && (
        <p className="py-12 text-center text-muted">No movies found for "{query}".</p>
      )}

      {!loading && !error && !query && (
        <p className="py-12 text-center text-muted">Start typing to search OMDb.</p>
      )}

      {!loading && !error && data && data.results.length > 0 && (
        <>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {data.results.map((m) => (
              <OmdbCard key={m.imdbID} movie={m} onOpen={() => setDetailId(m.imdbID)} />
            ))}
          </div>
          <Pagination
            page={page}
            totalPages={data.total_pages}
            onChange={(p) => {
              setPage(p);
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
          />
        </>
      )}

      {detailId && <DetailModal imdbId={detailId} onClose={() => setDetailId(null)} />}
    </div>
  );
}

function SaveButtons({ movie }: { movie: SavedMovie }) {
  const { has, toggle } = useWatchlist();
  const inWatch = has("watchlist", movie.imdbID);
  const inFav = has("favorites", movie.imdbID);
  return (
    <div className="flex gap-2">
      <button
        onClick={(e) => {
          e.stopPropagation();
          toggle("watchlist", movie);
        }}
        aria-label="Toggle watchlist"
        className={`grid h-8 w-8 place-items-center rounded-full transition-colors ${
          inWatch ? "gradient-primary text-white" : "bg-black/60 text-white hover:bg-black/80"
        }`}
      >
        <Bookmark size={15} className={inWatch ? "fill-white" : ""} />
      </button>
      <button
        onClick={(e) => {
          e.stopPropagation();
          toggle("favorites", movie);
        }}
        aria-label="Toggle favorite"
        className={`grid h-8 w-8 place-items-center rounded-full transition-colors ${
          inFav ? "bg-primary text-white" : "bg-black/60 text-white hover:bg-black/80"
        }`}
      >
        <Heart size={15} className={inFav ? "fill-white" : ""} />
      </button>
    </div>
  );
}

function OmdbCard({ movie, onOpen }: { movie: OmdbSearchItem; onOpen: () => void }) {
  return (
    <div
      onClick={onOpen}
      className="group animate-in cursor-pointer overflow-hidden rounded-xl bg-card transition-transform hover:-translate-y-1"
    >
      <div className="relative aspect-[2/3] overflow-hidden">
        <img
          src={poster(movie.Poster)}
          alt={movie.Title}
          loading="lazy"
          className="h-full w-full object-cover transition-transform group-hover:scale-105"
        />
        <div className="absolute right-2 top-2 opacity-0 transition-opacity group-hover:opacity-100">
          <SaveButtons movie={movie} />
        </div>
      </div>
      <div className="p-3">
        <p className="truncate text-sm font-semibold">{movie.Title}</p>
        <p className="text-xs text-muted">{movie.Year}</p>
      </div>
    </div>
  );
}

function Pagination({
  page,
  totalPages,
  onChange,
}: {
  page: number;
  totalPages: number;
  onChange: (p: number) => void;
}) {
  if (totalPages <= 1) return null;
  return (
    <div className="mt-8 flex items-center justify-center gap-4">
      <Button variant="secondary" disabled={page <= 1} onClick={() => onChange(page - 1)}>
        Previous
      </Button>
      <span className="text-sm text-muted">
        Page {page} of {totalPages}
      </span>
      <Button variant="secondary" disabled={page >= totalPages} onClick={() => onChange(page + 1)}>
        Next
      </Button>
    </div>
  );
}

const DETAIL_FIELDS = [
  "Genre", "Runtime", "imdbRating", "Director", "Writer", "Actors",
  "Language", "Country", "Awards", "Released", "Production", "BoxOffice",
] as const;

function DetailModal({ imdbId, onClose }: { imdbId: string; onClose: () => void }) {
  const [movie, setMovie] = useState<OmdbDetail | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    setMovie(null);
    setError("");
    omdbApi.detail(imdbId).then(setMovie).catch((e) => setError(errText(e)));
  }, [imdbId]);

  // Close on Escape.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/70 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="animate-in my-8 w-full max-w-3xl overflow-hidden rounded-2xl border border-border bg-card"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-border px-5 py-3">
          <h2 className="text-lg font-bold">{movie?.Title || "Loading..."}</h2>
          <button onClick={onClose} aria-label="Close" className="rounded-lg p-1 hover:bg-chip">
            <X size={20} />
          </button>
        </div>

        {!movie && !error && (
          <div className="grid place-items-center py-20">
            <Spinner />
          </div>
        )}
        {error && <p className="p-8 text-center text-primary">{error}</p>}

        {movie && (
          <div className="flex flex-col gap-5 p-5 sm:flex-row">
            <img
              src={poster(movie.Poster)}
              alt={movie.Title}
              className="mx-auto w-40 shrink-0 rounded-xl object-cover sm:mx-0"
            />
            <div className="min-w-0 flex-1">
              <div className="mb-3">
                <SaveButtons movie={movie} />
              </div>
              <p className="mb-4 text-sm text-text-secondary">{movie.Plot}</p>
              <dl className="grid grid-cols-1 gap-x-6 gap-y-1.5 text-sm sm:grid-cols-2">
                {DETAIL_FIELDS.map((f) =>
                  movie[f] && movie[f] !== "N/A" ? (
                    <div key={f} className="flex gap-2">
                      <dt className="shrink-0 text-muted">{f === "imdbRating" ? "IMDb" : f}:</dt>
                      <dd className="truncate font-medium">{movie[f]}</dd>
                    </div>
                  ) : null
                )}
              </dl>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
