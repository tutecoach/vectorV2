import { createContext, useContext, useState, useEffect, useRef, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { User, Session } from "@supabase/supabase-js";

interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: AuthUser | null;
  session: Session | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signup: (email: string, password: string, name: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ success: boolean; error?: string }>;
}

const AuthContext = createContext<AuthContextType | null>(null);

/** Build a basic AuthUser from session data alone (no DB queries). */
function buildFallbackUser(supaUser: User): AuthUser {
  return {
    id: supaUser.id,
    name: supaUser.user_metadata?.name || supaUser.email || "",
    email: supaUser.email || "",
    role: "sin_rol",
  };
}

/** Build a complete AuthUser by querying profiles & user_roles tables. */
async function buildAuthUser(supaUser: User): Promise<AuthUser> {
  const [roleResult, profileResult] = await Promise.all([
    supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", supaUser.id)
      .maybeSingle(),
    supabase
      .from("profiles")
      .select("name")
      .eq("user_id", supaUser.id)
      .maybeSingle(),
  ]);

  return {
    id: supaUser.id,
    name: profileResult.data?.name || supaUser.user_metadata?.name || supaUser.email || "",
    email: supaUser.email || "",
    role: roleResult.data?.role || "sin_rol",
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;

    // 1) Listen to auth changes — SYNCHRONOUS handler only (no async DB calls).
    //    This avoids blocking the Supabase internal auth lock.
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, newSession) => {
        setSession(newSession);
        if (!newSession) {
          setUser(null);
        }
        setLoading(false);
      }
    );

    // 2) Check existing session on mount
    supabase.auth.getSession().then(({ data: { session: existing } }) => {
      if (!mounted.current) return;
      setSession(existing);
      if (!existing) {
        setUser(null);
      }
      setLoading(false);
    });

    return () => {
      mounted.current = false;
      subscription.unsubscribe();
    };
  }, []);

  // 3) Separate effect: load full user profile whenever session changes.
  //    This runs OUTSIDE the auth lock, so it won't cause timeouts.
  useEffect(() => {
    if (!session?.user) {
      setUser(null);
      return;
    }

    // Set a fast fallback immediately so the app can proceed
    const fallback = buildFallbackUser(session.user);
    setUser(fallback);

    let cancelled = false;

    buildAuthUser(session.user)
      .then((fullUser) => {
        if (!cancelled && mounted.current) setUser(fullUser);
      })
      .catch((err) => {
        console.warn("Could not load full user profile, using fallback:", err);
        // fallback is already set above — nothing extra to do
      });

    return () => { cancelled = true; };
  }, [session]);

  const login = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) return { success: false, error: error.message };
      return { success: true };
    } catch {
      return { success: false, error: "Error de conexión. Intente nuevamente." };
    }
  };

  const signup = async (email: string, password: string, name: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { name },
          emailRedirectTo: window.location.origin,
        },
      });
      if (error) return { success: false, error: error.message };
      // If email confirmation is required, user won't have a session yet
      if (data.user && !data.session) {
        return { success: true };
      }
      return { success: true };
    } catch {
      return { success: false, error: "Error de conexión. Intente nuevamente." };
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
  };

  const resetPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      if (error) return { success: false, error: error.message };
      return { success: true };
    } catch {
      return { success: false, error: "Error de conexión. Intente nuevamente." };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: !!session,
        user,
        session,
        loading,
        login,
        signup,
        logout,
        resetPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}
