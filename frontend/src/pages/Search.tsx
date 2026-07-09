import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { catalogApi } from "../api/movieverse";
import type { Movie, Person, Genre } from "../api/types";
import MovieGrid from "../components/MovieGrid";
import { PageLoader } from "../components/ui";

interface Results {
  movies: Movie[];
  actors: Person[];
  directors: Person[];
  genres: Genre[];
}

export default function Search() {
  const [params] = useSearchParams();
  const q = params.get("q") || "";
  const [results, setResults] = useState<Results | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!q) return;
    setLoading(true);
    catalogApi.search(q).then(setResults).finally(() => setLoading(false));
  }, [q]);

  if (!q) return <p className="text-muted">Type something to search.</p>;
  if (loading) return <PageLoader />;

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">
        Results for <span className="text-gradient">"{q}"</span>
      </h1>

      {results && (results.actors.length > 0 || results.directors.length > 0) && (
        <section className="mb-8">
          <h2 className="mb-3 text-lg font-semibold">People</h2>
          <div className="flex flex-wrap gap-2">
            {[...results.actors, ...results.directors].map((p) => (
              <span key={p.id} className="rounded-lg bg-card px-4 py-2 text-sm">
                {p.name}
              </span>
            ))}
          </div>
        </section>
      )}

      <h2 className="mb-3 text-lg font-semibold">Movies</h2>
      <MovieGrid movies={results?.movies || []} empty="No movies matched your search." />
    </div>
  );
}
