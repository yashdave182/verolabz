import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { Loader2, MailCheck, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/AuthContext";

/**
 * AuthComplete
 * Lightweight page to complete Firebase email-link sign-in and redirect.
 *
 * Route: /auth/complete
 * Optional query param: ?next=/desired/path
 *
 * Behavior:
 * - If already authenticated, immediately redirect to next (or /doc-tweaker).
 * - Otherwise, attempts to complete email-link sign-in using the current URL.
 * - On success, redirects to next (or /doc-tweaker).
 * - On failure or if not a valid email-link, shows an error with a link back to /auth.
 */
const AuthComplete: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, loading, completeSignIn } = useAuth();

  const [status, setStatus] = useState<
    "idle" | "completing" | "success" | "error"
  >("idle");
  const [error, setError] = useState<string | null>(null);

  // Determine where to send the user after completion
  const next = useMemo(() => {
    const params = new URLSearchParams(location.search);
    const n = params.get("next");
    return n && n.startsWith("/") ? n : "/doc-tweaker";
  }, [location.search]);

  useEffect(() => {
    if (loading) return;

    // If already authenticated, just go to next
    if (isAuthenticated) {
      navigate(next, { replace: true });
      return;
    }

    // Try to complete sign-in with the current URL
    setStatus("completing");
    Promise.resolve(completeSignIn())
      .then((cred) => {
        if (cred) {
          setStatus("success");
          navigate(next, { replace: true });
          return;
        }
        // If no credential returned, this likely isn't a valid email sign-in link
        setStatus("error");
        setError(
          "This link is invalid or has expired. Please request a new sign-in link.",
        );
      })

      .catch((err: unknown) => {
        setStatus("error");

        const message =
          err instanceof Error
            ? err.message
            : "We couldn't complete your sign-in. The link may be invalid or expired.";

        setError(message);
      });
  }, [loading, isAuthenticated, completeSignIn, navigate, next]);

  // UI
  return (
    <div className="min-h-[calc(100vh-5rem)] flex items-center justify-center px-4 py-12 bg-gradient-subtle">
      <div className="w-full max-w-md text-center">
        {status === "completing" || status === "idle" ? (
          <div className="rounded-lg border bg-card p-8 shadow-sm">
            <div className="mx-auto mb-4 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              <Loader2 className="w-6 h-6 text-primary animate-spin" />
            </div>
            <h1 className="text-xl font-semibold mb-2">
              Completing sign-in...
            </h1>
            <p className="text-sm text-muted-foreground">
              Please wait while we verify your email link.
            </p>
          </div>
        ) : null}

        {status === "success" ? (
          <div className="rounded-lg border bg-card p-8 shadow-sm">
            <div className="mx-auto mb-4 w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
              <MailCheck className="w-6 h-6 text-green-600" />
            </div>
            <h1 className="text-xl font-semibold mb-2">
              Signed in successfully
            </h1>
            <p className="text-sm text-muted-foreground mb-4">
              Redirecting you to your destination...
            </p>
            <Button onClick={() => navigate(next, { replace: true })}>
              Continue
            </Button>
          </div>
        ) : null}

        {status === "error" ? (
          <div className="rounded-lg border bg-card p-8 shadow-sm">
            <div className="mx-auto mb-4 w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
              <AlertCircle className="w-6 h-6 text-red-600" />
            </div>
            <h1 className="text-xl font-semibold mb-2">
              We couldn’t sign you in
            </h1>
            <p className="text-sm text-muted-foreground mb-4">
              {error || "An unexpected error occurred."}
            </p>
            <div className="flex items-center justify-center gap-2">
              <Button asChild>
                <Link
                  to={`/auth${next ? `?next=${encodeURIComponent(next)}` : ""}`}
                >
                  Go to Sign In
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link to="/">Back to Home</Link>
              </Button>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default AuthComplete;
