"use client";

import { createContext, useContext, useEffect, useState, useSyncExternalStore, type ReactNode } from "react";
import type { User } from "firebase/auth";
import { onAuthChange, logoutUser } from "@/lib/firebase/auth";
import { isFirebaseConfigured } from "@/lib/firebase/client";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAdmin: boolean;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  isAdmin: false,
  logout: async () => {},
});

export function useAuth() {
  return useContext(AuthContext);
}

// Simple admin check - in production, use Firebase Custom Claims or Firestore
const ADMIN_EMAILS = ["admin@coinoriginal.ma"];

function useMounted() {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const mounted = useMounted();

  useEffect(() => {
    if (!isFirebaseConfigured()) {
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthChange((firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // During SSR/hydration, always return null user to avoid hydration mismatch
  const safeUser = mounted ? user : null;
  const safeLoading = mounted ? loading : true;

  const isAdmin = safeUser ? ADMIN_EMAILS.includes(safeUser.email ?? "") : false;

  const logout = async () => {
    await logoutUser();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user: safeUser, loading: safeLoading, isAdmin, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
