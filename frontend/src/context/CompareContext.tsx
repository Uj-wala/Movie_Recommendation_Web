import { createContext, useContext, useState } from "react";
import toast from "react-hot-toast";

export interface CompareMovie {
  id: string;
  title: string;
  poster: string | null;
  year: string | null;
  source: "catalog" | "omdb";
  slug?: string;
}

interface Ctx {
  selected: CompareMovie[];
  isSelected: (id: string) => boolean;
  toggle: (movie: CompareMovie) => void;
  clear: () => void;
}

const CompareCtx = createContext<Ctx | null>(null);

const MAX = 2;

// In-memory selection (max 2). Deliberately not persisted — a comparison is a
// transient action; the /compare URL carries the shareable state instead.
export function CompareProvider({ children }: { children: React.ReactNode }) {
  const [selected, setSelected] = useState<CompareMovie[]>([]);

  const isSelected = (id: string) => selected.some((m) => m.id === id);

  const toggle = (movie: CompareMovie) => {
    setSelected((prev) => {
      if (prev.some((m) => m.id === movie.id)) {
        return prev.filter((m) => m.id !== movie.id);
      }
      if (prev.length >= MAX) {
        toast.error("You can compare only 2 movies at a time.");
        return prev;
      }
      return [...prev, movie];
    });
  };

  const clear = () => setSelected([]);

  return (
    <CompareCtx.Provider value={{ selected, isSelected, toggle, clear }}>
      {children}
    </CompareCtx.Provider>
  );
}

export function useCompare() {
  const c = useContext(CompareCtx);
  if (!c) throw new Error("useCompare must be used within CompareProvider");
  return c;
}
