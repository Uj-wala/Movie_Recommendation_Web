import { GitCompare, Star } from "lucide-react";
import { Link } from "react-router-dom";
import type { Movie } from "../api/types";
import { useCompare } from "../context/CompareContext";
import { PLACEHOLDER_POSTER, year } from "../lib/format";

export default function MovieCard({ movie }: { movie: Movie }) {
  const { isSelected, toggle } = useCompare();
  const selected = isSelected(movie.id);

  return (
    <Link
      to={`/movie/${movie.slug}`}
      className="group relative block overflow-hidden rounded-xl bg-card transition-transform duration-200 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/40"
    >
      <div className="relative aspect-[2/3] overflow-hidden">
        <img
          src={movie.poster_url || PLACEHOLDER_POSTER}
          alt={movie.title}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          onError={(e) => (e.currentTarget.src = PLACEHOLDER_POSTER)}
        />
        <div className="absolute right-2 top-2 flex items-center gap-1 rounded-md bg-black/70 px-1.5 py-0.5 text-xs font-semibold text-rating backdrop-blur">
          <Star size={11} className="fill-rating text-rating" />
          {movie.rating.toFixed(1)}
        </div>
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggle({
              id: movie.id,
              title: movie.title,
              poster: movie.poster_url,
              year: String(year(movie.release_date)),
              source: "catalog",
              slug: movie.slug,
            });
          }}
          className={`absolute left-2 top-2 grid h-8 w-8 place-items-center rounded-full text-white opacity-0 transition-opacity group-hover:opacity-100 ${
            selected ? "gradient-primary opacity-100" : "bg-black/70 hover:bg-black/90"
          }`}
          aria-label={selected ? "Remove from compare" : "Add to compare"}
          title={selected ? "Remove from compare" : "Compare"}
        >
          <GitCompare size={15} />
        </button>
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 to-transparent p-3 opacity-0 transition-opacity group-hover:opacity-100">
          <p className="line-clamp-1 text-xs text-text-secondary">
            {movie.genres.slice(0, 2).map((g) => g.name).join(" • ")}
          </p>
        </div>
      </div>
      <div className="p-2.5">
        <h3 className="line-clamp-1 text-sm font-semibold text-text">{movie.title}</h3>
        <p className="text-xs text-muted">{year(movie.release_date)}</p>
      </div>
    </Link>
  );
}
