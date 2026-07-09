import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRef } from "react";
import type { Movie } from "../api/types";
import MovieCard from "./MovieCard";
import ScrollReveal from "./ScrollReveal";
import { RowSkeleton } from "./ui";

export default function MovieRow({
  title,
  movies,
  loading,
  fixedFive = false,
}: {
  title: string;
  movies: Movie[];
  loading?: boolean;
  fixedFive?: boolean;
}) {
  const scroller = useRef<HTMLDivElement>(null);
  const visibleMovies = fixedFive ? movies.slice(0, 5) : movies;

  const scroll = (dir: number) =>
    scroller.current?.scrollBy({ left: dir * 600, behavior: "smooth" });

  if (!loading && movies.length === 0) return null;

  return (
    <section className="mb-8">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-xl font-bold text-text">{title}</h2>
        {!loading && !fixedFive && (
          <div className="flex gap-1">
            <button
              onClick={() => scroll(-1)}
              className="button-glow rounded-full bg-chip p-1.5 text-text-secondary hover:bg-chip-hover"
              aria-label="scroll left"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={() => scroll(1)}
              className="button-glow rounded-full bg-chip p-1.5 text-text-secondary hover:bg-chip-hover"
              aria-label="scroll right"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        )}
      </div>
      {loading ? (
        fixedFive ? (
          <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-5">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="skeleton aspect-[2/3] w-full rounded-xl" />
            ))}
          </div>
        ) : (
          <RowSkeleton />
        )
      ) : fixedFive ? (
        <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-5">
          {visibleMovies.map((m, index) => (
            <ScrollReveal key={m.id} delay={index * 70}>
              <MovieCard movie={m} />
            </ScrollReveal>
          ))}
        </div>
      ) : (
        <div ref={scroller} className="no-scrollbar flex gap-4 overflow-x-auto scroll-smooth pb-1">
          {visibleMovies.map((m, index) => (
            <ScrollReveal key={m.id} className="w-[185px] shrink-0 sm:w-[205px] lg:w-[220px]" delay={(index % 6) * 55}>
              <MovieCard movie={m} />
            </ScrollReveal>
          ))}
        </div>
      )}
    </section>
  );
}
