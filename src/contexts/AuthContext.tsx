import { createContext, useContext, useEffect, useState } from "react";
import * as auth from "../lib/auth";
import type { Session, User } from "../lib/types";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signUp: (email: string, password: string) => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Initialize session
    const currentSession = auth.getCurrentSession();
    setSession(currentSession);
    setUser(currentSession?.user ?? null);
    setLoading(false);
  }, []);

  const handleSignUp = async (email: string, password: string) => {
    const { error } = auth.signUp(email, password);

    if (!error) {
      const currentSession = auth.getCurrentSession();
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
    }

    return { error: error ? { message: error } : null };
  };

  const handleSignIn = async (email: string, password: string) => {
    const { error } = auth.signIn(email, password);

    if (!error) {
      const currentSession = auth.getCurrentSession();
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
    }

    return { error: error ? { message: error } : null };
  };

  const handleSignOut = async () => {
    auth.signOut();
    setSession(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        loading,
        signUp: handleSignUp,
        signIn: handleSignIn,
        signOut: handleSignOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
