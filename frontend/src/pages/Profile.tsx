import { CheckCircle2, Heart, ListVideo, LogOut, Mail, MapPin, Phone, Plus, Star, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { authApi, profileApi, recommendationApi } from "../api/movieverse";
import { GENRE_OPTIONS, type Preference } from "../api/types";
import OtpInput from "../components/OtpInput";
import { Button, Chip, Input, PageLoader } from "../components/ui";
import { useAuth } from "../context/AuthContext";
import { memberSince } from "../lib/format";

const slug = (g: string) => g.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

export default function Profile() {
  const { user, loading, refreshUser, logout } = useAuth();
  const navigate = useNavigate();
  const [editing, setEditing] = useState(false);
  const [changingPw, setChangingPw] = useState(false);

  // Re-fetch GET /profile on load so stats (watched/favorites/…) reflect activity
  // from elsewhere in the session. Context stays the store; this just refreshes it.
  useEffect(() => {
    refreshUser().catch(() => toast.error("Unable to load your profile statistics."));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading || !user) return <PageLoader />;

  const stats = [
    { label: "Watched", value: user.watched_count, icon: CheckCircle2 },
    { label: "Favorites", value: user.favorites_count, icon: Heart },
    { label: "Watchlist", value: user.watchlist_count, icon: ListVideo },
    { label: "Reviews", value: user.reviews_count, icon: Star },
  ];

  return (
    <div className="mx-auto max-w-3xl animate-in">
      {/* Header card */}
      <div className="relative overflow-hidden rounded-2xl gradient-hero p-8">
        <div className="absolute inset-0 bg-black/30" />
        <div className="relative flex flex-col items-center gap-4 sm:flex-row">
          <span className="grid h-24 w-24 place-items-center overflow-hidden rounded-full gradient-primary text-3xl font-bold ring-4 ring-white/10">
            {user.profile_image_url ? (
              <img src={user.profile_image_url} className="h-full w-full object-cover" alt="" />
            ) : (
              user.full_name[0]?.toUpperCase()
            )}
          </span>
          <div className="text-center sm:text-left">
            <h1 className="text-2xl font-bold">{user.full_name}</h1>
            <p className="text-text-secondary">@{user.username}</p>
            <p className="mt-1 text-sm text-muted">Member since {memberSince(user.created_at)}</p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-4">
        {stats.map(({ label, value, icon: Icon }) => (
          <div key={label} className="rounded-xl bg-card p-4 text-center">
            <Icon className="mx-auto mb-1 text-primary" size={20} />
            <p className="text-2xl font-bold">{value}</p>
            <p className="text-xs text-muted">{label}</p>
          </div>
        ))}
      </div>

      {/* Genre preferences */}
      <GenrePreferences />

      {/* Info */}
      <div className="mt-4 space-y-3 rounded-xl bg-card p-5">
        <Row icon={Mail} value={user.email} />
        <Row icon={Phone} value={user.phone_number || "—"} />
        <Row icon={MapPin} value={user.country || "—"} />
        <div>
          <p className="mb-2 text-sm text-muted">Favorite genres</p>
          <div className="flex flex-wrap gap-2">
            {user.favorite_genres.length ? (
              user.favorite_genres.map((g) => (
                <span key={g.id} className="rounded-full bg-chip px-3 py-1 text-xs">{g.name}</span>
              ))
            ) : (
              <span className="text-sm text-muted">None selected</span>
            )}
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="mt-4 flex flex-wrap gap-3">
        <Button onClick={() => setEditing(true)}>Edit Profile</Button>
        <Button variant="secondary" onClick={() => setChangingPw(true)}>Change Password</Button>
        <Button variant="ghost" className="text-red-400" onClick={() => { logout(); navigate("/login"); }}>
          <LogOut size={18} /> Logout
        </Button>
      </div>

      {editing && <EditProfileModal onClose={() => setEditing(false)} onSaved={refreshUser} />}
      {changingPw && <ChangePasswordModal onClose={() => setChangingPw(false)} />}
    </div>
  );
}

function GenrePreferences() {
  const [prefs, setPrefs] = useState<Preference[] | null>(null);
  const [adding, setAdding] = useState(false);
  const [choice, setChoice] = useState("");

  // Single source of truth: always (re)load the list from the backend.
  const loadPrefs = () =>
    recommendationApi
      .preferences()
      .then(setPrefs)
      .catch(() => {
        setPrefs([]);
        toast.error("Unable to load genre preferences.");
      });

  useEffect(() => {
    loadPrefs();
  }, []);

  // Genres not already saved, for the add dropdown.
  const available = GENRE_OPTIONS.filter(
    (g) => !(prefs || []).some((p) => p.genre.toLowerCase() === g.toLowerCase())
  );

  async function add() {
    if (!choice) return;
    setAdding(true);
    try {
      await recommendationApi.addPreference(choice);
      setChoice(""); // reset dropdown so the same value can't be re-submitted
      await loadPrefs(); // refresh from backend rather than mutating stale state
      toast.success("Genre added");
    } catch (err: unknown) {
      const status = (err as { response?: { status?: number } })?.response?.status;
      toast.error(status === 409 ? "Genre already exists." : "Could not add genre.");
    } finally {
      setAdding(false);
    }
  }

  async function remove(pref: Preference) {
    try {
      await recommendationApi.deletePreference(pref.id);
      await loadPrefs(); // refresh from backend
      toast.success("Genre removed");
    } catch {
      toast.error("Could not remove genre.");
    }
  }

  return (
    <div className="mt-4 rounded-xl bg-card p-5">
      <p className="mb-3 text-sm font-semibold">Genre Preferences</p>
      {prefs === null ? (
        <p className="text-sm text-muted">Loading…</p>
      ) : (
        <div className="flex flex-wrap items-center gap-2">
          {prefs.length === 0 && (
            <span className="text-sm text-muted">No preferences yet. Add one below.</span>
          )}
          {prefs.map((p) => (
            <span
              key={p.id}
              className="inline-flex items-center gap-1.5 rounded-full bg-chip px-3 py-1 text-xs"
            >
              {p.genre}
              <button
                onClick={() => remove(p)}
                aria-label={`Remove ${p.genre}`}
                className="text-muted transition-colors hover:text-red-400"
              >
                <X size={13} />
              </button>
            </span>
          ))}
        </div>
      )}
      <div className="mt-4 flex flex-wrap items-center gap-2">
        <select
          value={choice}
          onChange={(e) => setChoice(e.target.value)}
          className="rounded-lg border border-border bg-surface px-3 py-2 text-sm outline-none focus:border-primary"
        >
          <option value="">Add a genre…</option>
          {available.map((g) => (
            <option key={g} value={g}>
              {g}
            </option>
          ))}
        </select>
        <Button onClick={add} loading={adding} disabled={!choice}>
          <Plus size={16} /> Add
        </Button>
      </div>
    </div>
  );
}

function Row({ icon: Icon, value }: { icon: any; value: string }) {
  return (
    <div className="flex items-center gap-3 text-sm">
      <Icon size={16} className="text-muted" />
      <span className="text-text-secondary">{value}</span>
    </div>
  );
}

function Modal({ title, children, onClose }: { title: string; children: any; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4" onClick={onClose}>
      <div className="w-full max-w-md rounded-2xl border border-border bg-card p-6 animate-in" onClick={(e) => e.stopPropagation()}>
        <h3 className="mb-4 text-lg font-bold">{title}</h3>
        {children}
      </div>
    </div>
  );
}

function EditProfileModal({ onClose, onSaved }: { onClose: () => void; onSaved: () => void }) {
  const { user } = useAuth();
  const [form, setForm] = useState({
    full_name: user!.full_name,
    username: user!.username || "",
    phone_number: user!.phone_number || "",
    country: user!.country || "",
    profile_image_url: user!.profile_image_url || "",
  });
  const [genres, setGenres] = useState<string[]>(user!.favorite_genres.map((g) => g.name));
  const [saving, setSaving] = useState(false);

  const toggle = (g: string) =>
    setGenres((p) => (p.includes(g) ? p.filter((x) => x !== g) : [...p, g]));

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      await profileApi.update({ ...form, favorite_genres: genres.map(slug) });
      await onSaved();
      toast.success("Profile updated");
      onClose();
    } catch {
      toast.error("Update failed");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Modal title="Edit Profile" onClose={onClose}>
      <form onSubmit={save} className="space-y-3">
        <Input label="Full name" value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} />
        <Input label="Username" value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} />
        <Input label="Phone" value={form.phone_number} onChange={(e) => setForm({ ...form, phone_number: e.target.value })} />
        <Input label="Country" value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })} />
        <Input label="Profile image URL" value={form.profile_image_url} onChange={(e) => setForm({ ...form, profile_image_url: e.target.value })} />
        <div>
          <p className="mb-2 text-sm text-text-secondary">Favorite genres</p>
          <div className="flex flex-wrap gap-2">
            {GENRE_OPTIONS.map((g) => (
              <Chip key={g} active={genres.includes(g)} onClick={() => toggle(g)}>{g}</Chip>
            ))}
          </div>
        </div>
        <div className="flex gap-2 pt-2">
          <Button type="submit" loading={saving} className="flex-1">Save</Button>
          <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>
        </div>
      </form>
    </Modal>
  );
}

function ChangePasswordModal({ onClose }: { onClose: () => void }) {
  const [step, setStep] = useState<"form" | "otp">("form");
  const [cur, setCur] = useState("");
  const [pw, setPw] = useState("");
  const [confirm, setConfirm] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  async function start(e: React.FormEvent) {
    e.preventDefault();
    if (pw !== confirm) return toast.error("Passwords do not match");
    setLoading(true);
    try {
      await authApi.changePassword(cur, pw, confirm);
      toast.success("OTP sent to your email (dev: 123456)");
      setStep("otp");
    } catch (err: any) {
      toast.error(err.response?.data?.detail || "Failed");
    } finally {
      setLoading(false);
    }
  }

  async function verify(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      await authApi.verifyChangePassword(otp, pw, confirm);
      toast.success("Password changed");
      onClose();
    } catch (err: any) {
      toast.error(err.response?.data?.detail || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Modal title="Change Password" onClose={onClose}>
      {step === "form" ? (
        <form onSubmit={start} className="space-y-3">
          <Input label="Current password" type="password" value={cur} onChange={(e) => setCur(e.target.value)} required />
          <Input label="New password" type="password" value={pw} onChange={(e) => setPw(e.target.value)} required />
          <Input label="Confirm new password" type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} required />
          <Button type="submit" loading={loading} className="w-full">Continue</Button>
        </form>
      ) : (
        <form onSubmit={verify} className="space-y-4">
          <p className="text-sm text-text-secondary">Enter the code sent to your email.</p>
          <OtpInput value={otp} onChange={setOtp} />
          <Button type="submit" loading={loading} className="w-full" disabled={otp.length < 6}>
            Confirm change
          </Button>
        </form>
      )}
    </Modal>
  );
}
