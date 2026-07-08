import { Star, Trash2 } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  movieReviewsApi,
  type MovieReview,
} from "../api/movieverse";
import { useAuth } from "../context/AuthContext";
import { Button, Spinner } from "./ui";
import RatingStars from "./RatingStars";

export default function MovieReviews({ imdbId, title }: { imdbId: string; title: string }) {
  const { user, isAuthenticated } = useAuth();
  const [summary, setSummary] = useState({ average_rating: 0, total_reviews: 0 });
  const [reviews, setReviews] = useState<MovieReview[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(() => {
    setLoading(true);
    Promise.all([movieReviewsApi.rating(imdbId), movieReviewsApi.list(imdbId)])
      .then(([r, page]) => {
        setSummary(r);
        setReviews(page.data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [imdbId]);

  useEffect(() => {
    load();
  }, [load]);

  // One review per user — find the current user's (name match; backend enforces
  // real ownership on edit/delete, so this only controls which buttons show).
  const myReview = isAuthenticated
    ? reviews.find((r) => r.user_name === user?.full_name)
    : undefined;

  return (
    <section className="mt-10">
      <div className="mb-4 flex items-center gap-3">
        <h2 className="text-xl font-bold">Reviews</h2>
        {summary.total_reviews > 0 && (
          <span className="inline-flex items-center gap-1 text-sm text-muted">
            <Star size={15} className="fill-rating text-rating" />
            <span className="font-semibold text-text">{summary.average_rating.toFixed(1)}</span>
            / 5 · {summary.total_reviews} review{summary.total_reviews > 1 ? "s" : ""}
          </span>
        )}
      </div>

      {isAuthenticated ? (
        <ReviewForm imdbId={imdbId} title={title} existing={myReview} onSaved={load} />
      ) : (
        <p className="mb-6 text-sm text-muted">Sign in to leave a review.</p>
      )}

      {loading ? (
        <div className="grid place-items-center py-8">
          <Spinner />
        </div>
      ) : reviews.length === 0 ? (
        <div className="rounded-xl border border-border bg-card p-8 text-center">
          <p className="font-semibold">No Reviews Yet</p>
          <p className="mt-1 text-sm text-muted">Be the first person to review this movie.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {reviews.map((r) => (
            <ReviewCard key={r.id} review={r} mine={r.id === myReview?.id} onDeleted={load} />
          ))}
        </div>
      )}
    </section>
  );
}

function ReviewForm({
  imdbId,
  title,
  existing,
  onSaved,
}: {
  imdbId: string;
  title: string;
  existing?: MovieReview;
  onSaved: () => void;
}) {
  const [rating, setRating] = useState(existing?.rating || 0);
  const [text, setText] = useState(existing?.review || "");
  const [saving, setSaving] = useState(false);

  // Sync when the user's existing review loads/changes.
  useEffect(() => {
    setRating(existing?.rating || 0);
    setText(existing?.review || "");
  }, [existing?.id]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (rating < 1) return toast.error("Please select a rating");
    if (!text.trim()) return toast.error("Review cannot be empty");
    setSaving(true);
    try {
      if (existing) {
        await movieReviewsApi.update(existing.id, rating, text.trim());
        toast.success("Review updated");
      } else {
        await movieReviewsApi.add(imdbId, title, rating, text.trim());
        toast.success("Review added");
      }
      onSaved();
    } catch (err: any) {
      toast.error(err.response?.data?.detail || "Could not save review");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={submit} className="mb-6 rounded-xl border border-border bg-card p-4">
      <p className="mb-2 text-sm font-medium">{existing ? "Edit your review" : "Write a review"}</p>
      <RatingStars value={rating} onChange={setRating} size={24} />
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={3}
        placeholder="Share your thoughts..."
        className="mt-3 w-full resize-none rounded-lg border border-border bg-surface p-3 text-sm outline-none focus:border-primary"
      />
      <Button type="submit" loading={saving} className="mt-2">
        {existing ? "Update Review" : "Submit Review"}
      </Button>
    </form>
  );
}

function ReviewCard({
  review,
  mine,
  onDeleted,
}: {
  review: MovieReview;
  mine: boolean;
  onDeleted: () => void;
}) {
  const [deleting, setDeleting] = useState(false);

  async function remove() {
    setDeleting(true);
    try {
      await movieReviewsApi.remove(review.id);
      toast.success("Review deleted");
      onDeleted();
    } catch (err: any) {
      toast.error(err.response?.data?.detail || "Could not delete review");
      setDeleting(false);
    }
  }

  return (
    <div className="rounded-xl bg-card p-4">
      <div className="mb-1 flex items-center justify-between">
        <span className="font-semibold">{review.user_name}</span>
        <RatingStars value={review.rating} size={15} />
      </div>
      <p className="text-sm text-text-secondary">{review.review}</p>
      <div className="mt-2 flex items-center justify-between text-xs text-muted">
        <span>{new Date(review.created_at).toLocaleDateString()}</span>
        {mine && (
          <button
            onClick={remove}
            disabled={deleting}
            className="inline-flex items-center gap-1 text-red-400 hover:text-red-300 disabled:opacity-50"
          >
            <Trash2 size={13} /> Delete
          </button>
        )}
      </div>
    </div>
  );
}
