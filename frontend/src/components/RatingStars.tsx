import { Star } from "lucide-react";
import { useState } from "react";

/** 1–5 star rating. Read-only when no `onChange`; interactive (click + hover) otherwise. */
export default function RatingStars({
  value,
  onChange,
  size = 20,
}: {
  value: number;
  onChange?: (rating: number) => void;
  size?: number;
}) {
  const [hover, setHover] = useState(0);
  const interactive = !!onChange;
  const shown = hover || value;

  return (
    <div className="inline-flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          disabled={!interactive}
          onClick={() => onChange?.(n)}
          onMouseEnter={() => interactive && setHover(n)}
          onMouseLeave={() => interactive && setHover(0)}
          className={interactive ? "cursor-pointer transition-transform hover:scale-110" : "cursor-default"}
          aria-label={`${n} star${n > 1 ? "s" : ""}`}
        >
          <Star
            size={size}
            className={n <= shown ? "fill-rating text-rating" : "text-disabled"}
          />
        </button>
      ))}
    </div>
  );
}
