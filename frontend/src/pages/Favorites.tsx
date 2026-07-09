import { Heart } from "lucide-react";
import { useEffect, useState } from "react";
import { libraryApi } from "../api/movieverse";
import type { Movie } from "../api/types";
import MovieGrid from "../components/MovieGrid";

export default function Favorites() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    libraryApi.favorites().then(setMovies).finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <h1 className="mb-5 flex items-center gap-2 text-2xl font-bold">
        <Heart className="text-primary" /> My Favorites
      </h1>
      <MovieGrid movies={movies} loading={loading} empty="No favorites yet. Tap the heart on any movie." />
    </div>
  );
}
