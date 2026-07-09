import { GitCompare, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useCompare } from "../context/CompareContext";

export default function CompareTray() {
  const { selected, clear, toggle } = useCompare();
  const navigate = useNavigate();

  if (selected.length === 0) return null;

  return (
    <div className="animate-dock fixed bottom-3 left-1/2 z-40 w-[calc(100%-1rem)] max-w-2xl -translate-x-1/2 rounded-xl border border-border bg-card p-3 shadow-2xl shadow-black/40 sm:bottom-4 sm:w-[calc(100%-2rem)] lg:left-[calc(50%+8rem)]">
      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
        <div className="flex min-w-0 flex-1 flex-col gap-2 sm:flex-row sm:items-center">
          <div className="flex items-center gap-2">
            <GitCompare size={18} className="text-primary" />
            <span className="shrink-0 text-sm font-semibold">Compare</span>
          </div>
          <div className="flex min-w-0 flex-1 flex-wrap gap-2">
            {selected.map((movie) => (
              <button
                key={movie.id}
                type="button"
                onClick={() => toggle(movie)}
                className="inline-flex min-w-0 items-center gap-1 rounded-lg bg-chip px-2.5 py-1.5 text-xs hover:bg-chip-hover"
              >
                <span className="truncate">{movie.title}</span>
                <X size={13} className="shrink-0" />
              </button>
            ))}
            {selected.length < 2 && (
              <span className="rounded-lg border border-dashed border-border px-2.5 py-1.5 text-xs text-muted">
                Select {2 - selected.length} more
              </span>
            )}
          </div>
        </div>
        <button
          type="button"
          disabled={selected.length !== 2}
          onClick={() => navigate("/compare")}
          className="button-glow w-full rounded-lg gradient-primary px-4 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
        >
          Compare Movies
        </button>
        <button
          type="button"
          onClick={clear}
          className="w-full rounded-lg px-2 py-2 text-sm text-muted hover:bg-chip hover:text-text sm:w-auto"
        >
          Clear
        </button>
      </div>
    </div>
  );
}
