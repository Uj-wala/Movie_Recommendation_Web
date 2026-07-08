import { Bookmark, Heart } from "lucide-react";
import { useWatchlist, type SavedMovie } from "../context/WatchlistContext";

/** Watchlist + favorite toggle buttons for an OMDb movie, backed by localStorage. */
export default function OmdbSaveButtons({
  movie,
  size = "sm",
}: {
  movie: SavedMovie;
  size?: "sm" | "lg";
}) {
  const { has, toggle } = useWatchlist();
  const inWatch = has("watchlist", movie.imdbID);
  const inFav = has("favorites", movie.imdbID);
  const dim = size === "lg" ? "h-10 px-4 gap-2" : "h-8 w-8";
  const icon = size === "lg" ? 18 : 15;

  return (
    <div className="flex gap-2">
      <button
        onClick={(e) => {
          e.stopPropagation();
          toggle("watchlist", movie);
        }}
        aria-label="Toggle watchlist"
        className={`grid place-items-center rounded-full text-sm font-medium transition-colors ${dim} ${
          inWatch ? "gradient-primary text-white" : "bg-black/60 text-white hover:bg-black/80"
        }`}
      >
        <Bookmark size={icon} className={inWatch ? "fill-white" : ""} />
        {size === "lg" && (inWatch ? "In Watchlist" : "Watchlist")}
      </button>
      <button
        onClick={(e) => {
          e.stopPropagation();
          toggle("favorites", movie);
        }}
        aria-label="Toggle favorite"
        className={`grid place-items-center rounded-full text-sm font-medium transition-colors ${dim} ${
          inFav ? "bg-primary text-white" : "bg-black/60 text-white hover:bg-black/80"
        }`}
      >
        <Heart size={icon} className={inFav ? "fill-white" : ""} />
        {size === "lg" && (inFav ? "Favorited" : "Favorite")}
      </button>
    </div>
  );
}
