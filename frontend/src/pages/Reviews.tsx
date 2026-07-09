import { Star } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { reviewsApi } from "../api/movieverse";
import type { Review } from "../api/types";
import { PageLoader, StarRating } from "../components/ui";

export default function Reviews() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    reviewsApi.mine().then(setReviews).finally(() => setLoading(false));
  }, []);

  async function remove(id: string) {
    await reviewsApi.remove(id);
    setReviews((r) => r.filter((x) => x.id !== id));
    toast.success("Review deleted");
  }

  if (loading) return <PageLoader />;

  return (
    <div>
      <h1 className="mb-5 flex items-center gap-2 text-2xl font-bold">
        <Star className="text-primary" /> My Reviews
      </h1>
      {reviews.length === 0 ? (
        <p className="py-12 text-center text-muted">
          You haven't reviewed any movies yet.{" "}
          <Link to="/movies" className="text-primary hover:underline">Browse movies</Link>
        </p>
      ) : (
        <div className="space-y-3">
          {reviews.map((r) => (
            <div key={r.id} className="flex items-start justify-between rounded-xl bg-card p-4">
              <div>
                <Link to={`/movie/${r.movie_id}`} className="font-semibold hover:text-primary">
                  Review
                </Link>
                {r.comment && <p className="mt-1 text-sm text-text-secondary">{r.comment}</p>}
              </div>
              <div className="flex items-center gap-4">
                <StarRating value={r.rating} />
                <button onClick={() => remove(r.id)} className="text-sm text-red-400 hover:underline">
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
