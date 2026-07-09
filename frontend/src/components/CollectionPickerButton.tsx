import { Check, FolderHeart, Plus, X } from "lucide-react";
import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { createPortal } from "react-dom";
import toast from "react-hot-toast";
import {
  collectionsApi,
  type MovieCollection,
  type MovieCollectionStatus,
} from "../api/movieverse";
import { useAuth } from "../context/AuthContext";
import type { SavedMovie } from "../context/WatchlistContext";

export default function CollectionPickerButton({
  movie,
  genre = null,
  size = "sm",
  variant = "overlay",
}: {
  movie: SavedMovie;
  genre?: string | null;
  size?: "sm" | "lg";
  variant?: "overlay" | "secondary";
}) {
  const { isAuthenticated } = useAuth();
  const [open, setOpen] = useState(false);
  const [collections, setCollections] = useState<MovieCollection[]>([]);
  const [memberships, setMemberships] = useState<MovieCollectionStatus[]>([]);
  const [selectedCollectionId, setSelectedCollectionId] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
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
        setSelectedCollectionId(null);
        setName("");
      })
      .finally(() => setLoading(false));
  }, [open, isAuthenticated, movie.imdbID]);

  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open]);

  function contains(collectionId: string) {
    return memberships.some(
      (membership) => membership.collection_id === collectionId && membership.contains_movie
    );
  }

  function selectCollection(collection: MovieCollection) {
    setSelectedCollectionId(collection.id);
    setName(collection.name);
  }

  async function addMovieToCollection(collection: MovieCollection) {
    try {
      if (contains(collection.id)) {
        toast.success("Movie already exists in this collection");
        return;
      }
      await collectionsApi.addMovie(collection.id, {
        movie_id: movie.imdbID,
        movie_title: movie.Title,
        poster: movie.Poster || null,
        genre,
        year: movie.Year || null,
      });
      setMemberships((current) =>
        current.map((membership) =>
          membership.collection_id === collection.id
            ? { ...membership, contains_movie: true }
            : membership
        )
      );
      toast.success("Added to collection");
      setOpen(false);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Could not update collection");
    }
  }

  async function saveToCollection(e: FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    try {
      const selected = collections.find((collection) => collection.id === selectedCollectionId);
      if (selected && selected.name === name.trim()) {
        await addMovieToCollection(selected);
        return;
      }

      const collection = await collectionsApi.create(name.trim(), null);
      await collectionsApi.addMovie(collection.id, {
        movie_id: movie.imdbID,
        movie_title: movie.Title,
        poster: movie.Poster || null,
        genre,
        year: movie.Year || null,
      });
      setCollections((current) => [collection, ...current]);
      setMemberships((current) => [
        { collection_id: collection.id, name: collection.name, contains_movie: true },
        ...current,
      ]);
      setSelectedCollectionId(collection.id);
      setName("");
      toast.success("Collection created and movie added");
      setOpen(false);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Could not update collection");
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          if (!isAuthenticated) return toast.error("Sign in to use collections");
          setOpen((value) => !value);
        }}
        aria-label="Add to collection"
        title="Add to collection"
        className={buttonClass}
      >
        <FolderHeart size={icon} />
        {size === "lg" && "Collections"}
      </button>

      {open &&
        createPortal(
        <div
          className="animate-modal-backdrop fixed inset-0 z-[100] grid place-items-center bg-black/60 px-4 backdrop-blur-sm"
          onClick={() => setOpen(false)}
        >
          <div
            className="animate-soft-pop w-full max-w-md rounded-xl border border-border bg-card p-4 shadow-2xl shadow-black/50"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-3 flex items-center justify-between">
              <p className="text-base font-semibold">Add to collection</p>
              <button type="button" onClick={() => setOpen(false)} className="rounded-lg p-1.5 hover:bg-chip">
                <X size={16} />
              </button>
            </div>

            {loading ? (
              <p className="py-8 text-center text-sm text-muted">Loading collections...</p>
            ) : collections.length === 0 ? (
              <p className="py-5 text-sm text-muted">Create a collection to save this movie.</p>
            ) : (
              <div className="max-h-72 space-y-1 overflow-y-auto pr-1">
                {collections.map((collection) => {
                  const checked = contains(collection.id);
                  const selected = selectedCollectionId === collection.id;
                  return (
                    <button
                      key={collection.id}
                      type="button"
                      onClick={() => selectCollection(collection)}
                      className={`flex w-full items-center justify-between gap-3 rounded-lg px-3 py-2.5 text-left text-sm hover:bg-chip ${
                        selected ? "bg-chip" : ""
                      }`}
                    >
                      <span className="truncate">{collection.name}</span>
                      {checked && <Check size={16} className="shrink-0 text-watched" />}
                    </button>
                  );
                })}
              </div>
            )}

            <form onSubmit={saveToCollection} className="mt-3 flex gap-2 border-t border-border pt-3">
              <input
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (collections.find((collection) => collection.id === selectedCollectionId)?.name !== e.target.value) {
                    setSelectedCollectionId(null);
                  }
                }}
                placeholder="New collection"
                className="min-w-0 flex-1 rounded-lg border border-border bg-surface px-3 py-2 text-sm outline-none focus:border-primary"
              />
              <button
                type="submit"
                className="button-glow grid h-9 w-9 shrink-0 place-items-center rounded-lg gradient-primary text-white"
                aria-label="Create collection"
              >
                <Plus size={16} />
              </button>
            </form>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
