import { Compass, Edit3, FolderHeart, Plus, Save, Trash2, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import type { FormEvent } from "react";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import { collectionsApi, type MovieCollection } from "../api/movieverse";
import { Button, PageLoader } from "../components/ui";
import { omdbPoster } from "../lib/omdb";

const SAMPLE_NAMES = ["Marvel Collection", "Weekend Movies", "Horror Nights", "Top Sci-Fi Movies"];

function movieHref(movieId: string) {
  return movieId.startsWith("tt") ? `/omdb/movie/${movieId}` : `/movie/${movieId}`;
}

export default function Collections() {
  const [collections, setCollections] = useState<MovieCollection[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  function loadCollections() {
    setLoading(true);
    collectionsApi
      .list()
      .then((items) => {
        setCollections(items);
        setSelectedId((current) => current || items[0]?.id || null);
      })
      .finally(() => setLoading(false));
  }

  useEffect(loadCollections, []);

  const selected = useMemo(
    () => collections.find((collection) => collection.id === selectedId) || collections[0] || null,
    [collections, selectedId]
  );

  function resetForm() {
    setName("");
    setDescription("");
    setEditingId(null);
  }

  async function saveCollection(e: FormEvent) {
    e.preventDefault();
    if (!name.trim()) return toast.error("Collection name is required");
    setSaving(true);
    try {
      const saved = editingId
        ? await collectionsApi.update(editingId, {
            name: name.trim(),
            description: description.trim() || null,
          })
        : await collectionsApi.create(name.trim(), description.trim() || null);
      setCollections((current) =>
        editingId
          ? current.map((collection) => (collection.id === saved.id ? saved : collection))
          : [saved, ...current]
      );
      setSelectedId(saved.id);
      resetForm();
      toast.success(editingId ? "Collection updated" : "Collection created");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Could not save collection");
    } finally {
      setSaving(false);
    }
  }

  function startEdit(collection: MovieCollection) {
    setEditingId(collection.id);
    setName(collection.name);
    setDescription(collection.description || "");
  }

  async function deleteCollection(collection: MovieCollection) {
    if (!confirm(`Delete "${collection.name}"?`)) return;
    await collectionsApi.remove(collection.id);
    setCollections((current) => current.filter((item) => item.id !== collection.id));
    if (selectedId === collection.id) setSelectedId(null);
    toast.success("Collection deleted");
  }

  async function removeMovie(collectionId: string, movieId: string) {
    await collectionsApi.removeMovie(collectionId, movieId);
    setCollections((current) =>
      current.map((collection) =>
        collection.id === collectionId
          ? { ...collection, movies: collection.movies.filter((movie) => movie.movie_id !== movieId) }
          : collection
      )
    );
    toast.success("Movie removed");
  }

  if (loading) return <PageLoader />;

  return (
    <div className="animate-in">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <h1 className="flex items-center gap-2 text-2xl font-bold">
          <FolderHeart className="text-primary" /> Collections
        </h1>
        <Link
          to="/explore"
          className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-semibold hover:bg-chip"
        >
          <Compass size={16} /> Explore Movies
        </Link>
      </div>

      <div className="grid gap-6 xl:grid-cols-[360px_1fr]">
        <aside className="space-y-5">
          <form onSubmit={saveCollection} className="rounded-xl border border-border bg-card p-4">
            <div className="mb-4 flex items-center justify-between">
              <p className="font-semibold">{editingId ? "Edit Collection" : "Create Collection"}</p>
              {editingId && (
                <button type="button" onClick={resetForm} className="rounded-lg p-1.5 hover:bg-chip">
                  <X size={16} />
                </button>
              )}
            </div>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Collection name"
              className="mb-3 w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm outline-none focus:border-primary"
            />
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Description (optional)"
              rows={3}
              className="mb-3 w-full resize-none rounded-lg border border-border bg-surface px-3 py-2 text-sm outline-none focus:border-primary"
            />
            <Button loading={saving} className="w-full">
              {editingId ? <Save size={16} /> : <Plus size={16} />}
              {editingId ? "Save Changes" : "Create Collection"}
            </Button>
            {!editingId && (
              <div className="mt-3 flex flex-wrap gap-2">
                {SAMPLE_NAMES.map((sample) => (
                  <button
                    key={sample}
                    type="button"
                    onClick={() => setName(sample)}
                    className="rounded-full bg-chip px-3 py-1 text-xs text-text-secondary hover:bg-chip-hover"
                  >
                    {sample}
                  </button>
                ))}
              </div>
            )}
          </form>

          <div className="space-y-2">
            {collections.map((collection) => (
              <button
                key={collection.id}
                type="button"
                onClick={() => setSelectedId(collection.id)}
                className={`w-full rounded-xl border p-4 text-left transition-colors ${
                  selected?.id === collection.id
                    ? "border-primary bg-primary/10"
                    : "border-border bg-card hover:bg-chip"
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate font-semibold">{collection.name}</p>
                    <p className="text-xs text-muted">{collection.movies.length} movies</p>
                  </div>
                  <span className="rounded-full bg-chip px-2 py-0.5 text-xs text-muted">
                    {new Date(collection.updated_at).toLocaleDateString()}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </aside>

        <section className="min-w-0">
          {!selected ? (
            <EmptyState />
          ) : (
            <div className="space-y-5">
              <div className="rounded-xl border border-border bg-card p-5">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <h2 className="text-xl font-bold">{selected.name}</h2>
                    <p className="mt-1 text-sm text-muted">
                      {selected.description || "No description added."}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => startEdit(selected)}
                      className="inline-flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm font-semibold hover:bg-chip"
                    >
                      <Edit3 size={15} /> Edit
                    </button>
                    <button
                      onClick={() => deleteCollection(selected)}
                      className="inline-flex items-center gap-2 rounded-lg border border-red-500/40 px-3 py-2 text-sm font-semibold text-red-300 hover:bg-red-500/10"
                    >
                      <Trash2 size={15} /> Delete
                    </button>
                  </div>
                </div>
              </div>

              {selected.movies.length === 0 ? (
                <div className="rounded-xl border border-border bg-card p-12 text-center">
                  <FolderHeart size={38} className="mx-auto mb-3 text-primary" />
                  <p className="font-semibold">No movies in this collection yet</p>
                  <p className="mt-1 text-sm text-muted">
                    Use the Collections button beside any movie to add it here.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                  {selected.movies.map((movie) => (
                    <div key={movie.id} className="flex gap-3 rounded-xl border border-border bg-card p-3">
                      <Link to={movieHref(movie.movie_id)} className="shrink-0">
                        <img
                          src={omdbPoster(movie.poster || "")}
                          alt={movie.movie_title}
                          className="h-24 w-16 rounded-lg object-cover"
                        />
                      </Link>
                      <div className="min-w-0 flex-1">
                        <Link to={movieHref(movie.movie_id)} className="font-semibold hover:text-primary">
                          {movie.movie_title}
                        </Link>
                        <p className="text-xs text-muted">{movie.year || "Year unknown"}</p>
                        {movie.genre && <p className="mt-1 line-clamp-2 text-xs text-text-secondary">{movie.genre}</p>}
                        <button
                          onClick={() => removeMovie(selected.id, movie.movie_id)}
                          className="mt-3 inline-flex items-center gap-1.5 rounded-lg bg-chip px-2.5 py-1.5 text-xs font-semibold text-red-300 hover:bg-chip-hover"
                        >
                          <Trash2 size={13} /> Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="rounded-xl border border-border bg-card p-12 text-center">
      <FolderHeart size={42} className="mx-auto mb-3 text-primary" />
      <p className="text-lg font-semibold">Create your first collection</p>
      <p className="mt-1 text-sm text-muted">
        Organize movies into lists like Marvel Collection, Weekend Movies, or Horror Nights.
      </p>
    </div>
  );
}
