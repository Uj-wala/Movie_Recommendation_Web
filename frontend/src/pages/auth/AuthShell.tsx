import { Clapperboard } from "lucide-react";
import type { ReactNode } from "react";

export default function AuthShell({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-bg">
      {/* Hero side */}
      <div className="relative hidden w-1/2 gradient-hero lg:block">
        <div className="absolute inset-0 bg-black/30" />
        <div className="relative flex h-full flex-col justify-between p-12">
          <div className="flex items-center gap-2 text-2xl font-extrabold">
            <Clapperboard className="text-primary" />
            Movie<span className="text-gradient">Verse</span> AI
          </div>
          <div>
            <h1 className="text-4xl font-extrabold leading-tight">
              Discover your next<br />favorite movie.
            </h1>
            <p className="mt-4 max-w-md text-text-secondary">
              Personalized recommendations, trending titles, watchlists and reviews — all in one
              cinematic experience.
            </p>
          </div>
          <p className="text-sm text-muted">© {new Date().getFullYear()} MovieVerse AI</p>
        </div>
      </div>

      {/* Form side */}
      <div className="flex w-full items-center justify-center p-6 lg:w-1/2">
        <div className="w-full max-w-md animate-in">
          <div className="mb-8 flex items-center gap-2 text-xl font-extrabold lg:hidden">
            <Clapperboard className="text-primary" />
            Movie<span className="text-gradient">Verse</span> AI
          </div>
          <h2 className="text-2xl font-bold">{title}</h2>
          {subtitle && <p className="mt-1 text-sm text-muted">{subtitle}</p>}
          <div className="mt-6">{children}</div>
        </div>
      </div>
    </div>
  );
}
