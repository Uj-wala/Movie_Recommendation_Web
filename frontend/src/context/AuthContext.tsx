import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { profileApi } from "../api/movieverse";
import type { Profile } from "../api/types";

interface AuthState {
  user: Profile | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (access: string, refresh: string) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthState | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  async function loadUser() {
    if (!localStorage.getItem("access_token")) {
      setUser(null);
      setLoading(false);
      return;
    }
    try {
      const profile = await profileApi.get();
      setUser(profile);
      localStorage.setItem("is_admin", String(profile.is_admin));
    } catch (e) {
      setUser(null);
      throw e; // let callers (e.g. the Profile page) surface a toast
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    // Boot: sync the persisted session into React. Legit external-state sync.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadUser().catch(() => {}); // interceptor handles 401, no toast needed
  }, []);

  async function login(access: string, refresh: string) {
    localStorage.setItem("access_token", access);
    localStorage.setItem("refresh_token", refresh);
    setLoading(true);
    await loadUser();
  }

  function logout() {
    localStorage.clear();
    setUser(null);
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: !!user,
        login,
        logout,
        refreshUser: loadUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
