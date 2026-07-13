import {
  ArrowLeft,
  Compass,
  Copy,
  Edit3,
  Eye,
  EyeOff,
  FolderHeart,
  Plus,
  Search,
  Share2,
  Trash2,
  X,
} from "lucide-react";
import { useEffect, useMemo, useState, type FormEvent, type ReactNode } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { collectionsApi, type MovieCollection } from "../api/movieverse";
import { Button, PageLoader } from "../components/ui";
import { useToast } from "../context/ToastContext";
import { formatRatingOutOf5 } from "../lib/format";
import { omdbPoster } from "../lib/omdb";

function movieHref(movieId: string) {
  return movieId.startsWith("tt") ? `/omdb/movie/${movieId}` : `/movie/${movieId}`;
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function visibilityText(collection: MovieCollection) {
  return collection.visibility ? "Public" : "Private";
}

function movieCount(collection: MovieCollection) {
  return collection.movie_count ?? collection.movies.length;
}

function collectionCover(collection: MovieCollection) {
  return collection.movies.find((movie) => movie.poster)?.poster || null;
}

function publicCollectionUrl(collectionId: string) {
  return `${window.location.origin}/collections/public/${collectionId}`;
}

function uniqueCopyName(name: string, collections: MovieCollection[]) {
  const names = new Set(collections.map((item) => item.name.trim().toLowerCase()));
  const base = `${name} Copy`;
  if (!names.has(base.toLowerCase())) return base;

  let index = 2;
  while (names.has(`${base} ${index}`.toLowerCase())) index += 1;
  return `${base} ${index}`;
}

export default function Collections() {
  const { collectionId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const isPublic = location.pathname.startsWith("/collections/public");
  const [collections, setCollections] = useState<MovieCollection[]>([]);
  const [collection, setCollection] = useState<MovieCollection | null>(null);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<MovieCollection | null>(null);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setCollection(null);

    const request = collectionId
      ? isPublic
        ? collectionsApi.getPublic(collectionId)
        : collectionsApi.get(collectionId)
      : isPublic
        ? collectionsApi.publicList(query.trim() || undefined)
        : collectionsApi.list();

    request
      .then((data) => {
        if (!active) return;
        if (Array.isArray(data)) {
          setCollections(data);
        } else {
          setCollection(data);
        }
      })
      .catch(() => showToast("Could not load collections", "error"))
      .finally(() => active && setLoading(false));

    return () => {
      active = false;
    };
  }, [collectionId, isPublic, query, showToast]);

  const visibleCollections = useMemo(() => {
    const term = query.trim().toLowerCase();
    const filtered =
      !term || isPublic
        ? collections
        : collections.filter((item) =>
            [item.name, item.owner_name || ""].some((value) => value.toLowerCase().includes(term))
          );

    return [...filtered].sort((a, b) =>
      sortOrder === "newest"
        ? new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        : new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
    );
  }, [collections, isPublic, query, sortOrder]);

  function openCreateModal() {
    setEditing(null);
    setModalOpen(true);
  }

  function openEditModal(item: MovieCollection) {
    setEditing(item);
    setModalOpen(true);
  }

  function upsertCollection(saved: MovieCollection) {
    setCollections((current) => {
      const exists = current.some((item) => item.id === saved.id);
      return exists
        ? current.map((item) => (item.id === saved.id ? saved : item))
        : [saved, ...current];
    });
    setCollection((current) => (current?.id === saved.id ? saved : current));
  }

  async function deleteCollection(item: MovieCollection) {
    if (!confirm(`Delete "${item.name}"?`)) return;
    try {
      await collectionsApi.remove(item.id);
      setCollections((current) => current.filter((collectionItem) => collectionItem.id !== item.id));
      showToast("Collection deleted");
      if (collectionId === item.id) navigate("/collections");
    } catch {
      showToast("Could not delete collection", "error");
    }
  }

  async function duplicateCollection(item: MovieCollection) {
    try {
      const created = await collectionsApi.create(
        uniqueCopyName(item.name, collections),
        item.description,
        item.visibility
      );
      await Promise.all(
        item.movies.map((movie) =>
          collectionsApi.addMovie(created.id, {
            movie_id: movie.movie_id,
            internal_movie_id: movie.internal_movie_id,
            movie_title: movie.movie_title,
            poster: movie.poster,
            genre: movie.genre,
            year: movie.year,
            imdb_rating: movie.imdb_rating,
          })
        )
      );
      upsertCollection(await collectionsApi.get(created.id));
      showToast("Collection duplicated");
    } catch (error: any) {
      showToast(error.response?.data?.message || "Could not duplicate collection", "error");
    }
  }

  async function sharePublicCollection(item: MovieCollection) {
    if (!item.visibility) {
      showToast("Make this collection public before sharing", "error");
      return;
    }

    try {
      await navigator.clipboard.writeText(publicCollectionUrl(item.id));
      showToast("Public collection link copied");
    } catch {
      showToast("Could not copy share link", "error");
    }
  }

  async function removeMovie(movieId: string) {
    if (!collection) return;
    try {
      await collectionsApi.removeMovie(collection.id, movieId);
      setCollection({
        ...collection,
        movies: collection.movies.filter((movie) => movie.movie_id !== movieId),
      });
      showToast("Movie removed from collection");
    } catch {
      showToast("Could not remove movie", "error");
    }
  }

  if (loading) return <PageLoader />;

  if (collectionId && collection) {
    return (
      <CollectionDetails
        collection={collection}
        isPublic={isPublic}
        onEdit={() => openEditModal(collection)}
        onDelete={() => deleteCollection(collection)}
        onShare={() => sharePublicCollection(collection)}
        onRemoveMovie={removeMovie}
      >
        {modalOpen && (
          <CollectionModal
            collections={collections}
            editing={editing}
            onClose={() => setModalOpen(false)}
            onSaved={upsertCollection}
          />
        )}
      </CollectionDetails>
    );
  }

  return (
    <div className="animate-in space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-bold">
            <FolderHeart className="text-primary" />
            {isPublic ? "Public Collections" : "Collections"}
          </h1>
          <p className="mt-1 text-sm text-muted">
            {isPublic ? "Browse public movie lists from other users." : "Organize your movies into focused lists."}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            to={isPublic ? "/collections" : "/collections/public"}
            className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-semibold hover:bg-chip"
          >
            {isPublic ? <FolderHeart size={16} /> : <Compass size={16} />}
            {isPublic ? "My Collections" : "Public Collections"}
          </Link>
          {!isPublic && (
            <Button type="button" onClick={openCreateModal}>
              <Plus size={16} /> New Collection
            </Button>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <label className="flex min-w-0 flex-1 items-center gap-2 rounded-lg border border-border bg-surface px-3 py-2 sm:max-w-xl">
          <Search size={17} className="text-muted" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by collection name or owner name"
            className="min-w-0 flex-1 bg-transparent text-sm outline-none"
          />
        </label>
        <label className="flex items-center gap-2 rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text-secondary">
          Sort
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value as "newest" | "oldest")}
            className="bg-transparent font-semibold text-text outline-none"
          >
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
          </select>
        </label>
      </div>

      {visibleCollections.length === 0 ? (
        <EmptyState isPublic={isPublic} onCreate={openCreateModal} />
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          {visibleCollections.map((item) =>
            isPublic ? (
              <PublicCollectionCard key={item.id} collection={item} onShare={() => sharePublicCollection(item)} />
            ) : (
              <CollectionCard
                key={item.id}
                collection={item}
                onEdit={() => openEditModal(item)}
                onDelete={() => deleteCollection(item)}
                onDuplicate={() => duplicateCollection(item)}
                onShare={() => sharePublicCollection(item)}
              />
            )
          )}
        </div>
      )}

      {modalOpen && (
        <CollectionModal
          collections={collections}
          editing={editing}
          onClose={() => setModalOpen(false)}
          onSaved={upsertCollection}
        />
      )}
    </div>
  );
}

function CollectionCard({
  collection,
  onEdit,
  onDelete,
  onDuplicate,
  onShare,
}: {
  collection: MovieCollection;
  onEdit: () => void;
  onDelete: () => void;
  onDuplicate: () => void;
  onShare: () => void;
}) {
  const cover = collectionCover(collection);

  return (
    <article className="overflow-hidden rounded-lg border border-border bg-card">
      <Link to={`/collections/${collection.id}`} className="block h-32 bg-surface">
        {cover ? (
          <img src={omdbPoster(cover)} alt="" className="h-full w-full object-cover" loading="lazy" />
        ) : (
          <div className="grid h-full place-items-center text-primary">
            <FolderHeart size={34} />
          </div>
        )}
      </Link>
      <div className="p-4">
      <div className="flex items-start justify-between gap-3">
        <Link to={`/collections/${collection.id}`} className="min-w-0">
          <h2 className="truncate text-lg font-bold hover:text-primary">{collection.name}</h2>
          <p className="mt-1 line-clamp-2 min-h-[2.5rem] text-sm text-muted">
            {collection.description || "No description added."}
          </p>
        </Link>
        <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-chip px-2 py-1 text-xs text-muted">
          {collection.visibility ? <Eye size={13} /> : <EyeOff size={13} />}
          {visibilityText(collection)}
        </span>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
        <Stat label="Movies" value={String(movieCount(collection))} />
        <Stat label="Created" value={formatDate(collection.created_at)} />
      </div>
      <div className="mt-4 flex gap-2">
        <Link
          to={`/collections/${collection.id}`}
          className="inline-flex flex-1 items-center justify-center rounded-lg border border-border px-3 py-2 text-sm font-semibold hover:bg-chip"
        >
          View Collection
        </Link>
        <button type="button" onClick={onEdit} className="rounded-lg border border-border p-2 hover:bg-chip" title="Edit">
          <Edit3 size={16} />
        </button>
        <button
          type="button"
          onClick={onDuplicate}
          className="rounded-lg border border-border p-2 hover:bg-chip"
          title="Duplicate"
        >
          <Copy size={16} />
        </button>
        {collection.visibility && (
          <button
            type="button"
            onClick={onShare}
            className="rounded-lg border border-border p-2 hover:bg-chip"
            title="Copy public link"
          >
            <Share2 size={16} />
          </button>
        )}
        <button
          type="button"
          onClick={onDelete}
          className="rounded-lg border border-red-500/40 p-2 text-red-300 hover:bg-red-500/10"
          title="Delete"
        >
          <Trash2 size={16} />
        </button>
      </div>
      </div>
    </article>
  );
}

function PublicCollectionCard({ collection, onShare }: { collection: MovieCollection; onShare: () => void }) {
  const cover = collectionCover(collection);

  return (
    <article className="overflow-hidden rounded-lg border border-border bg-card">
      <Link to={`/collections/public/${collection.id}`} className="block h-32 bg-surface">
        {cover ? (
          <img src={omdbPoster(cover)} alt="" className="h-full w-full object-cover" loading="lazy" />
        ) : (
          <div className="grid h-full place-items-center text-primary">
            <FolderHeart size={34} />
          </div>
        )}
      </Link>
      <div className="p-4">
      <h2 className="truncate text-lg font-bold">{collection.name}</h2>
      <p className="mt-1 text-sm text-muted">Owner: {collection.owner || collection.owner_name || "Movie fan"}</p>
      <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
        <Stat label="Movies" value={String(movieCount(collection))} />
        <Stat label="Created" value={formatDate(collection.created_at)} />
      </div>
      <div className="mt-4 flex gap-2">
        <Link
          to={`/collections/public/${collection.id}`}
          className="inline-flex flex-1 items-center justify-center rounded-lg border border-border px-3 py-2 text-sm font-semibold hover:bg-chip"
        >
          View Collection
        </Link>
        <button
          type="button"
          onClick={onShare}
          className="rounded-lg border border-border p-2 hover:bg-chip"
          title="Copy public link"
        >
          <Share2 size={16} />
        </button>
      </div>
      </div>
    </article>
  );
}

function CollectionDetails({
  collection,
  isPublic,
  onEdit,
  onDelete,
  onShare,
  onRemoveMovie,
  children,
}: {
  collection: MovieCollection;
  isPublic: boolean;
  onEdit: () => void;
  onDelete: () => void;
  onShare: () => void;
  onRemoveMovie: (movieId: string) => void;
  children: ReactNode;
}) {
  const cover = collectionCover(collection);

  return (
    <div className="animate-in space-y-6">
      <Link
        to={isPublic ? "/collections/public" : "/collections"}
        className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-text"
      >
        <ArrowLeft size={16} /> Back to Collections
      </Link>

      <section className="overflow-hidden rounded-lg border border-border bg-card">
        <div className="h-44 bg-surface sm:h-56">
          {cover ? (
            <img src={omdbPoster(cover)} alt="" className="h-full w-full object-cover" loading="lazy" />
          ) : (
            <div className="grid h-full place-items-center text-primary">
              <FolderHeart size={44} />
            </div>
          )}
        </div>
        <div className="p-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="min-w-0">
            <div className="mb-2 flex flex-wrap items-center gap-2">
              <h1 className="text-2xl font-bold">{collection.name}</h1>
              <span className="rounded-full bg-chip px-2 py-1 text-xs text-muted">
                {visibilityText(collection)}
              </span>
            </div>
            <p className="max-w-3xl text-sm text-muted">
              {collection.description || "No description added."}
            </p>
            {isPublic && (
              <p className="mt-2 text-sm text-text-secondary">
                Owner: {collection.owner || collection.owner_name || "Movie fan"}
              </p>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            {collection.visibility && (
              <button
                type="button"
                onClick={onShare}
                className="inline-flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm font-semibold hover:bg-chip"
              >
                <Share2 size={15} /> Share
              </button>
            )}
            {!isPublic && (
              <>
              <button
                type="button"
                onClick={onEdit}
                className="inline-flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm font-semibold hover:bg-chip"
              >
                <Edit3 size={15} /> Edit
              </button>
              <button
                type="button"
                onClick={onDelete}
                className="inline-flex items-center gap-2 rounded-lg border border-red-500/40 px-3 py-2 text-sm font-semibold text-red-300 hover:bg-red-500/10"
              >
                <Trash2 size={15} /> Delete
              </button>
              </>
            )}
          </div>
        </div>
        <div className="mt-5 grid max-w-lg grid-cols-2 gap-3 text-sm">
          <Stat label="Total Movies" value={String(movieCount(collection))} />
          <Stat label="Created" value={formatDate(collection.created_at)} />
        </div>
        </div>
      </section>

      {collection.movies.length === 0 ? (
        <div className="rounded-lg border border-border bg-card p-12 text-center">
          <FolderHeart size={38} className="mx-auto mb-3 text-primary" />
          <p className="font-semibold">No movies in this collection yet</p>
          {!isPublic && (
            <p className="mt-1 text-sm text-muted">Open any movie details page and add it to this collection.</p>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          {collection.movies.map((movie) => (
            <article key={movie.id} className="flex min-w-0 gap-3 rounded-lg border border-border bg-card p-3">
              <Link to={movieHref(movie.movie_id)} className="shrink-0">
                <img
                  src={omdbPoster(movie.poster || "")}
                  alt={movie.movie_title}
                  className="h-28 w-20 rounded-lg object-cover"
                />
              </Link>
              <div className="min-w-0 flex-1">
                <Link to={movieHref(movie.movie_id)} className="font-semibold hover:text-primary">
                  {movie.movie_title}
                </Link>
                <p className="text-xs text-muted">{movie.year || "Year unknown"}</p>
                <p className="mt-1 text-sm text-rating">IMDb {formatRatingOutOf5(movie.imdb_rating)}</p>
                {!isPublic && (
                  <button
                    type="button"
                    onClick={() => onRemoveMovie(movie.movie_id)}
                    className="mt-3 inline-flex items-center gap-1.5 rounded-lg bg-chip px-2.5 py-1.5 text-xs font-semibold text-red-300 hover:bg-chip-hover"
                  >
                    <Trash2 size={13} /> Remove
                  </button>
                )}
              </div>
            </article>
          ))}
        </div>
      )}
      {children}
    </div>
  );
}

function CollectionModal({
  collections,
  editing,
  onClose,
  onSaved,
}: {
  collections: MovieCollection[];
  editing: MovieCollection | null;
  onClose: () => void;
  onSaved: (collection: MovieCollection) => void;
}) {
  const { showToast } = useToast();
  const [name, setName] = useState(editing?.name || "");
  const [description, setDescription] = useState(editing?.description || "");
  const [visibility, setVisibility] = useState(editing?.visibility || false);
  const [saving, setSaving] = useState(false);

  async function submit(e: FormEvent) {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) {
      showToast("Collection name is required", "error");
      return;
    }
    const duplicate = collections.some(
      (item) => item.id !== editing?.id && item.name.trim().toLowerCase() === trimmed.toLowerCase()
    );
    if (duplicate) {
      showToast("Duplicate collection names are not allowed", "error");
      return;
    }

    setSaving(true);
    try {
      const saved = editing
        ? await collectionsApi.update(editing.id, {
            name: trimmed,
            description: description.trim() || null,
            visibility,
          })
        : await collectionsApi.create(trimmed, description.trim() || null, visibility);
      onSaved(saved);
      showToast(editing ? "Collection updated" : "Collection created");
      onClose();
    } catch (error: any) {
      showToast(error.response?.data?.message || "Could not save collection", "error");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div
      className="animate-modal-backdrop fixed inset-0 z-[100] grid place-items-center overflow-y-auto bg-black/60 p-3 backdrop-blur-sm sm:p-4"
      onClick={onClose}
    >
      <form
        onSubmit={submit}
        className="animate-soft-pop max-h-[calc(100dvh-1.5rem)] w-full max-w-lg overflow-y-auto rounded-lg border border-border bg-card p-4 shadow-2xl shadow-black/50 sm:max-h-[calc(100dvh-2rem)] sm:p-5"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold">{editing ? "Edit Collection" : "Create Collection"}</h2>
          <button type="button" onClick={onClose} className="rounded-lg p-1.5 hover:bg-chip">
            <X size={17} />
          </button>
        </div>
        <label className="mb-3 block">
          <span className="mb-1.5 block text-sm font-medium text-text-secondary">Collection Name</span>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm outline-none focus:border-primary"
          />
        </label>
        <label className="mb-3 block">
          <span className="mb-1.5 block text-sm font-medium text-text-secondary">Description</span>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            className="w-full resize-none rounded-lg border border-border bg-surface px-3 py-2 text-sm outline-none focus:border-primary"
          />
        </label>
        <div className="mb-5">
          <span className="mb-1.5 block text-sm font-medium text-text-secondary">Visibility</span>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            <button
              type="button"
              onClick={() => setVisibility(false)}
              className={`rounded-lg border px-3 py-2 text-sm font-semibold ${
                !visibility ? "border-primary bg-primary/10" : "border-border hover:bg-chip"
              }`}
            >
              Private
            </button>
            <button
              type="button"
              onClick={() => setVisibility(true)}
              className={`rounded-lg border px-3 py-2 text-sm font-semibold ${
                visibility ? "border-primary bg-primary/10" : "border-border hover:bg-chip"
              }`}
            >
              Public
            </button>
          </div>
        </div>
        <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" loading={saving}>
            {editing ? "Save Changes" : "Create Collection"}
          </Button>
        </div>
      </form>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-surface px-3 py-2">
      <p className="text-xs text-muted">{label}</p>
      <p className="truncate font-semibold">{value}</p>
    </div>
  );
}

function EmptyState({ isPublic, onCreate }: { isPublic: boolean; onCreate: () => void }) {
  return (
    <div className="rounded-lg border border-border bg-card p-12 text-center">
      <FolderHeart size={42} className="mx-auto mb-3 text-primary" />
      <p className="text-lg font-semibold">{isPublic ? "No public collections found" : "Create your first collection"}</p>
      <p className="mx-auto mt-1 max-w-md text-sm text-muted">
        {isPublic
          ? "Try searching another collection or owner name."
          : "Build lists for favorites, watch parties, genres, or anything else you want to remember."}
      </p>
      {!isPublic && (
        <Button type="button" onClick={onCreate} className="mt-4">
          <Plus size={16} /> New Collection
        </Button>
      )}
    </div>
  );
}
