import { Star } from "lucide-react";
import type { ReactNode } from "react";
import { formatRatingOutOf5 } from "../lib/format";

export function Spinner({ className = "" }: { className?: string }) {
  return (
    <div
      className={`inline-block h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white ${className}`}
    />
  );
}

export function PageLoader() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <Spinner className="h-8 w-8" />
    </div>
  );
}

export function PosterSkeleton() {
  return <div className="skeleton aspect-[2/3] w-full rounded-xl" />;
}

export function RowSkeleton() {
  return (
    <div className="flex gap-4 overflow-hidden">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="w-[185px] shrink-0 sm:w-[205px] lg:w-[220px]">
          <PosterSkeleton />
        </div>
      ))}
    </div>
  );
}

export function StarRating({
  value,
  outOf = 5,
  size = 16,
}: {
  value: number;
  outOf?: number;
  size?: number;
}) {
  return (
    <span className="rating-pulse inline-flex items-center gap-1 text-rating">
      <Star size={size} className="fill-rating text-rating" />
      <span className="font-semibold text-text">{formatRatingOutOf5(value)}</span>
      <span className="text-xs text-muted">/{outOf}</span>
    </span>
  );
}

export function Chip({
  children,
  active,
  onClick,
}: {
  children: ReactNode;
  active?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
        active
          ? "bg-primary text-white"
          : "bg-chip text-text-secondary hover:bg-chip-hover"
      }`}
    >
      {children}
    </button>
  );
}

export function Button({
  children,
  variant = "primary",
  loading,
  className = "",
  ...props
}: {
  children: ReactNode;
  variant?: "primary" | "secondary" | "ghost";
  loading?: boolean;
} & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const base =
    "button-glow inline-flex items-center justify-center gap-2 rounded-lg px-5 py-2.5 font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed";
  const variants = {
    primary: "gradient-primary text-white hover:opacity-90 shadow-lg shadow-primary/20",
    secondary: "border border-white/25 text-text hover:bg-white/5",
    ghost: "text-text-secondary hover:text-text hover:bg-white/5",
  };
  return (
    <button className={`${base} ${variants[variant]} ${className}`} disabled={loading} {...props}>
      {loading && <Spinner className="h-4 w-4" />}
      {children}
    </button>
  );
}

export function Input({
  label,
  error,
  className = "",
  ...props
}: { label?: string; error?: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="block">
      {label && <span className="mb-1.5 block text-sm font-medium text-text-secondary">{label}</span>}
      <input
        className={`w-full rounded-lg border border-border bg-surface px-4 py-2.5 text-text outline-none transition-colors focus:border-primary ${className}`}
        {...props}
      />
      {error && <span className="mt-1 block text-xs text-red-400">{error}</span>}
    </label>
  );
}
