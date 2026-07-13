import { Info, Play, Star, Popcorn, Film, Ticket } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { moviesApi } from "../api/movieverse";
import type { Movie } from "../api/types";
import MovieRow from "../components/MovieRow";
import RecommendedForYou from "../components/RecommendedForYou";
import { useAuth } from "../context/AuthContext";
import { formatRatingOutOf5, year } from "../lib/format";

const FIXED_FIVE_ROWS = new Set([
  "Trending Now",
  "Popular",
  "Top Rated",
  "More Like Your Favorites",
]);

export default function Home() {
  const { isAuthenticated } = useAuth();
  const [rows, setRows] = useState<Record<string, Movie[]>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const calls: [string, Promise<Movie[]>][] = [
      ["Trending Now", moviesApi.trending()],
      ["Popular", moviesApi.popular()],
      ["Now Playing", moviesApi.nowPlaying()],
      ["Upcoming", moviesApi.upcoming()],
      ["Top Rated", moviesApi.topRated()],
    ];
    if (isAuthenticated) calls.push(["More Like Your Favorites", moviesApi.recommended()]);

    Promise.allSettled(calls.map(([, p]) => p)).then((results) => {
      const next: Record<string, Movie[]> = {};
      results.forEach((res, i) => {
        next[calls[i][0]] = res.status === "fulfilled" ? res.value : [];
      });
      setRows(next);
      setLoading(false);
    });
  }, [isAuthenticated]);

  const hero = rows["Trending Now"]?.[0];

  return (
    <div>
      {/* Hero banner */}
      <div className="animate-soft-pop relative mb-8 overflow-hidden rounded-2xl">
        {hero ? (
          <>
            <img
              src={hero.backdrop_url || hero.poster_url || ""}
              alt={hero.title}
              className="hero-image-motion h-[340px] w-full object-cover sm:h-[420px]"
            />
            {/* Floating icons */}
            <Popcorn size={48} className="float-icon popcorn absolute right-16 top-12 text-white/40 opacity-50" />
            <Film size={48} className="float-icon film-reel absolute right-32 bottom-20 text-white/40 opacity-50" />
            <Ticket size={48} className="float-icon ticket absolute left-12 top-20 text-white/40 opacity-50" />
            
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/35 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 h-56 bg-gradient-to-t from-black/85 via-black/35 to-transparent" />
            <div className="absolute bottom-0 left-0 max-w-xl p-6 sm:p-10">
              <span className="mb-3 inline-block rounded-full bg-primary/30 px-3 py-1 text-xs font-semibold text-white shadow-lg shadow-black/30">
                #1 Trending
              </span>
              <h1 className="text-3xl font-extrabold text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.85)] sm:text-5xl">
                {hero.title}
              </h1>
              <div className="mt-3 flex items-center gap-4 text-sm font-semibold text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
                <span className="inline-flex items-center gap-1 text-white">
                  <Star size={16} className="fill-rating text-rating" />
                  <span>{formatRatingOutOf5(hero.rating)}</span>
                  <span className="text-white/85">/5</span>
                </span>
                <span className="text-white">{year(hero.release_date)}</span>
                <span className="hidden sm:inline">
                  {hero.genres.slice(0, 3).map((g) => g.name).join(" • ")}
                </span>
              </div>
              <div className="mt-5 flex gap-3">
                <Link
                  to={`/movie/${hero.slug}`}
                  className="button-glow inline-flex items-center gap-2 rounded-lg gradient-primary px-5 py-2.5 font-semibold text-white"
                >
                  <Play size={18} className="fill-white" /> Watch Trailer
                </Link>
                <Link
                  to={`/movie/${hero.slug}`}
                  className="inline-flex items-center gap-2 rounded-lg border border-white/60 bg-black/35 px-5 py-2.5 font-semibold text-white shadow-lg shadow-black/30 hover:bg-black/45"
                >
                  <Info size={18} /> Details
                </Link>
              </div>
            </div>
          </>
        ) : (
          <div className="skeleton h-[340px] w-full sm:h-[420px]" />
        )}
      </div>

      {isAuthenticated && <RecommendedForYou />}

      {Object.entries(rows).map(([title, movies]) => (
        <MovieRow
          key={title}
          title={title}
          movies={movies}
          loading={loading}
          fixedFive={FIXED_FIVE_ROWS.has(title)}
        />
      ))}
    </div>
  );
}
