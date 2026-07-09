import { Bookmark, Check, Heart } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useWatchlist, type SavedMovie } from "../context/WatchlistContext";
import CollectionPickerButton from "./CollectionPickerButton";

/** Watchlist + favorite + watched buttons for an OMDb movie. Watchlist/favorites
 *  are backed by localStorage; watched history is backend-only (auth required). */
export default function OmdbSaveButtons({
  movie,
  size = "sm",
  genre = null,
  imdbRating = null,
}: {
  movie: SavedMovie;
  size?: "sm" | "lg";
  genre?: string | null;
  imdbRating?: number | null;
}) {
  const { isAuthenticated } = useAuth();
  const { has, toggle, markWatched } = useWatchlist();
  const inWatch = has("watchlist", movie.imdbID);
  const inFav = has("favorites", movie.imdbID);
  const watched = has("watched", movie.imdbID);
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
      {isAuthenticated && <CollectionPickerButton movie={movie} genre={genre} size={size} />}
      {isAuthenticated && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            if (!watched) markWatched(movie, { genre, imdb_rating: imdbRating });
          }}
          disabled={watched}
          aria-label="Mark as watched"
          title={watched ? "Watched" : "Mark as watched"}
          className={`grid place-items-center rounded-full text-sm font-medium transition-colors ${dim} ${
            watched
              ? "bg-watched text-white cursor-default"
              : "bg-black/60 text-white hover:bg-black/80"
          }`}
        >
          <Check size={icon} />
          {size === "lg" && (watched ? "Watched" : "Mark Watched")}
        </button>
      )}
    </div>
  );
}
