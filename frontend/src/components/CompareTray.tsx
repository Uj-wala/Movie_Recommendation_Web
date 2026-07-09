import { GitCompare, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useCompare } from "../context/CompareContext";

export default function CompareTray() {
  const { selected, clear, toggle } = useCompare();
  const navigate = useNavigate();

  if (selected.length === 0) return null;

  return (
    <div className="fixed bottom-4 left-1/2 z-40 w-[calc(100%-2rem)] max-w-2xl -translate-x-1/2 rounded-xl border border-border bg-card p-3 shadow-2xl lg:left-[calc(50%+8rem)]">
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex min-w-0 flex-1 items-center gap-2">
          <GitCompare size={18} className="text-primary" />
          <span className="shrink-0 text-sm font-semibold">Compare</span>
          <div className="flex min-w-0 flex-1 gap-2">
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
          className="rounded-lg gradient-primary px-4 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
        >
          Compare Movies
        </button>
        <button
          type="button"
          onClick={clear}
          className="rounded-lg px-2 py-2 text-sm text-muted hover:bg-chip hover:text-text"
        >
          Clear
        </button>
      </div>
    </div>
  );
}
