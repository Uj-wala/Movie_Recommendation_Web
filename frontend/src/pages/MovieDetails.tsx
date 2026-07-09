import { Bookmark, Heart, Play, Share2, Star } from "lucide-react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { libraryApi, moviesApi, reviewsApi } from "../api/movieverse";
import type { Movie, MovieDetail, Review } from "../api/types";
import MovieCard from "../components/MovieCard";
import CollectionPickerButton from "../components/CollectionPickerButton";
import ScrollReveal from "../components/ScrollReveal";
import { Button, PageLoader, StarRating } from "../components/ui";
import { useAuth } from "../context/AuthContext";
import { PLACEHOLDER_POSTER, ratingOutOf5, runtimeLabel, year } from "../lib/format";

export default function MovieDetailsPage() {
  const { slug } = useParams();
  const { isAuthenticated, user } = useAuth();
  const [movie, setMovie] = useState<MovieDetail | null>(null);
  const [related, setRelated] = useState<Movie[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [faved, setFaved] = useState(false);
  const [listed, setListed] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    moviesApi.detail(slug).then(async (m) => {
      setMovie(m);
      setLoading(false);
      moviesApi.related(m.slug).then(setRelated).catch(() => {});
      reviewsApi.forMovie(m.id).then(setReviews).catch(() => {});
      if (isAuthenticated) {
        libraryApi.favorites().then((f) => setFaved(f.some((x) => x.id === m.id))).catch(() => {});
        libraryApi.watchlist().then((w) => setListed(w.some((x) => x.id === m.id))).catch(() => {});
      }
    }).catch(() => setLoading(false));
  }, [slug, isAuthenticated]);

  async function toggleFav() {
    if (!isAuthenticated || !movie) return toast.error("Sign in to like movies");
    try {
      if (faved) await libraryApi.removeFavorite(movie.id);
      else await libraryApi.addFavorite(movie.id);
      setFaved(!faved);
      toast.success(faved ? "Removed from favorites" : "Added to favorites");
    } catch { toast.error("Something went wrong"); }
  }

  async function toggleList() {
    if (!isAuthenticated || !movie) return toast.error("Sign in to use watchlist");
    try {
      if (listed) await libraryApi.removeWatchlist(movie.id);
      else await libraryApi.addWatchlist(movie.id);
      setListed(!listed);
      toast.success(listed ? "Removed from watchlist" : "Added to watchlist");
    } catch { toast.error("Something went wrong"); }
  }

  function share() {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Link copied to clipboard");
  }

  if (loading) return <PageLoader />;
  if (!movie) return <p className="text-muted">Movie not found.</p>;

  return (
    <div className="animate-in">
      {/* Backdrop */}
      <div className="relative -mx-4 -mt-6 mb-6 h-[300px] overflow-hidden sm:-mx-6 sm:h-[380px]">
        <img src={movie.backdrop_url || ""} alt="" className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/60 to-transparent" />
      </div>

      <div className="grid gap-6 md:grid-cols-[220px_1fr]">
        <img
          src={movie.poster_url || PLACEHOLDER_POSTER}
          alt={movie.title}
          className="mx-auto -mt-24 w-40 rounded-xl shadow-2xl md:mx-0 md:w-full"
        />
        <div>
          <h1 className="text-3xl font-extrabold sm:text-4xl">{movie.title}</h1>
          <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-text-secondary">
            <StarRating value={movie.rating} />
            <span>{year(movie.release_date)}</span>
            <span>{runtimeLabel(movie.runtime)}</span>
            <span className="uppercase">{movie.language}</span>
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {movie.genres.map((g) => (
              <span key={g.id} className="rounded-full bg-chip px-3 py-1 text-xs text-text-secondary">
                {g.name}
              </span>
            ))}
          </div>
          <p className="mt-4 max-w-2xl text-text-secondary">{movie.overview}</p>
          {movie.director && (
            <p className="mt-3 text-sm">
              <span className="text-muted">Director: </span>
              <span className="font-medium">{movie.director.name}</span>
            </p>
          )}

          <div className="mt-5 flex flex-wrap gap-3">
            {movie.trailer_url && (
              <a href={movie.trailer_url} target="_blank" rel="noreferrer">
                <Button><Play size={18} className="fill-white" /> Watch Trailer</Button>
              </a>
            )}
            <Button variant="secondary" onClick={toggleFav}>
              <Heart size={18} className={faved ? "fill-primary text-primary" : ""} />
              {faved ? "Liked" : "Like"}
            </Button>
            <Button variant="secondary" onClick={toggleList}>
              <Bookmark size={18} className={listed ? "fill-white" : ""} />
              {listed ? "In Watchlist" : "Watchlist"}
            </Button>
            {isAuthenticated && (
              <CollectionPickerButton
                movie={{
                  imdbID: movie.id,
                  Title: movie.title,
                  Year: String(year(movie.release_date)),
                  Poster: movie.poster_url || "",
                }}
                genre={movie.genres.map((g) => g.name).join(", ")}
                size="lg"
                variant="secondary"
              />
            )}
            <Button variant="ghost" onClick={share}><Share2 size={18} /> Share</Button>
          </div>
        </div>
      </div>

      {/* Cast */}
      {movie.cast.length > 0 && (
        <section className="mt-10">
          <h2 className="mb-3 text-xl font-bold">Cast</h2>
          <div className="flex flex-wrap gap-3">
            {movie.cast.map((c) => (
              <div key={c.id} className="rounded-lg bg-card px-4 py-2 text-sm">
                {c.name}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Reviews */}
      <ReviewsSection movieId={movie.id} reviews={reviews} setReviews={setReviews} userId={user?.id} />

      {/* Related */}
      {related.length > 0 && (
        <section className="mt-10">
          <h2 className="mb-3 text-xl font-bold">Related Movies</h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5">
            {related.map((m, index) => (
              <ScrollReveal key={m.id} delay={(index % 5) * 55}>
                <MovieCard movie={m} />
              </ScrollReveal>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function ReviewsSection({
  movieId,
  reviews,
  setReviews,
  userId,
}: {
  movieId: string;
  reviews: Review[];
  setReviews: (r: Review[]) => void;
  userId?: string;
}) {
  const { isAuthenticated } = useAuth();
  const mine = reviews.find((r) => r.user_id === userId);
  const normalizedMineRating = Math.round(ratingOutOf5(mine?.rating) ?? 4);
  const [rating, setRating] = useState(normalizedMineRating);
  const [comment, setComment] = useState(mine?.comment || "");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setRating(normalizedMineRating);
    setComment(mine?.comment || "");
  }, [mine?.id, mine?.rating, mine?.comment, normalizedMineRating]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      if (mine) {
        const updated = await reviewsApi.update(mine.id, rating, comment);
        setReviews(reviews.map((r) => (r.id === mine.id ? updated : r)));
        toast.success("Review updated");
      } else {
        const created = await reviewsApi.create(movieId, rating, comment);
        setReviews([created, ...reviews]);
        toast.success("Review posted");
      }
    } catch (err: any) {
      toast.error(err.response?.data?.detail || "Could not save review");
    } finally {
      setSaving(false);
    }
  }

  async function remove() {
    if (!mine) return;
    await reviewsApi.remove(mine.id);
    setReviews(reviews.filter((r) => r.id !== mine.id));
    setComment("");
    toast.success("Review deleted");
  }

  return (
    <section className="mt-10">
      <h2 className="mb-3 text-xl font-bold">Reviews ({reviews.length})</h2>

      {isAuthenticated && (
        <form onSubmit={submit} className="mb-6 rounded-xl bg-card p-4">
          <div className="mb-3 flex items-center gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <button key={i} type="button" onClick={() => setRating(i + 1)} aria-label={`rate ${i + 1}`}>
                <Star
                  size={20}
                  className={i < rating ? "fill-rating text-rating" : "text-disabled"}
                />
              </button>
            ))}
            <span className="ml-2 text-sm text-muted">{rating}/5</span>
          </div>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Share your thoughts..."
            rows={3}
            className="w-full rounded-lg border border-border bg-surface p-3 text-sm outline-none focus:border-primary"
          />
          <div className="mt-3 flex gap-2">
            <Button type="submit" loading={saving}>{mine ? "Update review" : "Post review"}</Button>
            {mine && (
              <Button type="button" variant="ghost" onClick={remove} className="text-red-400">
                Delete
              </Button>
            )}
          </div>
        </form>
      )}

      <div className="space-y-3">
        {reviews.length === 0 && <p className="text-sm text-muted">No reviews yet.</p>}
        {reviews.map((r) => (
          <div key={r.id} className="rounded-xl bg-card p-4">
            <div className="flex items-center justify-between">
              <span className="font-semibold">{r.user_name || "User"}</span>
              <StarRating value={r.rating} />
            </div>
            {r.comment && <p className="mt-2 text-sm text-text-secondary">{r.comment}</p>}
          </div>
        ))}
      </div>
    </section>
  );
}
