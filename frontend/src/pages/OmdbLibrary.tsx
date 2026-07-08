import { Compass, Heart } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import OmdbMovieCard from "../components/OmdbMovieCard";
import { Chip } from "../components/ui";
import { useWatchlist, type SavedMovie } from "../context/WatchlistContext";

type Tab = "favorites" | "watchlist";
type Sort = "recent" | "title" | "year";

export default function OmdbLibrary() {
  const { favorites, watchlist } = useWatchlist();
  const [tab, setTab] = useState<Tab>("favorites");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<Sort>("recent");

  const source = tab === "favorites" ? favorites : watchlist;

  // Context stores newest-first, so "recent" needs no re-sort.
  const movies = [...source]
    .filter((m) => m.Title.toLowerCase().includes(search.trim().toLowerCase()))
    .sort((a: SavedMovie, b: SavedMovie) =>
      sort === "title"
        ? a.Title.localeCompare(b.Title)
        : sort === "year"
        ? (b.Year || "").localeCompare(a.Year || "")
        : 0
    );

  return (
    <div>
      <h1 className="mb-5 flex items-center gap-2 text-2xl font-bold">
        <Heart className="text-primary" /> My List
      </h1>

      {/* Tabs */}
      <div className="mb-5 flex gap-2">
        <Chip active={tab === "favorites"} onClick={() => setTab("favorites")}>
          Favorites ({favorites.length})
        </Chip>
        <Chip active={tab === "watchlist"} onClick={() => setTab("watchlist")}>
          Watchlist ({watchlist.length})
        </Chip>
      </div>

      {source.length > 0 && (
        <div className="mb-6 flex flex-wrap items-center gap-3">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search your list..."
            className="flex-1 rounded-lg border border-border bg-surface px-3 py-2 text-sm outline-none focus:border-primary sm:max-w-xs"
          />
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as Sort)}
            className="rounded-lg border border-border bg-surface px-3 py-2 text-sm outline-none focus:border-primary"
          >
            <option value="recent">Recently Added</option>
            <option value="title">Title (A–Z)</option>
            <option value="year">Newest</option>
          </select>
        </div>
      )}

      {source.length === 0 ? (
        <EmptyState tab={tab} />
      ) : movies.length === 0 ? (
        <p className="py-12 text-center text-muted">No matches for "{search}".</p>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {movies.map((m) => (
            <OmdbMovieCard key={m.imdbID} movie={m} />
          ))}
        </div>
      )}
    </div>
  );
}

function EmptyState({ tab }: { tab: Tab }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-12 text-center">
      <Heart size={40} className="mx-auto mb-3 text-primary" />
      <p className="text-lg font-semibold">
        No {tab === "favorites" ? "favorite" : "watchlist"} movies yet
      </p>
      <p className="mt-1 text-sm text-muted">
        Start exploring movies and add them to your {tab}.
      </p>
      <Link
        to="/explore"
        className="mt-5 inline-flex items-center gap-2 rounded-lg gradient-primary px-5 py-2.5 font-semibold text-white transition-transform hover:scale-105"
      >
        <Compass size={18} /> Explore Movies
      </Link>
    </div>
  );
}
