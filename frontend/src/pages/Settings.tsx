import { Bell, Globe, Lock, Palette } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { profileApi } from "../api/movieverse";
import { Button, PageLoader } from "../components/ui";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";

export default function Settings() {
  const { user, loading, refreshUser } = useAuth();
  const { theme, setTheme } = useTheme();
  const [emailNotif, setEmailNotif] = useState(user?.email_notifications ?? true);
  const [language, setLanguage] = useState(user?.preferred_language ?? "en");
  const [saving, setSaving] = useState(false);

  if (loading || !user) return <PageLoader />;

  async function save() {
    setSaving(true);
    try {
      await profileApi.update({ email_notifications: emailNotif, preferred_language: language });
      await refreshUser();
      toast.success("Settings saved");
    } catch {
      toast.error("Could not save settings");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="mb-6 text-2xl font-bold">Settings</h1>

      <Section icon={Palette} title="Theme">
        <div className="flex items-center justify-between">
          <span className="text-sm text-text-secondary">Appearance</span>
          <div className="flex gap-2">
            {(["dark", "light"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTheme(t)}
                className={`rounded-lg px-3 py-1.5 text-sm capitalize transition-colors ${
                  theme === t ? "gradient-primary text-white" : "bg-chip hover:bg-chip-hover"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      </Section>

      <Section icon={Globe} title="Language">
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm outline-none focus:border-primary"
        >
          <option value="en">English</option>
          <option value="es">Español</option>
          <option value="fr">Français</option>
          <option value="hi">हिन्दी</option>
        </select>
      </Section>

      <Section icon={Bell} title="Notifications">
        <label className="flex items-center justify-between">
          <span className="text-sm text-text-secondary">Email notifications</span>
          <input
            type="checkbox"
            checked={emailNotif}
            onChange={(e) => setEmailNotif(e.target.checked)}
            className="h-5 w-5 accent-primary"
          />
        </label>
      </Section>

      <Section icon={Lock} title="Privacy">
        <p className="text-sm text-muted">
          Your data is private. Reviews you post are visible to other users under your name.
        </p>
      </Section>

      <Button onClick={save} loading={saving} className="mt-2">Save changes</Button>
    </div>
  );
}

function Section({ icon: Icon, title, children }: { icon: any; title: string; children: any }) {
  return (
    <div className="mb-4 rounded-xl bg-card p-5">
      <div className="mb-3 flex items-center gap-2 font-semibold">
        <Icon size={18} className="text-primary" /> {title}
      </div>
      {children}
    </div>
  );
}
