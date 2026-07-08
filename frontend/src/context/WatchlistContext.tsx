import { createContext, useContext, useEffect, useState } from "react";
import type { OmdbSearchItem } from "../api/movieverse";

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

// ponytail: localStorage is the source of truth for OMDb saves. Backend sync is
// a separate concern — the DB watchlist is keyed to internal movie ids, not imdb.
export function WatchlistProvider({ children }: { children: React.ReactNode }) {
  const [watchlist, setWatchlist] = useState<SavedMovie[]>(() => load("omdb_watchlist"));
  const [favorites, setFavorites] = useState<SavedMovie[]>(() => load("omdb_favorites"));

  useEffect(() => {
    localStorage.setItem("omdb_watchlist", JSON.stringify(watchlist));
  }, [watchlist]);
  useEffect(() => {
    localStorage.setItem("omdb_favorites", JSON.stringify(favorites));
  }, [favorites]);

  const setters = { watchlist: setWatchlist, favorites: setFavorites };
  const lists = { watchlist, favorites };

  const has = (list: List, id: string) => lists[list].some((m) => m.imdbID === id);

  const toggle = (list: List, movie: SavedMovie) => {
    setters[list]((prev) =>
      prev.some((m) => m.imdbID === movie.imdbID)
        ? prev.filter((m) => m.imdbID !== movie.imdbID)
        : [pick(movie), ...prev]
    );
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
