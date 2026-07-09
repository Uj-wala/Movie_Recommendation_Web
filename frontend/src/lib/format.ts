export const year = (date: string | null) => (date ? new Date(date).getFullYear() : "");

export const runtimeLabel = (min: number | null) =>
  min ? `${Math.floor(min / 60)}h ${min % 60}m` : "";

export const memberSince = (date: string) =>
  new Date(date).toLocaleDateString(undefined, { month: "long", year: "numeric" });

export const ratingOutOf5 = (value: number | null | undefined) => {
  if (value == null || Number.isNaN(value)) return null;
  return value > 5 ? value / 2 : value;
};

export const formatRatingOutOf5 = (value: number | null | undefined) => {
  const rating = ratingOutOf5(value);
  return rating == null ? "N/A" : rating.toFixed(1);
};

export const formatRatingLabelOutOf5 = (value: number | null | undefined) => {
  const rating = formatRatingOutOf5(value);
  return rating === "N/A" ? rating : `${rating}/5`;
};

export const PLACEHOLDER_POSTER =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' width='300' height='450'><rect width='100%' height='100%' fill='#1D1A24'/><text x='50%' y='50%' fill='#5D5D65' font-family='sans-serif' font-size='18' text-anchor='middle'>No Image</text></svg>`
  );
