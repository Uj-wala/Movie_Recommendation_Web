import { Moon, Sun } from "lucide-react";
import { useTheme } from "../context/ThemeContext";

export default function ThemeToggle() {
  const { theme, toggle } = useTheme();
  return (
    <button
      onClick={toggle}
      className="rounded-lg p-2 transition-colors hover:bg-chip"
      aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
    >
      {/* key forces remount so the spin-in animation replays on each toggle */}
      <span key={theme} className="block animate-in">
        {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
      </span>
    </button>
  );
}
