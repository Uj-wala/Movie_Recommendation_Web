import {
  Bookmark,
  CheckCircle2,
  Compass,
  FolderHeart,
  Heart,
  Search,
  Star,
  Trophy,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  dashboardApi,
  type DashboardStats,
  type GenreCount,
  type MonthlyCount,
  type RecentActivity,
} from "../api/movieverse";
import { omdbPoster } from "../lib/omdb";

const CHART_COLORS = ["#C63D82", "#7C3AED", "#2563EB", "#0EA5E9", "#10B981"];
const PIE_COLORS = { watchlist: "#C63D82", watched: "#4CAF50" };
const AXIS = { fill: "#A6A6A6", fontSize: 12 };
const TOOLTIP_STYLE = {
  background: "#1D1A24",
  border: "1px solid #2A2633",
  borderRadius: 8,
  color: "#FFFFFF",
};

const showToast = (message: string) => toast.error(message);

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [genres, setGenres] = useState<GenreCount[]>([]);
  const [monthly, setMonthly] = useState<MonthlyCount[]>([]);
  const [recent, setRecent] = useState<RecentActivity | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    async function loadDashboard() {
      const [statsResult, genreResult, monthlyResult, recentResult] = await Promise.allSettled([
        dashboardApi.stats(),
        dashboardApi.genres(),
        dashboardApi.monthly(),
        dashboardApi.recent(),
      ]);

      if (!active) return;

      if (statsResult.status === "fulfilled") {
        setStats(statsResult.value);
      } else {
        showToast("Could not load dashboard stats.");
      }

      if (genreResult.status === "fulfilled") {
        setGenres(genreResult.value);
      } else {
        showToast("Could not load dashboard genres.");
      }

      if (monthlyResult.status === "fulfilled") {
        setMonthly(monthlyResult.value);
      }

      if (recentResult.status === "fulfilled") {
        setRecent(recentResult.value);
      }

      setLoading(false);
    }

    loadDashboard();
    return () => {
      active = false;
    };
  }, []);

  if (loading) return <DashboardSkeleton />;
  if (!stats) return null;

  const isEmpty =
    stats.watched_count +
      stats.favorites_count +
      stats.watchlist_count +
      stats.reviews_count +
      stats.total_searches ===
    0;
  if (isEmpty) return <EmptyState />;

  const cards = [
    { label: "Movies Watched", value: stats.watched_count, icon: CheckCircle2 },
    { label: "Favorites", value: stats.favorites_count, icon: Heart },
    { label: "Watchlist Items", value: stats.watchlist_count, icon: Bookmark },
    { label: "Reviews Written", value: stats.reviews_count, icon: Star },
    { label: "Collections", value: stats.collections_count, icon: FolderHeart },
    { label: "Searches Made", value: stats.total_searches, icon: Search },
  ];

  const pieData = [
    { name: "Watchlist", value: stats.watchlist_count, key: "watchlist" as const },
    { name: "Watched", value: stats.watched_count, key: "watched" as const },
  ];

  return (
    <div className="animate-in space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold">Your Dashboard</h1>
        {genres[0] && (
          <span className="inline-flex items-center gap-2 rounded-full bg-card px-4 py-1.5 text-sm">
            <Trophy size={16} className="text-gold" /> Most watched:{" "}
            <span className="font-semibold text-primary">{genres[0].genre}</span>
          </span>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map(({ label, value, icon: Icon }) => (
          <div key={label} className="flex items-center gap-4 rounded-2xl bg-card p-5">
            <span className="grid h-12 w-12 place-items-center rounded-xl bg-primary/15 text-primary">
              <Icon size={22} />
            </span>
            <div>
              <p className="text-2xl font-bold">
                <CountUp value={value} />
              </p>
              <p className="text-sm text-muted">{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <ChartCard title="Top Watched Genres">
          {genres.length === 0 ? (
            <ChartEmpty text="Watch movies to see your top genres." />
          ) : (
            <div className="bar-grow">
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={genres} margin={{ left: -20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#2A2633" />
                  <XAxis dataKey="genre" tick={AXIS} />
                  <YAxis allowDecimals={false} tick={AXIS} />
                  <Tooltip contentStyle={TOOLTIP_STYLE} cursor={{ fill: "#ffffff10" }} />
                  <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                    {genres.map((_, i) => (
                      <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </ChartCard>

        <ChartCard title="Movies Watched (Last 6 Months)">
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={monthly} margin={{ left: -20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2A2633" />
              <XAxis dataKey="month" tick={AXIS} />
              <YAxis allowDecimals={false} tick={AXIS} />
              <Tooltip contentStyle={TOOLTIP_STYLE} cursor={{ stroke: "#C63D82" }} />
              <Line
                type="monotone"
                dataKey="count"
                stroke="#C63D82"
                strokeWidth={2}
                dot={{ fill: "#C63D82", r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Watchlist vs Watched">
          {stats.watchlist_count + stats.watched_count === 0 ? (
            <ChartEmpty text="No watchlist or watched movies yet." />
          ) : (
            <div className="pie-rotate pop">
              <ResponsiveContainer width="100%" height={260}>
                <PieChart>
                  <Pie
                    data={pieData}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={55}
                    outerRadius={90}
                    paddingAngle={3}
                    label={(e) => `${e.name}: ${e.value}`}
                  >
                    {pieData.map((d) => (
                      <Cell key={d.key} fill={PIE_COLORS[d.key]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={TOOLTIP_STYLE} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </ChartCard>
      </div>

      {/* Recent activity */}
      {recent && (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <ActivityCard title="Recently Watched">
            {recent.recent_watched.length === 0 ? (
              <ActivityEmpty />
            ) : (
              recent.recent_watched.map((m, i) => (
                <PosterRow
                  key={i}
                  poster={m.poster}
                  title={m.title}
                  sub={new Date(m.watched_date).toLocaleDateString()}
                />
              ))
            )}
          </ActivityCard>

          <ActivityCard title="Recent Favorites">
            {recent.recent_favorites.length === 0 ? (
              <ActivityEmpty />
            ) : (
              recent.recent_favorites.map((m, i) => (
                <PosterRow key={i} poster={m.poster} title={m.title} />
              ))
            )}
          </ActivityCard>

          <ActivityCard title="Recent Reviews">
            {recent.recent_reviews.length === 0 ? (
              <ActivityEmpty />
            ) : (
              recent.recent_reviews.map((r, i) => (
                <div key={i} className="flex items-center justify-between gap-2 py-2">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{r.movie_title}</p>
                    <p className="text-xs text-muted">
                      {new Date(r.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <span className="inline-flex shrink-0 items-center gap-1 text-rating">
                    <Star size={14} className="fill-rating" /> {r.rating}
                  </span>
                </div>
              ))
            )}
          </ActivityCard>
        </div>
      )}
    </div>
  );
}

/** Cheap count-up: eases from 0 to value over ~0.8s. */
function CountUp({ value }: { value: number }) {
  const [n, setN] = useState(0);
  useEffect(() => {
    if (value === 0) return setN(0);
    let raf = 0;
    const start = performance.now();
    const tick = (t: number) => {
      const p = Math.min((t - start) / 800, 1);
      setN(Math.round((1 - Math.pow(1 - p, 3)) * value));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value]);
  return <>{n}</>;
}

function ChartCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="scale-in rounded-2xl bg-card p-5">
      <h2 className="mb-4 font-semibold">{title}</h2>
      {children}
    </div>
  );
}

function ChartEmpty({ text }: { text: string }) {
  return <div className="grid h-[260px] place-items-center text-sm text-muted">{text}</div>;
}

function ActivityCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl bg-card p-5">
      <h2 className="mb-3 font-semibold">{title}</h2>
      <div className="divide-y divide-border">{children}</div>
    </div>
  );
}

function ActivityEmpty() {
  return <p className="py-6 text-center text-sm text-muted">Nothing here yet.</p>;
}

function PosterRow({ poster, title, sub }: { poster: string | null; title: string; sub?: string }) {
  return (
    <div className="flex items-center gap-3 py-2">
      <img
        src={omdbPoster(poster || undefined)}
        alt={title}
        loading="lazy"
        className="h-14 w-10 shrink-0 rounded object-cover"
      />
      <div className="min-w-0">
        <p className="truncate text-sm font-medium">{title}</p>
        {sub && <p className="text-xs text-muted">{sub}</p>}
      </div>
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="animate-in space-y-6">
      <div className="skeleton h-8 w-48 rounded" />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="skeleton h-24 rounded-2xl" />
        ))}
      </div>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="skeleton h-[320px] rounded-2xl" />
        ))}
      </div>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="skeleton h-48 rounded-2xl" />
        ))}
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="animate-in rounded-2xl border border-border bg-card p-12 text-center">
      <div className="mx-auto mb-3 text-5xl">📊</div>
      <p className="text-xl font-bold">Welcome!</p>
      <p className="mx-auto mt-1 max-w-md text-sm text-muted">
        Start watching movies to unlock your personal dashboard of stats, charts, and activity.
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
