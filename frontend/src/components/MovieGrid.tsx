import type { Movie } from "../api/types";
import MovieCard from "./MovieCard";
import { PosterSkeleton } from "./ui";

export default function MovieGrid({
  movies,
  loading,
  empty = "No movies found.",
}: {
  movies: Movie[];
  loading?: boolean;
  empty?: string;
}) {
  if (loading) {
    return (
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {Array.from({ length: 10 }).map((_, i) => (
          <PosterSkeleton key={i} />
        ))}
      </div>
    );
  }
  if (movies.length === 0) return <p className="py-12 text-center text-muted">{empty}</p>;
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
      {movies.map((m) => (
        <MovieCard key={m.id} movie={m} />
      ))}
    </div>
  );
}
