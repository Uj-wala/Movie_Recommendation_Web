import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { catalogApi, moviesApi } from "../api/movieverse";
import type { Genre, Movie } from "../api/types";
import MovieGrid from "../components/MovieGrid";
import { Chip } from "../components/ui";

export default function Browse({ heading = "Movies" }: { heading?: string }) {
  const [params, setParams] = useSearchParams();
  const genre = params.get("genre") || "";
  const sort = params.get("sort") || "popularity";
  const [genres, setGenres] = useState<Genre[]>([]);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");

  // Live, case-insensitive title filter over the loaded movies (no refetch).
  const visible = movies.filter((m) =>
    m.title.toLowerCase().includes(query.trim().toLowerCase())
  );

  useEffect(() => {
    catalogApi.genres().then(setGenres).catch(() => {});
  }, []);

  useEffect(() => {
    setLoading(true);
    moviesApi
      .list({ genre: genre || undefined, sort, page_size: 40 })
      .then(setMovies)
      .finally(() => setLoading(false));
  }, [genre, sort]);

  const update = (key: string, value: string) => {
    const next = new URLSearchParams(params);
    if (value) next.set(key, value);
    else next.delete(key);
    setParams(next);
  };

  return (
    <div>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold">{heading}</h1>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Filter by title..."
          className="w-full flex-1 rounded-lg border border-border bg-surface px-3 py-2 text-sm outline-none focus:border-primary sm:max-w-xs"
        />
        <select
          value={sort}
          onChange={(e) => update("sort", e.target.value)}
          className="rounded-lg border border-border bg-surface px-3 py-2 text-sm outline-none focus:border-primary"
        >
          <option value="popularity">Most Popular</option>
          <option value="rating">Highest Rated</option>
          <option value="release_date">Newest</option>
          <option value="title">A–Z</option>
        </select>
      </div>

      <div className="mb-6 flex flex-wrap gap-2">
        <Chip active={!genre} onClick={() => update("genre", "")}>
          All
        </Chip>
        {genres.map((g) => (
          <Chip key={g.id} active={genre === g.slug} onClick={() => update("genre", g.slug)}>
            {g.name}
          </Chip>
        ))}
      </div>

      <MovieGrid movies={visible} loading={loading} />
    </div>
  );
}
