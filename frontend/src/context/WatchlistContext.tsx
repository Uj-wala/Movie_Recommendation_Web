import { createContext, useContext, useEffect, useState } from "react";
import { watchedApi, watchlistApi, type OmdbSearchItem, type WatchedItem } from "../api/movieverse";
import { useAuth } from "./AuthContext";

/** Minimal saved shape — enough to render a card without re-fetching. */
export interface SavedMovie {
  imdbID: string;
  Title: string;
  Year: string;
  Poster: string;
}

type List = "watchlist" | "favorites" | "watched";

interface Ctx {
  watchlist: SavedMovie[];
  favorites: SavedMovie[];
  watched: WatchedItem[];
  watchedLoading: boolean;
  has: (list: List, id: string) => boolean;
  toggle: (list: "watchlist" | "favorites", movie: SavedMovie) => void;
  /** Mark watched (backend also drops it from the watchlist). */
  markWatched: (movie: SavedMovie, extra?: { genre?: string | null; imdb_rating?: number | null }) => void;
  removeWatched: (id: string) => void;
  moveBackToWatchlist: (item: WatchedItem) => void;
}

const WatchlistCtx = createContext<Ctx | null>(null);

const load = (key: string): SavedMovie[] => {
  try {
    return JSON.parse(localStorage.getItem(key) || "[]");
  } catch {
    return [];
  }
};

const pick = (m: OmdbSearchItem | SavedMovie): SavedMovie => ({
  imdbID: m.imdbID,
  Title: m.Title,
  Year: m.Year,
  Poster: m.Poster,
});

// Favorites live in localStorage. The watchlist is backend-persisted when the
// user is signed in (falling back to localStorage when logged out), so it
// syncs across devices. The has/toggle interface is identical either way.
export function WatchlistProvider({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  const [watchlist, setWatchlist] = useState<SavedMovie[]>(() => load("omdb_watchlist"));
  const [favorites, setFavorites] = useState<SavedMovie[]>(() => load("omdb_favorites"));
  const [watched, setWatched] = useState<WatchedItem[]>([]);
  const [watchedLoading, setWatchedLoading] = useState(false);

  // Load the watchlist + watched history from the backend on login.
  useEffect(() => {
    if (isAuthenticated) {
      watchlistApi
        .list()
        .then((items) =>
          setWatchlist(
            items.map((i) => ({
              imdbID: i.movie_id,
              Title: i.movie_title,
              Year: i.year || "",
              Poster: i.poster || "",
            }))
          )
        )
        .catch(() => {});
      setWatchedLoading(true);
      watchedApi
        .list()
        .then(setWatched)
        .catch(() => {})
        .finally(() => setWatchedLoading(false));
    } else {
      setWatchlist(load("omdb_watchlist"));
      setWatched([]);
    }
  }, [isAuthenticated]);

  // Keep a localStorage cache so the list survives reloads / offline.
  useEffect(() => {
    localStorage.setItem("omdb_watchlist", JSON.stringify(watchlist));
  }, [watchlist]);
  useEffect(() => {
    localStorage.setItem("omdb_favorites", JSON.stringify(favorites));
  }, [favorites]);

  const has = (list: List, id: string) =>
    list === "watched"
      ? watched.some((m) => m.movie_id === id)
      : (list === "watchlist" ? watchlist : favorites).some((m) => m.imdbID === id);

  const toggle = (list: "watchlist" | "favorites", movie: SavedMovie) => {
    const set = list === "watchlist" ? setWatchlist : setFavorites;
    const current = list === "watchlist" ? watchlist : favorites;
    const exists = current.some((m) => m.imdbID === movie.imdbID);

    // Optimistic UI update.
    set(exists ? current.filter((m) => m.imdbID !== movie.imdbID) : [pick(movie), ...current]);

    // Persist the watchlist to the backend when signed in (favorites stay local).
    if (list === "watchlist" && isAuthenticated) {
      if (exists) {
        watchlistApi.remove(movie.imdbID).catch(() => {});
      } else {
        watchlistApi
          .add({
            movie_id: movie.imdbID,
            movie_title: movie.Title,
            poster: movie.Poster || null,
            genre: null,
            year: movie.Year || null,
          })
          .catch(() => {});
      }
    }
  };

  const markWatched: Ctx["markWatched"] = (movie, extra) => {
    if (has("watched", movie.imdbID)) return;
    // Optimistic: add to watched, drop from watchlist (backend does the same).
    setWatched((prev) => [
      {
        id: `tmp-${movie.imdbID}`,
        movie_id: movie.imdbID,
        movie_title: movie.Title,
        poster: movie.Poster || null,
        genre: extra?.genre ?? null,
        imdb_rating: extra?.imdb_rating ?? null,
        watched_at: new Date().toISOString(),
      },
      ...prev,
    ]);
    setWatchlist((prev) => prev.filter((m) => m.imdbID !== movie.imdbID));

    watchedApi
      .mark({
        movie_id: movie.imdbID,
        movie_title: movie.Title,
        poster: movie.Poster || null,
        genre: extra?.genre ?? null,
        imdb_rating: extra?.imdb_rating ?? null,
      })
      // Swap the temp record for the real one (real id, server timestamp).
      .then((saved) =>
        setWatched((prev) => prev.map((m) => (m.movie_id === saved.movie_id ? saved : m)))
      )
      .catch(() => {});
  };

  const removeWatched = (id: string) => {
    const movieId = watched.find((m) => m.id === id)?.movie_id;
    setWatched((prev) => prev.filter((m) => m.id !== id));
    if (movieId) watchedApi.remove(movieId).catch(() => {});
  };

  const moveBackToWatchlist = (item: WatchedItem) => {
    setWatched((prev) => prev.filter((m) => m.id !== item.id));
    setWatchlist((prev) => [
      { imdbID: item.movie_id, Title: item.movie_title, Year: "", Poster: item.poster || "" },
      ...prev.filter((m) => m.imdbID !== item.movie_id),
    ]);
    watchedApi.moveToWatchlist(item.movie_id).catch(() => {});
  };

  return (
    <WatchlistCtx.Provider
      value={{ watchlist, favorites, watched, watchedLoading, has, toggle, markWatched, removeWatched, moveBackToWatchlist }}
    >
      {children}
    </WatchlistCtx.Provider>
  );
}

export function useWatchlist() {
  const c = useContext(WatchlistCtx);
  if (!c) throw new Error("useWatchlist must be used within WatchlistProvider");
  return c;
}
