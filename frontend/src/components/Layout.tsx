import {
  Bell,
  Clapperboard,
  Film,
  Flame,
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
import { catalogApi, profileApi } from "../api/movieverse";
import type { Notification } from "../api/types";
import { useAuth } from "../context/AuthContext";
import { PLACEHOLDER_POSTER } from "../lib/format";
import ThemeToggle from "./ThemeToggle";

const NAV = [
  { to: "/", label: "Home", icon: Home, end: true },
  { to: "/movies", label: "Movies", icon: Film },
  { to: "/explore", label: "Explore (OMDb)", icon: Search },
  { to: "/genres", label: "Genres", icon: Shapes },
  { to: "/trending", label: "Trending", icon: Flame },
  { to: "/watchlist", label: "Watchlist", icon: ListVideo },
  { to: "/favorites", label: "Favorites", icon: Heart },
  { to: "/reviews", label: "Reviews", icon: Star },
  { to: "/profile", label: "Profile", icon: User },
  { to: "/settings", label: "Settings", icon: Settings },
];

export default function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-bg">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 transform border-r border-border bg-sidebar transition-transform duration-200 lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-16 items-center gap-2 px-5">
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
        <nav className="flex flex-col gap-1 px-3 py-4">
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
    profileApi.notifications().then(setNotifs).catch(() => {});
  }, []);

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
    <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b border-border bg-bg/80 px-4 backdrop-blur sm:px-6">
      <button className="lg:hidden" onClick={onMenu} aria-label="open menu">
        <Menu size={22} />
      </button>

      <div ref={boxRef} className="relative flex-1 max-w-xl">
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
            <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-primary" />
          )}
        </button>
        {showNotifs && (
          <div className="absolute right-0 mt-2 w-80 rounded-lg border border-border bg-card p-2 shadow-2xl">
            <p className="px-2 py-1.5 text-sm font-semibold">Notifications</p>
            {notifs.length === 0 ? (
              <p className="p-3 text-sm text-muted">You're all caught up</p>
            ) : (
              notifs.slice(0, 8).map((n) => (
                <div key={n.id} className="rounded-md p-2 hover:bg-chip">
                  <p className="text-sm font-medium">{n.title}</p>
                  {n.message && <p className="text-xs text-muted">{n.message}</p>}
                </div>
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
    </header>
  );
}
