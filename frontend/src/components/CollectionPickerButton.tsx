import { Check, FolderHeart, Plus, X } from "lucide-react";
import { useEffect, useMemo, useState, type FormEvent, type ReactNode } from "react";
import { createPortal } from "react-dom";
import {
  collectionsApi,
  type MovieCollection,
  type MovieCollectionStatus,
} from "../api/movieverse";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import type { SavedMovie } from "../context/WatchlistContext";

export default function CollectionPickerButton({
  movie,
  genre = null,
  imdbRating = null,
  size = "sm",
  variant = "overlay",
}: {
  movie: SavedMovie;
  genre?: string | null;
  imdbRating?: number | null;
  size?: "sm" | "lg";
  variant?: "overlay" | "secondary";
}) {
  const { isAuthenticated } = useAuth();
  const { showToast } = useToast();
  const [open, setOpen] = useState(false);
  const [collections, setCollections] = useState<MovieCollection[]>([]);
  const [memberships, setMemberships] = useState<MovieCollectionStatus[]>([]);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [name, setName] = useState("");
  const [visibility, setVisibility] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const dim = size === "lg" ? "h-10 px-4 gap-2" : "h-8 w-8";
  const icon = size === "lg" ? 18 : 15;
  const buttonClass =
    variant === "secondary"
      ? "button-glow inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-white/25 px-5 py-2.5 font-semibold text-text transition-all hover:bg-white/5"
      : `button-glow inline-flex items-center justify-center rounded-full bg-black/60 text-sm font-medium text-white transition-colors hover:bg-black/80 ${dim}`;

  useEffect(() => {
    if (!open || !isAuthenticated) return;
    setLoading(true);
    Promise.all([collectionsApi.list(), collectionsApi.memberships(movie.imdbID)])
      .then(([items, statuses]) => {
        setCollections(items);
        setMemberships(statuses);
        setSelectedIds(new Set(statuses.filter((item) => item.contains_movie).map((item) => item.collection_id)));
        setName("");
      })
      .catch(() => showToast("Could not load collections", "error"))
      .finally(() => setLoading(false));
  }, [open, isAuthenticated, movie.imdbID, showToast]);

  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open]);

  const existingIds = useMemo(
    () => new Set(memberships.filter((item) => item.contains_movie).map((item) => item.collection_id)),
    [memberships]
  );

  function toggleSelection(collectionId: string) {
    setSelectedIds((current) => {
      const next = new Set(current);
      if (next.has(collectionId)) next.delete(collectionId);
      else next.add(collectionId);
      return next;
    });
  }

  async function saveSelected() {
    const idsToAdd = [...selectedIds].filter((id) => !existingIds.has(id));
    if (idsToAdd.length === 0) {
      showToast("No new collections selected", "error");
      return;
    }

    setSaving(true);
    try {
      await Promise.all(
        idsToAdd.map((collectionId) =>
          collectionsApi.addMovie(collectionId, {
            movie_id: movie.imdbID,
            internal_movie_id: movie.imdbID.startsWith("tt") ? null : movie.imdbID,
            movie_title: movie.Title,
            poster: movie.Poster || null,
            genre,
            year: movie.Year || null,
            imdb_rating: imdbRating,
          })
        )
      );
      setMemberships((current) =>
        current.map((membership) =>
          idsToAdd.includes(membership.collection_id)
            ? { ...membership, contains_movie: true }
            : membership
        )
      );
      showToast(idsToAdd.length === 1 ? "Added to collection" : "Added to collections");
      setOpen(false);
    } catch (error: any) {
      showToast(error.response?.data?.message || "Could not update collections", "error");
    } finally {
      setSaving(false);
    }
  }

  async function createCollection(e: FormEvent) {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) {
      showToast("Collection name is required", "error");
      return;
    }
    if (collections.some((collection) => collection.name.toLowerCase() === trimmed.toLowerCase())) {
      showToast("Duplicate collection names are not allowed", "error");
      return;
    }

    setSaving(true);
    try {
      const collection = await collectionsApi.create(trimmed, null, visibility);
      setCollections((current) => [collection, ...current]);
      setMemberships((current) => [
        { collection_id: collection.id, name: collection.name, contains_movie: false },
        ...current,
      ]);
      setSelectedIds((current) => new Set(current).add(collection.id));
      setName("");
      setVisibility(false);
      showToast("Collection created");
    } catch (error: any) {
      showToast(error.response?.data?.message || "Could not create collection", "error");
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          if (!isAuthenticated) {
            showToast("Sign in to use collections", "error");
            return;
          }
          setOpen((value) => !value);
        }}
        aria-label="Add to collection"
        title="Add to collection"
        className={buttonClass}
      >
        <FolderHeart size={icon} />
        {size === "lg" && "Add to Collection"}
      </button>

      {open &&
        createPortal(
          <div
            className="animate-modal-backdrop fixed inset-0 z-[100] grid place-items-center overflow-y-auto bg-black/60 p-3 backdrop-blur-sm sm:p-4"
            onClick={() => setOpen(false)}
          >
            <div
              className="animate-soft-pop max-h-[calc(100dvh-1.5rem)] w-full max-w-md overflow-y-auto rounded-lg border border-border bg-card p-4 shadow-2xl shadow-black/50 sm:max-h-[calc(100dvh-2rem)]"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="mb-3 flex items-center justify-between">
                <p className="text-base font-semibold">Add to Collection</p>
                <button type="button" onClick={() => setOpen(false)} className="rounded-lg p-1.5 hover:bg-chip">
                  <X size={16} />
                </button>
              </div>

              {loading ? (
                <p className="py-8 text-center text-sm text-muted">Loading collections...</p>
              ) : collections.length === 0 ? (
                <p className="py-5 text-sm text-muted">Create a collection to save this movie.</p>
              ) : (
                <div className="max-h-[35dvh] space-y-1 overflow-y-auto pr-1 sm:max-h-72">
                  {collections.map((collection) => {
                    const selected = selectedIds.has(collection.id);
                    const alreadySaved = existingIds.has(collection.id);
                    return (
                      <button
                        key={collection.id}
                        type="button"
                        onClick={() => toggleSelection(collection.id)}
                        className={`flex w-full items-center justify-between gap-3 rounded-lg px-3 py-2.5 text-left text-sm hover:bg-chip ${
                          selected ? "bg-chip" : ""
                        }`}
                      >
                        <span className="min-w-0">
                          <span className="block truncate font-medium">{collection.name}</span>
                          <span className="text-xs text-muted">
                            {collection.visibility ? "Public" : "Private"}
                            {alreadySaved ? " - already added" : ""}
                          </span>
                        </span>
                        <span
                          className={`grid h-5 w-5 shrink-0 place-items-center rounded border ${
                            selected ? "border-primary bg-primary text-white" : "border-border"
                          }`}
                        >
                          {selected && <Check size={14} />}
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}

              <div className="mt-3 flex justify-end border-t border-border pt-3">
                <ButtonLike onClick={saveSelected} disabled={saving || loading}>
                  Save Selection
                </ButtonLike>
              </div>

              <form onSubmit={createCollection} className="mt-3 space-y-3 border-t border-border pt-3">
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="New collection name"
                  className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm outline-none focus:border-primary"
                />
                <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <label className="inline-flex items-center gap-2 text-sm text-text-secondary">
                    <input
                      type="checkbox"
                      checked={visibility}
                      onChange={(e) => setVisibility(e.target.checked)}
                      className="h-4 w-4 accent-primary"
                    />
                    Public
                  </label>
                  <button
                    type="submit"
                    disabled={saving}
                    className="button-glow inline-flex h-9 items-center justify-center gap-2 rounded-lg gradient-primary px-3 text-sm font-semibold text-white disabled:opacity-50"
                  >
                    <Plus size={16} /> Create
                  </button>
                </div>
              </form>
            </div>
          </div>,
          document.body
        )}
    </>
  );
}

function ButtonLike({
  children,
  onClick,
  disabled,
}: {
  children: ReactNode;
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="button-glow inline-flex items-center justify-center gap-2 rounded-lg gradient-primary px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
    >
      {children}
    </button>
  );
}
