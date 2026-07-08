import type { AxiosError } from "axios";
import { PLACEHOLDER_POSTER } from "./format";

/** OMDb returns "N/A" for a missing poster; fall back to the placeholder. */
export const omdbPoster = (p?: string) => (p && p !== "N/A" ? p : PLACEHOLDER_POSTER);

/** Pull a user-friendly message out of an Axios error (envelope uses `detail`). */
export const omdbErrText = (e: unknown) =>
  (e as AxiosError<{ detail?: string }>)?.response?.data?.detail ||
  "Something went wrong. Please try again.";

/** Detail fields to show, in order, with display labels. */
export const OMDB_DETAIL_FIELDS: [string, string][] = [
  ["Genre", "Genre"],
  ["Runtime", "Runtime"],
  ["imdbRating", "IMDb"],
  ["Director", "Director"],
  ["Writer", "Writer"],
  ["Actors", "Actors"],
  ["Language", "Language"],
  ["Country", "Country"],
  ["Awards", "Awards"],
  ["Released", "Released"],
  ["Production", "Production"],
  ["BoxOffice", "Box Office"],
];
