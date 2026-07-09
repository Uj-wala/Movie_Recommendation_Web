import {
  Bell,
  Bookmark,
  CheckCircle2,
  Clapperboard,
  Film,
  Flame,
  FolderHeart,
  Heart,
  Home,
  LayoutDashboard,
  ListVideo,
  LogOut,
  Menu,
  Search,
  Settings,
  Shapes,
  Star,
  User,
  X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { catalogApi, notificationsApi } from "../api/movieverse";
import type { Notification } from "../api/types";
import { useAuth } from "../context/AuthContext";
import { useWatchlist } from "../context/WatchlistContext";
import { PLACEHOLDER_POSTER } from "../lib/format";
import CompareTray from "./CompareTray";
import ThemeToggle from "./ThemeToggle";

const NAV = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/", label: "Home", icon: Home, end: true },
  { to: "/movies", label: "Movies", icon: Film },
  { to: "/explore", label: "Explore (OMDb)", icon: Search },
  { to: "/genres", label: "Genres", icon: Shapes },
  { to: "/trending", label: "Trending", icon: Flame },
  { to: "/watchlist", label: "Watchlist", icon: ListVideo },
  { to: "/watched", label: "Watched History", icon: CheckCircle2 },
  { to: "/favorites", label: "Favorites", icon: Heart },
  { to: "/collections", label: "Collections", icon: FolderHeart },
  { to: "/my-list", label: "My List", icon: Bookmark },
  { to: "/reviews", label: "Reviews", icon: Star },
  { to: "/profile", label: "Profile", icon: User },
  { to: "/settings", label: "Settings", icon: Settings },
];

export default function Layout() {
  const { user, logout } = useAuth();
  const { favorites } = useWatchlist();
  const favCount = favorites.length;
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-bg">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-64 transform flex-col border-r border-border bg-sidebar transition-transform duration-200 lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-16 shrink-0 items-center gap-2 px-5">
          <Clapperboard className="text-primary" />
          <span className="text-lg font-extrabold">
            Movie<span className="text-gradient">Verse</span> AI
          </span>
          <button
            className="ml-auto lg:hidden"
            onClick={() => setSidebarOpen(false)}
            aria-label="close menu"
          >
            <X size={20} />
          </button>
        </div>
        <nav className="flex min-h-0 flex-1 flex-col gap-1 overflow-y-auto px-3 pb-8 pt-4">
          {NAV.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                  isActive
                    ? "gradient-primary text-white"
                    : "text-text-secondary hover:bg-chip hover:text-text"
                }`
              }
            >
              <Icon size={18} />
              {label}
              {to === "/my-list" && favCount > 0 && (
                <span className="ml-auto rounded-full bg-primary px-2 py-0.5 text-xs font-bold text-white">
                  {favCount}
                </span>
              )}
            </NavLink>
          ))}
          {user?.is_admin && (
            <NavLink
              to="/admin"
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                  isActive ? "gradient-primary text-white" : "text-text-secondary hover:bg-chip hover:text-text"
                }`
              }
            >
              <LayoutDashboard size={18} />
              Admin
            </NavLink>
          )}
          <button
            onClick={() => {
              logout();
              navigate("/login");
            }}
            className="mt-2 flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-text-secondary transition-colors hover:bg-chip hover:text-text"
          >
            <LogOut size={18} />
            Logout
          </button>
        </nav>
      </aside>

      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/60 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main */}
      <div className="lg:pl-64">
        <Header onMenu={() => setSidebarOpen(true)} />
        <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
          <Outlet />
        </main>
        <CompareTray />
      </div>
    </div>
  );
}

function Header({ onMenu }: { onMenu: () => void }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any>(null);
  const [showResults, setShowResults] = useState(false);
  const [notifs, setNotifs] = useState<Notification[]>([]);
  const [showNotifs, setShowNotifs] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const boxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    notificationsApi.list().then(setNotifs).catch(() => {});
  }, []);

  async function markAllRead() {
    setNotifs((prev) => prev.map((n) => ({ ...n, is_read: true })));
    notificationsApi.markAllRead().catch(() => {});
  }

  function readOne(n: Notification) {
    if (n.is_read) return;
    setNotifs((prev) => prev.map((x) => (x.id === n.id ? { ...x, is_read: true } : x)));
    notificationsApi.markRead(n.id).catch(() => {});
  }

  useEffect(() => {
    if (query.trim().length < 1) {
      setResults(null);
      return;
    }
    const t = setTimeout(() => {
      catalogApi
        .search(query.trim())
        .then((r) => {
          setResults(r);
          setShowResults(true);
        })
        .catch(() => {});
    }, 250);
    return () => clearTimeout(t);
  }, [query]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (boxRef.current && !boxRef.current.contains(e.target as Node)) setShowResults(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const unread = notifs.filter((n) => !n.is_read).length;

  return (
    <header className="sticky top-0 z-20 flex min-h-16 flex-wrap items-center gap-3 border-b border-border bg-bg/80 px-4 py-2 backdrop-blur sm:grid sm:h-16 sm:grid-cols-[minmax(0,1fr)_minmax(0,42rem)_minmax(0,1fr)] sm:flex-nowrap sm:px-6 sm:py-0">
      <button className="order-1 shrink-0 justify-self-start lg:hidden" onClick={onMenu} aria-label="open menu">
        <Menu size={22} />
      </button>

      <div ref={boxRef} className="relative order-3 w-full min-w-0 sm:order-none sm:col-start-2">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (query.trim()) {
              navigate(`/search?q=${encodeURIComponent(query.trim())}`);
              setShowResults(false);
            }
          }}
          className="relative"
        >
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => results && setShowResults(true)}
            placeholder="Search movies, actors, directors..."
            className="w-full rounded-lg border border-border bg-surface py-2 pl-10 pr-4 text-sm outline-none focus:border-primary"
          />
        </form>
        {showResults && results && (
          <div className="absolute mt-2 max-h-96 w-full overflow-y-auto rounded-lg border border-border bg-card p-2 shadow-2xl">
            {results.movies?.length === 0 &&
            results.actors?.length === 0 &&
            results.directors?.length === 0 ? (
              <p className="p-3 text-sm text-muted">No results</p>
            ) : (
              <>
                {results.movies?.map((m: any) => (
                  <Link
                    key={m.id}
                    to={`/movie/${m.slug}`}
                    onClick={() => setShowResults(false)}
                    className="flex items-center gap-3 rounded-md p-2 hover:bg-chip"
                  >
                    <img
                      src={m.poster_url || PLACEHOLDER_POSTER}
                      className="h-12 w-8 rounded object-cover"
                      alt=""
                    />
                    <div>
                      <p className="text-sm font-medium">{m.title}</p>
                      <p className="text-xs text-muted">Movie</p>
                    </div>
                  </Link>
                ))}
                {[...(results.actors || []), ...(results.directors || [])].map((p: any) => (
                  <div key={p.id} className="flex items-center gap-3 rounded-md p-2 text-sm">
                    <User size={16} className="text-muted" />
                    {p.name}
                  </div>
                ))}
              </>
            )}
          </div>
        )}
      </div>

      {/* Right side buttons group */}
      <div className="order-2 ml-auto flex shrink-0 items-center gap-1 justify-self-end sm:order-none sm:col-start-3 sm:ml-0 sm:gap-2">
        <ThemeToggle />

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => {
              setShowNotifs((s) => !s);
              setShowMenu(false);
            }}
            className="relative rounded-lg p-2 hover:bg-chip"
            aria-label="notifications"
          >
            <Bell size={20} />
            {unread > 0 && (
              <span className="absolute -right-1 -top-1 grid h-4 min-w-4 place-items-center rounded-full bg-[#FF4D6D] px-1 text-[10px] font-bold text-white">
                {unread > 9 ? "9+" : unread}
              </span>
            )}
          </button>
        {showNotifs && (
          <div className="absolute right-0 mt-2 max-h-96 w-80 overflow-y-auto rounded-lg border border-border bg-card p-2 shadow-2xl">
            <div className="flex items-center justify-between px-2 py-1.5">
              <p className="text-sm font-semibold">Notifications</p>
              {unread > 0 && (
                <button onClick={markAllRead} className="text-xs text-primary hover:underline">
                  Mark all read
                </button>
              )}
            </div>
            {notifs.length === 0 ? (
              <div className="p-6 text-center">
                <Bell size={28} className="mx-auto mb-2 text-muted" />
                <p className="text-sm font-medium">You're all caught up!</p>
                <p className="text-xs text-muted">No new notifications.</p>
              </div>
            ) : (
              notifs.slice(0, 10).map((n) => (
                <button
                  key={n.id}
                  onClick={() => readOne(n)}
                  className={`block w-full rounded-md p-2 text-left hover:bg-chip ${
                    n.is_read ? "opacity-60" : "bg-chip/40"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {!n.is_read && <span className="h-2 w-2 shrink-0 rounded-full bg-[#FF4D6D]" />}
                    <p className="text-sm font-medium">{n.title}</p>
                  </div>
                  {n.message && <p className="ml-4 text-xs text-muted">{n.message}</p>}
                </button>
              ))
            )}
          </div>
        )}
        </div>

        {/* Profile */}
        <div className="relative">
          <button
            onClick={() => {
              setShowMenu((s) => !s);
              setShowNotifs(false);
            }}
            className="flex items-center gap-2 rounded-lg p-1 hover:bg-chip"
          >
            <span className="grid h-8 w-8 place-items-center overflow-hidden rounded-full gradient-primary text-sm font-bold">
              {user?.profile_image_url ? (
                <img src={user.profile_image_url} className="h-full w-full object-cover" alt="" />
              ) : (
                user?.full_name?.[0]?.toUpperCase() || "U"
              )}
            </span>
          </button>
          {showMenu && (
            <div className="absolute right-0 mt-2 w-52 rounded-lg border border-border bg-card p-2 shadow-2xl">
              <div className="border-b border-border px-3 py-2">
                <p className="truncate text-sm font-semibold">{user?.full_name}</p>
                <p className="truncate text-xs text-muted">{user?.email}</p>
              </div>
              <Link to="/profile" onClick={() => setShowMenu(false)} className="block rounded-md px-3 py-2 text-sm hover:bg-chip">
                Profile
              </Link>
              <Link to="/settings" onClick={() => setShowMenu(false)} className="block rounded-md px-3 py-2 text-sm hover:bg-chip">
                Settings
              </Link>
              <button
                onClick={() => {
                  logout();
                  toast.success("Signed out");
                  navigate("/login");
                }}
                className="block w-full rounded-md px-3 py-2 text-left text-sm text-red-400 hover:bg-chip"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
