import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRef } from "react";
import type { Movie } from "../api/types";
import MovieCard from "./MovieCard";
import { RowSkeleton } from "./ui";

export default function MovieRow({
  title,
  movies,
  loading,
}: {
  title: string;
  movies: Movie[];
  loading?: boolean;
}) {
  const scroller = useRef<HTMLDivElement>(null);

  const scroll = (dir: number) =>
    scroller.current?.scrollBy({ left: dir * 600, behavior: "smooth" });

  if (!loading && movies.length === 0) return null;

  return (
    <section className="mb-8">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-xl font-bold text-text">{title}</h2>
        {!loading && (
          <div className="flex gap-1">
            <button
              onClick={() => scroll(-1)}
              className="rounded-full bg-chip p-1.5 text-text-secondary hover:bg-chip-hover"
              aria-label="scroll left"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={() => scroll(1)}
              className="rounded-full bg-chip p-1.5 text-text-secondary hover:bg-chip-hover"
              aria-label="scroll right"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        )}
      </div>
      {loading ? (
        <RowSkeleton />
      ) : (
        <div ref={scroller} className="no-scrollbar flex gap-4 overflow-x-auto scroll-smooth pb-1">
          {movies.map((m) => (
            <div key={m.id} className="w-[150px] shrink-0 sm:w-[160px]">
              <MovieCard movie={m} />
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
