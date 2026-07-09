import { useNavigate } from "react-router-dom";
import { GitCompare } from "lucide-react";
import { useCompare } from "../context/CompareContext";
import { useWatchlist, type SavedMovie } from "../context/WatchlistContext";
import { omdbPoster } from "../lib/omdb";
import OmdbSaveButtons from "./OmdbSaveButtons";
import WatchedBadge from "./WatchedBadge";

/** Reusable poster card for OMDb movies. Navigates to the details page on click;
 *  the hover overlay carries the favorite/watchlist toggles. */
export default function OmdbMovieCard({ movie }: { movie: SavedMovie }) {
  const navigate = useNavigate();
  const { has } = useWatchlist();
  const { isSelected, toggle } = useCompare();
  const selected = isSelected(movie.imdbID);
  return (
    <div
      onClick={() => navigate(`/omdb/movie/${movie.imdbID}`)}
      className="group movie-card-motion animate-in cursor-pointer overflow-hidden rounded-xl bg-card"
    >
      <div className="relative aspect-[2/3] overflow-hidden">
        <img
          src={omdbPoster(movie.Poster)}
          alt={movie.Title}
          loading="lazy"
          className="poster-motion h-full w-full object-cover"
        />
        {has("watched", movie.imdbID) && (
          <div className="absolute left-2 top-2">
            <WatchedBadge />
          </div>
        )}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            toggle({
              id: movie.imdbID,
              title: movie.Title,
              poster: movie.Poster || null,
              year: movie.Year || null,
              source: "omdb",
            });
          }}
          className={`absolute left-2 bottom-2 grid h-8 w-8 place-items-center rounded-full text-white opacity-100 transition-opacity sm:opacity-0 sm:group-hover:opacity-100 ${
            selected ? "gradient-primary opacity-100" : "bg-black/70 hover:bg-black/90"
          }`}
          aria-label={selected ? "Remove from compare" : "Add to compare"}
          title={selected ? "Remove from compare" : "Compare"}
        >
          <GitCompare size={15} />
        </button>
        <div className="absolute right-2 top-2 opacity-0 transition-opacity group-hover:opacity-100">
          <OmdbSaveButtons movie={movie} />
        </div>
      </div>
      <div className="p-3">
        <p className="truncate text-sm font-semibold">{movie.Title}</p>
        <p className="text-xs text-muted">{movie.Year}</p>
      </div>
    </div>
  );
}
