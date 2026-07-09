export const year = (date: string | null) => (date ? new Date(date).getFullYear() : "");

export const runtimeLabel = (min: number | null) =>
  min ? `${Math.floor(min / 60)}h ${min % 60}m` : "";

export const memberSince = (date: string) =>
  new Date(date).toLocaleDateString(undefined, { month: "long", year: "numeric" });

export const PLACEHOLDER_POSTER =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' width='300' height='450'><rect width='100%' height='100%' fill='#1D1A24'/><text x='50%' y='50%' fill='#5D5D65' font-family='sans-serif' font-size='18' text-anchor='middle'>No Image</text></svg>`
  );
