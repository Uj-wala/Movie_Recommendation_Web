import { Check } from "lucide-react";

/** "✔ Watched" badge shown on movies that are in the user's watched history. */
export default function WatchedBadge({ className = "" }: { className?: string }) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full bg-watched px-2 py-0.5 text-xs font-semibold text-white shadow ${className}`}
    >
      <Check size={12} /> Watched
    </span>
  );
}
