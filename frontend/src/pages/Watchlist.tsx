import { ListVideo } from "lucide-react";
import { useEffect, useState } from "react";
import { libraryApi } from "../api/movieverse";
import type { Movie } from "../api/types";
import MovieGrid from "../components/MovieGrid";

export default function Watchlist() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    libraryApi.watchlist().then(setMovies).finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <h1 className="mb-5 flex items-center gap-2 text-2xl font-bold">
        <ListVideo className="text-primary" /> My Watchlist
      </h1>
      <MovieGrid movies={movies} loading={loading} empty="Your watchlist is empty. Add movies to watch later." />
    </div>
  );
}
