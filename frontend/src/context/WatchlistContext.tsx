import { createContext, useContext, useEffect, useState } from "react";
import { watchlistApi, type OmdbSearchItem } from "../api/movieverse";
import { useAuth } from "./AuthContext";

/** Minimal saved shape — enough to render a card without re-fetching. */
export interface SavedMovie {
  imdbID: string;
  Title: string;
  Year: string;
  Poster: string;
}

type List = "watchlist" | "favorites";

interface Ctx {
  watchlist: SavedMovie[];
  favorites: SavedMovie[];
  has: (list: List, id: string) => boolean;
  toggle: (list: List, movie: SavedMovie) => void;
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

  // Load the watchlist from the backend on login; fall back to localStorage cache.
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
    } else {
      setWatchlist(load("omdb_watchlist"));
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
    (list === "watchlist" ? watchlist : favorites).some((m) => m.imdbID === id);

  const toggle = (list: List, movie: SavedMovie) => {
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

  return (
    <WatchlistCtx.Provider value={{ watchlist, favorites, has, toggle }}>
      {children}
    </WatchlistCtx.Provider>
  );
}

export function useWatchlist() {
  const c = useContext(WatchlistCtx);
  if (!c) throw new Error("useWatchlist must be used within WatchlistProvider");
  return c;
}
