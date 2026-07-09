import { ArrowLeft, GitCompare, Star } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  movieReviewsApi,
  moviesApi,
  omdbApi,
  reviewsApi,
  type OmdbDetail,
} from "../api/movieverse";
import { useCompare, type CompareMovie } from "../context/CompareContext";
import { PLACEHOLDER_POSTER, runtimeLabel, year } from "../lib/format";
import { omdbPoster } from "../lib/omdb";

interface CompareDetails {
  id: string;
  poster: string | null;
  title: string;
  releaseYear: string;
  genre: string;
  runtime: string;
  director: string;
  cast: string;
  imdbRating: number | null;
  userAverageRating: number;
  totalReviews: number;
  plot: string;
}

export default function CompareMovies() {
  const { selected, clear } = useCompare();
  const [movies, setMovies] = useState<CompareDetails[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (selected.length !== 2) {
      setMovies([]);
      return;
    }
    setLoading(true);
    setError("");
    Promise.all(selected.map(loadMovie))
      .then(setMovies)
      .catch(() => setError("Could not load comparison details."))
      .finally(() => setLoading(false));
  }, [selected]);

  return (
    <div className="animate-in">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <Link to="/movies" className="mb-2 inline-flex items-center gap-1 text-sm text-muted hover:text-text">
            <ArrowLeft size={15} /> Back to movies
          </Link>
          <h1 className="flex items-center gap-2 text-2xl font-bold">
            <GitCompare className="text-primary" /> Compare Movies
          </h1>
        </div>
        {selected.length > 0 && (
          <button
            type="button"
            onClick={clear}
            className="rounded-lg border border-border px-4 py-2 text-sm font-semibold hover:bg-chip"
          >
            Clear Selection
          </button>
        )}
      </div>

      {selected.length !== 2 ? (
        <div className="rounded-xl border border-border bg-card p-10 text-center">
          <GitCompare size={40} className="mx-auto mb-3 text-primary" />
          <p className="text-lg font-semibold">Select two movies to compare</p>
          <p className="mt-1 text-sm text-muted">
            Use the Compare button on movie cards. You can select up to 2 movies at a time.
          </p>
        </div>
      ) : loading ? (
        <div className="grid gap-5 md:grid-cols-2">
          <div className="skeleton h-96 rounded-xl" />
          <div className="skeleton h-96 rounded-xl" />
        </div>
      ) : error ? (
        <p className="rounded-xl border border-border bg-card p-8 text-center text-primary">{error}</p>
      ) : (
        <div className="space-y-5">
          <div className="grid gap-5 lg:grid-cols-2">
            {movies.map((movie) => (
              <MovieComparePanel key={movie.id} movie={movie} peer={movies.find((m) => m.id !== movie.id)} />
            ))}
          </div>
          <ComparisonRows movies={movies} />
        </div>
      )}
    </div>
  );
}

async function loadMovie(selection: CompareMovie): Promise<CompareDetails> {
  if (selection.source === "omdb") {
    const [detail, rating] = await Promise.all([
      omdbApi.detail(selection.id),
      movieReviewsApi.rating(selection.id).catch(() => ({ average_rating: 0, total_reviews: 0 })),
    ]);
    return fromOmdb(detail, rating.average_rating, rating.total_reviews);
  }

  const detail = await moviesApi.detail(selection.slug || selection.id);
  const reviews = await reviewsApi.forMovie(detail.id).catch(() => []);
  const average =
    reviews.length === 0
      ? 0
      : reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;

  return {
    id: detail.id,
    poster: detail.poster_url,
    title: detail.title,
    releaseYear: String(year(detail.release_date)),
    genre: detail.genres.map((g) => g.name).join(", "),
    runtime: runtimeLabel(detail.runtime),
    director: detail.director?.name || "N/A",
    cast: detail.cast.map((person) => person.name).join(", ") || "N/A",
    imdbRating: detail.rating,
    userAverageRating: average,
    totalReviews: reviews.length,
    plot: detail.overview || "N/A",
  };
}

function fromOmdb(detail: OmdbDetail, average: number, total: number): CompareDetails {
  return {
    id: detail.imdbID,
    poster: omdbPoster(detail.Poster),
    title: detail.Title,
    releaseYear: clean(detail.Year),
    genre: clean(detail.Genre),
    runtime: clean(detail.Runtime),
    director: clean(detail.Director),
    cast: clean(detail.Actors),
    imdbRating: Number.isFinite(Number(detail.imdbRating)) ? Number(detail.imdbRating) : null,
    userAverageRating: average,
    totalReviews: total,
    plot: clean(detail.Plot),
  };
}

function clean(value?: string) {
  return value && value !== "N/A" ? value : "N/A";
}

function MovieComparePanel({ movie, peer }: { movie: CompareDetails; peer?: CompareDetails }) {
  return (
    <section className="rounded-xl border border-border bg-card p-4">
      <div className="grid gap-4 sm:grid-cols-[150px_1fr]">
        <img
          src={movie.poster || PLACEHOLDER_POSTER}
          alt={movie.title}
          className="mx-auto aspect-[2/3] w-full max-w-[170px] rounded-lg object-cover"
        />
        <div className="min-w-0">
          <h2 className="text-xl font-bold">{movie.title}</h2>
          <p className="mt-1 text-sm text-muted">{movie.releaseYear}</p>
          <div className="mt-3 flex flex-wrap gap-2 text-xs">
            {movie.genre.split(",").slice(0, 4).map((genre) => (
              <span key={genre} className="rounded-full bg-chip px-2.5 py-1 text-text-secondary">
                {genre.trim()}
              </span>
            ))}
          </div>
          <div className="mt-4 grid grid-cols-3 gap-2">
            <Metric label="IMDb" value={formatRating(movie.imdbRating)} highlight={metricClass(movie.imdbRating, peer?.imdbRating)} />
            <Metric label="User Avg" value={movie.userAverageRating.toFixed(1)} highlight={metricClass(movie.userAverageRating, peer?.userAverageRating)} />
            <Metric label="Reviews" value={String(movie.totalReviews)} highlight={metricClass(movie.totalReviews, peer?.totalReviews)} />
          </div>
        </div>
      </div>
    </section>
  );
}

function Metric({ label, value, highlight }: { label: string; value: string; highlight: string }) {
  return (
    <div className={`rounded-lg border border-border bg-surface p-2 ${highlight}`}>
      <p className="text-xs text-muted">{label}</p>
      <p className="mt-1 flex items-center gap-1 font-bold">
        {label !== "Reviews" && <Star size={13} className="fill-rating text-rating" />}
        {value}
      </p>
    </div>
  );
}

function ComparisonRows({ movies }: { movies: CompareDetails[] }) {
  const rows: [string, keyof CompareDetails][] = [
    ["Genre", "genre"],
    ["Runtime", "runtime"],
    ["Director", "director"],
    ["Cast", "cast"],
    ["IMDb Rating", "imdbRating"],
    ["User Average Rating", "userAverageRating"],
    ["Total Reviews", "totalReviews"],
    ["Plot", "plot"],
  ];

  return (
    <section className="overflow-hidden rounded-xl border border-border bg-card">
      {rows.map(([label, key]) => (
        <div key={key} className="grid border-b border-border last:border-b-0 md:grid-cols-[180px_1fr_1fr]">
          <div className="bg-surface px-4 py-3 text-sm font-semibold text-muted">{label}</div>
          {movies.map((movie, index) => (
            <div
              key={`${movie.id}-${key}`}
              className={`px-4 py-3 text-sm text-text-secondary ${cellClass(movie[key], movies[1 - index]?.[key])}`}
            >
              {formatValue(movie[key])}
            </div>
          ))}
        </div>
      ))}
    </section>
  );
}

function formatRating(value: number | null) {
  return value == null ? "N/A" : value.toFixed(1);
}

function formatValue(value: CompareDetails[keyof CompareDetails]) {
  if (typeof value === "number") return value.toFixed(1).replace(/\.0$/, "");
  return value || "N/A";
}

function metricClass(value?: number | null, peer?: number | null) {
  if (value == null || peer == null || value === peer) return "";
  return value > peer ? "border-emerald-500/50 bg-emerald-500/10" : "border-rose-500/50 bg-rose-500/10";
}

function cellClass(value: CompareDetails[keyof CompareDetails], peer: CompareDetails[keyof CompareDetails] | undefined) {
  if (peer === undefined || value === peer) return "";
  if (typeof value === "number" && typeof peer === "number") {
    return value > peer ? "bg-emerald-500/10 text-emerald-100" : "bg-rose-500/10 text-rose-100";
  }
  return "bg-primary/10 text-text";
}
