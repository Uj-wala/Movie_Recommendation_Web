import { Flame } from "lucide-react";
import { useEffect, useState } from "react";
import { moviesApi } from "../api/movieverse";
import type { Movie } from "../api/types";
import MovieGrid from "../components/MovieGrid";

export default function Trending() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    moviesApi.trending().then(setMovies).finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <h1 className="mb-5 flex items-center gap-2 text-2xl font-bold">
        <Flame className="text-primary" /> Trending Now
      </h1>
      <MovieGrid movies={movies} loading={loading} />
    </div>
  );
}
