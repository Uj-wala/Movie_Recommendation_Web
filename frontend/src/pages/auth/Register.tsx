import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { authApi } from "../../api/movieverse";
import { GENRE_OPTIONS } from "../../api/types";
import { Button, Chip, Input } from "../../components/ui";
import AuthShell from "./AuthShell";

const slug = (g: string) => g.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

export default function Register() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [genres, setGenres] = useState<string[]>([]);
  const [form, setForm] = useState({
    full_name: "",
    email: "",
    phone_number: "",
    date_of_birth: "",
    gender: "",
    country: "",
    password: "",
    confirm_password: "",
  });

  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const toggleGenre = (g: string) =>
    setGenres((prev) => (prev.includes(g) ? prev.filter((x) => x !== g) : [...prev, g]));

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (form.password !== form.confirm_password) {
      toast.error("Passwords do not match");
      return;
    }
    if (form.password.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }
    setLoading(true);
    try {
      await authApi.register({ ...form, favorite_genres: genres.map(slug) } as any);
      toast.success("Account created! Sign in with an OTP.");
      navigate("/login");
    } catch (err: any) {
      toast.error(err.response?.data?.detail || "Registration failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthShell title="Create your account" subtitle="Join MovieVerse AI in a minute.">
      <form onSubmit={submit} className="space-y-4">
        <Input label="Full name" value={form.full_name} onChange={(e) => set("full_name", e.target.value)} required />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Input label="Email" type="email" value={form.email} onChange={(e) => set("email", e.target.value)} required />
          <Input label="Phone number" type="tel" value={form.phone_number} onChange={(e) => set("phone_number", e.target.value)} required />
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Input label="Date of birth" type="date" value={form.date_of_birth} onChange={(e) => set("date_of_birth", e.target.value)} required />
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-text-secondary">Gender</span>
            <select
              value={form.gender}
              onChange={(e) => set("gender", e.target.value)}
              required
              className="w-full rounded-lg border border-border bg-surface px-4 py-2.5 text-text outline-none focus:border-primary"
            >
              <option value="" disabled>Select</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
              <option value="prefer_not_to_say">Prefer not to say</option>
            </select>
          </label>
        </div>
        <Input label="Country" value={form.country} onChange={(e) => set("country", e.target.value)} required />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Input label="Password" type="password" value={form.password} onChange={(e) => set("password", e.target.value)} required />
          <Input label="Confirm password" type="password" value={form.confirm_password} onChange={(e) => set("confirm_password", e.target.value)} required />
        </div>
        <div>
          <span className="mb-2 block text-sm font-medium text-text-secondary">Favorite genres</span>
          <div className="flex flex-wrap gap-2">
            {GENRE_OPTIONS.map((g) => (
              <Chip key={g} active={genres.includes(g)} onClick={() => toggleGenre(g)}>
                {g}
              </Chip>
            ))}
          </div>
        </div>
        <Button type="submit" loading={loading} className="w-full">
          Create account
        </Button>
      </form>
      <p className="mt-6 text-center text-sm text-muted">
        Already have an account?{" "}
        <Link to="/login" className="font-semibold text-primary hover:underline">
          Sign in
        </Link>
      </p>
    </AuthShell>
  );
}
