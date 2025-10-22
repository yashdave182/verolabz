import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import {
  User,
  UserCredential,
  onAuthStateChanged,
  sendSignInLinkToEmail,
  isSignInWithEmailLink,
  signInWithEmailLink,
  setPersistence,
  browserLocalPersistence,
  signOut as firebaseSignOut,
  type ActionCodeSettings,
} from "firebase/auth";
import { auth } from "@/lib/firebase";
import { Navigate, useLocation } from "react-router-dom";

type AuthContextValue = {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  emailForSignIn: string | null;
  // Initiate email-link sign-in
  sendSignInLink: (email: string, options?: Partial<ActionCodeSettings>) => Promise<void>;
  // Complete sign-in if on the callback URL
  completeSignIn: (url?: string) => Promise<UserCredential | void>;
  // Sign out
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const EMAIL_FOR_SIGNIN_KEY = "emailForSignIn";

function getDefaultActionCodeSettings(): ActionCodeSettings {
  // Ensure the domain here is added under Firebase Authentication -> Settings -> Authorized domains
  const origin = typeof window !== "undefined" ? window.location.origin : "";
  return {
    url: `${origin}/auth/complete`,
    handleCodeInApp: true,
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [initializing, setInitializing] = useState(true);
  const [emailForSignIn, setEmailForSignIn] = useState<string | null>(() => {
    if (typeof window === "undefined") return null;
    try {
      return window.localStorage.getItem(EMAIL_FOR_SIGNIN_KEY);
    } catch {
      return null;
    }
  });

  useEffect(() => {
    // Persist auth state in localStorage so the user stays logged in across refreshes.
    setPersistence(auth, browserLocalPersistence).catch(() => {
      // If persistence cannot be set (e.g. private mode), Firebase will fallback.
    });

    const unsub = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setInitializing(false);
    });

    return () => unsub();
  }, []);

  // Auto-complete email-link sign-in if the user landed on the callback link
  useEffect(() => {
    if (typeof window === "undefined") return;

    const maybeComplete = async () => {
      try {
        const href = window.location.href;
        if (isSignInWithEmailLink(auth, href)) {
          let email = emailForSignIn ?? window.localStorage.getItem(EMAIL_FOR_SIGNIN_KEY);
          if (!email) {
            // Different device: prompt user for email for verification
            email = window.prompt("Please provide your email for confirmation") ?? undefined;
          }
          if (email) {
            const cred = await signInWithEmailLink(auth, email, href);
            window.localStorage.removeItem(EMAIL_FOR_SIGNIN_KEY);
            setEmailForSignIn(null);
            setUser(cred.user);
          }
        }
      } catch {
        // Swallow errors here; UI flows can explicitly call completeSignIn and handle surfaced errors.
      } finally {
        // Leave initializing to onAuthStateChanged to avoid flicker.
      }
    };

    // Fire and forget
    void maybeComplete();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const sendSignInLink = async (email: string, options?: Partial<ActionCodeSettings>) => {
    const base = getDefaultActionCodeSettings();
    const actionCodeSettings: ActionCodeSettings = {
      ...base,
      ...options,
      handleCodeInApp: true, // must be true
    };

    await sendSignInLinkToEmail(auth, email, actionCodeSettings);
    try {
      window.localStorage.setItem(EMAIL_FOR_SIGNIN_KEY, email);
      setEmailForSignIn(email);
    } catch {
      // If localStorage is unavailable, flow will prompt for email on completion.
    }
  };

  const completeSignIn = async (url?: string) => {
    if (typeof window === "undefined") return;
    const href = url ?? window.location.href;

    if (!isSignInWithEmailLink(auth, href)) return;

    let email = emailForSignIn ?? window.localStorage.getItem(EMAIL_FOR_SIGNIN_KEY);
    if (!email) {
      email = window.prompt("Please provide your email for confirmation") ?? undefined;
    }
    if (!email) return;

    const cred = await signInWithEmailLink(auth, email, href);
    window.localStorage.removeItem(EMAIL_FOR_SIGNIN_KEY);
    setEmailForSignIn(null);
    setUser(cred.user);
    return cred;
  };

  const logout = async () => {
    await firebaseSignOut(auth);
    setUser(null);
  };

  const value: AuthContextValue = useMemo(
    () => ({
      user,
      loading: initializing,
      isAuthenticated: !!user,
      emailForSignIn,
      sendSignInLink,
      completeSignIn,
      logout,
    }),
    [user, initializing, emailForSignIn]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
}

/**
 * ProtectedRoute
 * Wrap pages/components that should only be accessible to authenticated users.
 *
 * Example:
 *  <Route path="/doc-tweaker" element={
 *    <ProtectedRoute>
 *      <DocTweaker />
 *    </ProtectedRoute>
 *  } />
 */
export function ProtectedRoute({ children }: { children: ReactNode }) {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    // You could return a proper loader here if desired
    return null;
  }

  if (!isAuthenticated) {
    // Redirect to auth page and preserve intended destination
    return <Navigate to="/auth" replace state={{ from: location }} />;
  }

  return <>{children}</>;
}

// Optional alias
export const RequireAuth = ProtectedRoute;
