import { useNavigate } from "react-router-dom";
import type { SavedMovie } from "../context/WatchlistContext";
import { omdbPoster } from "../lib/omdb";
import OmdbSaveButtons from "./OmdbSaveButtons";

/** Reusable poster card for OMDb movies. Navigates to the details page on click;
 *  the hover overlay carries the favorite/watchlist toggles. */
export default function OmdbMovieCard({ movie }: { movie: SavedMovie }) {
  const navigate = useNavigate();
  return (
    <div
      onClick={() => navigate(`/omdb/movie/${movie.imdbID}`)}
      className="group animate-in cursor-pointer overflow-hidden rounded-xl bg-card transition-transform hover:-translate-y-1"
    >
      <div className="relative aspect-[2/3] overflow-hidden">
        <img
          src={omdbPoster(movie.Poster)}
          alt={movie.Title}
          loading="lazy"
          className="h-full w-full object-cover transition-transform group-hover:scale-105"
        />
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
