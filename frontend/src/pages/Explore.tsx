import { Search } from "lucide-react";
import { useEffect, useState } from "react";
import { omdbApi, type OmdbSearchItem } from "../api/movieverse";
import OmdbMovieCard from "../components/OmdbMovieCard";
import ScrollReveal from "../components/ScrollReveal";
import { Button, PosterSkeleton } from "../components/ui";
import { omdbErrText } from "../lib/omdb";

export default function Explore() {
  const [term, setTerm] = useState("");
  const [query, setQuery] = useState(""); // debounced value that actually triggers the fetch
  const [page, setPage] = useState(1);
  const [data, setData] = useState<{ results: OmdbSearchItem[]; total_pages: number; total: number } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Debounce: wait 500ms after the last keystroke before searching.
  useEffect(() => {
    const t = setTimeout(() => {
      setQuery(term.trim());
      setPage(1);
    }, 500);
    return () => clearTimeout(t);
  }, [term]);

  useEffect(() => {
    if (!query) {
      setData(null);
      setError("");
      return;
    }
    setLoading(true);
    setError("");
    omdbApi
      .search(query, page)
      .then(setData)
      .catch((e) => {
        setData(null);
        setError(omdbErrText(e));
      })
      .finally(() => setLoading(false));
  }, [query, page]);

  return (
    <div>
      <h1 className="mb-1 text-2xl font-bold">
        Explore <span className="text-gradient">OMDb</span>
      </h1>
      <p className="mb-5 text-sm text-muted">Search millions of movies live from the OMDb catalog.</p>

      <div className="relative mb-6 max-w-xl">
        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
        <input
          value={term}
          onChange={(e) => setTerm(e.target.value)}
          placeholder="Search movies (e.g. Batman, Avatar, Inception)..."
          className="w-full rounded-lg border border-border bg-surface py-2.5 pl-10 pr-4 text-sm outline-none focus:border-primary"
        />
      </div>

      {loading && (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5">
          {Array.from({ length: 10 }).map((_, i) => (
            <PosterSkeleton key={i} />
          ))}
        </div>
      )}

      {!loading && error && (
        <div className="rounded-xl border border-border bg-card p-8 text-center">
          <p className="font-semibold text-primary">{error}</p>
        </div>
      )}

      {!loading && !error && query && data && data.results.length === 0 && (
        <p className="py-12 text-center text-muted">No movies found for "{query}".</p>
      )}

      {!loading && !error && !query && (
        <p className="py-12 text-center text-muted">Start typing to search OMDb.</p>
      )}

      {!loading && !error && data && data.results.length > 0 && (
        <>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5">
            {data.results.map((m, index) => (
              <ScrollReveal key={m.imdbID} delay={(index % 5) * 55}>
                <OmdbMovieCard movie={m} />
              </ScrollReveal>
            ))}
          </div>
          <Pagination
            page={page}
            totalPages={data.total_pages}
            onChange={(p) => {
              setPage(p);
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
          />
        </>
      )}
    </div>
  );
}

function Pagination({
  page,
  totalPages,
  onChange,
}: {
  page: number;
  totalPages: number;
  onChange: (p: number) => void;
}) {
  if (totalPages <= 1) return null;
  return (
    <div className="mt-8 flex items-center justify-center gap-4">
      <Button variant="secondary" disabled={page <= 1} onClick={() => onChange(page - 1)}>
        Previous
      </Button>
      <span className="text-sm text-muted">
        Page {page} of {totalPages}
      </span>
      <Button variant="secondary" disabled={page >= totalPages} onClick={() => onChange(page + 1)}>
        Next
      </Button>
    </div>
  );
}
