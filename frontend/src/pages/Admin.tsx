import { Film, LayoutDashboard, Star, Trash2, Users } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { adminApi, moviesApi } from "../api/movieverse";
import type { AdminStats, AdminUser, Movie, Review } from "../api/types";
import { PageLoader, StarRating } from "../components/ui";

const TABS = [
  { key: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { key: "users", label: "Users", icon: Users },
  { key: "movies", label: "Movies", icon: Film },
  { key: "reviews", label: "Reviews", icon: Star },
] as const;

export default function Admin() {
  const [tab, setTab] = useState<(typeof TABS)[number]["key"]>("dashboard");

  return (
    <div>
      <h1 className="mb-5 text-2xl font-bold">Admin Console</h1>
      <div className="mb-6 flex flex-wrap gap-2 border-b border-border pb-3">
        {TABS.map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
              tab === key ? "gradient-primary text-white" : "bg-chip text-text-secondary hover:bg-chip-hover"
            }`}
          >
            <Icon size={16} /> {label}
          </button>
        ))}
      </div>

      {tab === "dashboard" && <Dashboard />}
      {tab === "users" && <UsersTab />}
      {tab === "movies" && <MoviesTab />}
      {tab === "reviews" && <ReviewsTab />}
    </div>
  );
}

function Dashboard() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  useEffect(() => {
    adminApi.stats().then(setStats).catch(() => {});
  }, []);
  if (!stats) return <PageLoader />;
  const cards = [
    ["Total Users", stats.total_users],
    ["Total Reviews", stats.total_reviews],
    ["Total Favorites", stats.total_favorites],
    ["Most Searched", stats.most_searched_movie || "—"],
    ["Total Movies", stats.total_movies],
    ["Genres", stats.total_genres],
    ["Actors", stats.total_actors],
    ["Directors", stats.total_directors],
    ["Trending", stats.trending_movies],
  ] as const;
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
      {cards.map(([label, value]) => (
        <div key={label} className="rounded-xl bg-card p-5">
          <p className="text-3xl font-extrabold text-gradient">{value}</p>
          <p className="mt-1 text-sm text-muted">{label}</p>
        </div>
      ))}
    </div>
  );
}

function UsersTab() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    setLoading(true);
    const t = setTimeout(() => {
      adminApi.users(search.trim() || undefined).then(setUsers).finally(() => setLoading(false));
    }, 300);
    return () => clearTimeout(t);
  }, [search]);

  async function toggle(u: AdminUser) {
    try {
      await adminApi.setBlock(u.id, !u.is_blocked);
      setUsers((prev) => prev.map((x) => (x.id === u.id ? { ...x, is_blocked: !x.is_blocked } : x)));
      toast.success(u.is_blocked ? "User unblocked" : "User blocked");
    } catch {
      toast.error("Action failed");
    }
  }

  return (
    <div>
      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search users by name or email..."
        className="mb-4 w-full max-w-sm rounded-lg border border-border bg-surface px-3 py-2 text-sm outline-none focus:border-primary"
      />
      {loading ? (
        <PageLoader />
      ) : (
        <div className="overflow-x-auto rounded-xl bg-card">
          <table className="w-full text-left text-sm">
        <thead className="border-b border-border text-muted">
          <tr>
            <th className="p-3">Name</th>
            <th className="p-3">Email</th>
            <th className="p-3">Role</th>
            <th className="p-3">Status</th>
            <th className="p-3"></th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id} className="border-b border-border/50">
              <td className="p-3 font-medium">{u.full_name}</td>
              <td className="p-3 text-text-secondary">{u.email}</td>
              <td className="p-3">{u.is_admin ? "Admin" : "User"}</td>
              <td className="p-3">
                <span className={u.is_blocked ? "text-red-400" : "text-green-400"}>
                  {u.is_blocked ? "Blocked" : "Active"}
                </span>
              </td>
              <td className="p-3">
                {!u.is_admin && (
                  <button onClick={() => toggle(u)} className="rounded-md bg-chip px-3 py-1 text-xs hover:bg-chip-hover">
                    {u.is_blocked ? "Unblock" : "Block"}
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
        </div>
      )}
    </div>
  );
}

function MoviesTab() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    moviesApi.list({ page_size: 60 }).then(setMovies).finally(() => setLoading(false));
  }, []);

  async function del(m: Movie) {
    if (!confirm(`Delete "${m.title}"?`)) return;
    try {
      await adminApi.deleteMovie(m.id);
      setMovies((prev) => prev.filter((x) => x.id !== m.id));
      toast.success("Movie deleted");
    } catch {
      toast.error("Delete failed");
    }
  }

  if (loading) return <PageLoader />;
  return (
    <div className="space-y-2">
      {movies.map((m) => (
        <div key={m.id} className="flex items-center gap-3 rounded-xl bg-card p-3">
          <img src={m.poster_url || ""} className="h-14 w-10 rounded object-cover" alt="" />
          <div className="flex-1">
            <p className="font-medium">{m.title}</p>
            <p className="text-xs text-muted">{m.genres.map((g) => g.name).join(", ")}</p>
          </div>
          <StarRating value={m.rating} />
          <button onClick={() => del(m)} className="rounded-md p-2 text-red-400 hover:bg-chip">
            <Trash2 size={16} />
          </button>
        </div>
      ))}
    </div>
  );
}

function ReviewsTab() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminApi.reviews().then(setReviews).finally(() => setLoading(false));
  }, []);

  async function del(id: string) {
    if (!confirm("Delete this review? This cannot be undone.")) return;
    try {
      await adminApi.deleteReview(id);
      setReviews((prev) => prev.filter((x) => x.id !== id));
      toast.success("Review removed");
    } catch {
      toast.error("Delete failed");
    }
  }

  if (loading) return <PageLoader />;
  return (
    <div className="space-y-2">
      {reviews.length === 0 && <p className="text-muted">No reviews yet.</p>}
      {reviews.map((r) => (
        <div key={r.id} className="flex items-start justify-between rounded-xl bg-card p-4">
          <div>
            <p className="font-medium">{r.user_name || "User"}</p>
            {r.comment && <p className="mt-1 text-sm text-text-secondary">{r.comment}</p>}
          </div>
          <div className="flex items-center gap-3">
            <StarRating value={r.rating} />
            <button onClick={() => del(r.id)} className="rounded-md p-2 text-red-400 hover:bg-chip">
              <Trash2 size={16} />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
