import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { Mail, CheckCircle, Loader2 } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/AuthContext";

const Auth: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const {
    user,
    isAuthenticated,
    loading,
    sendSignInLink,
    completeSignIn,
    logout,
  } = useAuth();

  const state = location.state as { from?: { pathname?: string } } | null;
  const stateFrom = state?.from?.pathname;

  const urlNext = new URLSearchParams(location.search).get("next") || undefined;
  const defaultAfterLogin = "/doc-tweaker";
  const afterLogin = useMemo(
    () => urlNext || stateFrom || defaultAfterLogin,
    [urlNext, stateFrom],
  );

  const [email, setEmail] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [completing, setCompleting] = useState(false);

  // If the page loads with an email link (oobCode) in the URL, try to complete sign-in.
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const hasOobCode = params.has("oobCode");
    const mode = params.get("mode");

    // Only attempt completion when arriving on the callback URL with a sign-in link.
    if (hasOobCode || mode === "signIn") {
      setCompleting(true);
      Promise.resolve(completeSignIn())
        .then(() => {
          // If authentication completed, send to the next destination
          // Otherwise, user will be prompted for their email.
          // Navigation happens only when authenticated.
          // If not authenticated (e.g., user canceled email prompt), stay on auth page.
          // We check auth state after a short microtask tick.
          setTimeout(() => {
            if (!loading && isAuthenticated) {
              navigate(afterLogin, { replace: true });
            }
          }, 0);
        })
        .finally(() => setCompleting(false));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.search]);

  // If already authenticated and the page is opened manually, offer to continue.
  useEffect(() => {
    if (
      !loading &&
      isAuthenticated &&
      !new URLSearchParams(location.search).has("oobCode")
    ) {
      // Do not auto-redirect; show UI with "Continue" so user understands what's happening.
    }
  }, [isAuthenticated, loading, location.search]);

  async function handleSend(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const trimmed = email.trim();
    if (!trimmed) {
      setError("Please enter a valid email address.");
      return;
    }

    try {
      setSending(true);
      const origin = window.location.origin;
      // Persist the intended destination through the sign-in flow
      const callbackUrl = `${origin}/auth/complete${afterLogin ? `?next=${encodeURIComponent(afterLogin)}` : ""}`;

      await sendSignInLink(trimmed, {
        url: callbackUrl,
        // handleCodeInApp is forced to true in the AuthContext
      });
      setSent(true);
    } catch (err: unknown) {
      const msg =
        err instanceof Error
          ? err.message
          : "Failed to send sign-in link. Please try again.";

      setError(msg);
    } finally {
      setSending(false);
    }
  }

  const handleContinue = () => {
    navigate(afterLogin, { replace: true });
  };

  const handleLogout = async () => {
    await logout();
  };

  return (
    <div className="min-h-[calc(100vh-5rem)] flex items-center justify-center px-4 py-12 bg-gradient-subtle">
      <div className="w-full max-w-md">
        <Card className="shadow-lg">
          <CardHeader className="text-center">
            <div className="mx-auto mb-3 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              <Mail className="w-6 h-6 text-primary" />
            </div>
            <CardTitle className="text-2xl">Welcome to Verolabz</CardTitle>
            <CardDescription>
              Sign up or log in with a secure, passwordless email link.
            </CardDescription>
          </CardHeader>

          {!isAuthenticated && (
            <>
              <CardContent>
                {sent ? (
                  <div className="space-y-4">
                    <div className="flex items-start gap-3 rounded-md border border-green-300 bg-green-50 p-3 text-green-900">
                      <CheckCircle className="w-5 h-5 mt-0.5 shrink-0" />
                      <div>
                        <p className="font-medium">Check your email</p>
                        <p className="text-sm">
                          We sent a sign-in link to{" "}
                          <span className="font-medium">{email}</span>. Open it
                          on this device to finish signing in.
                        </p>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Didn’t receive it? Check your spam folder or wait a minute
                      and try again.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSend} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="you@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        autoComplete="email"
                        disabled={sending || completing}
                      />
                    </div>

                    {error && (
                      <p className="text-sm text-red-600" role="alert">
                        {error}
                      </p>
                    )}

                    <Button
                      type="submit"
                      className="w-full"
                      disabled={sending || completing}
                    >
                      {sending ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Sending link...
                        </>
                      ) : (
                        "Send sign-in link"
                      )}
                    </Button>

                    {completing && (
                      <div className="text-sm text-muted-foreground flex items-center justify-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Completing sign-in...
                      </div>
                    )}

                    <div className="text-xs text-muted-foreground text-center">
                      By continuing, you agree to our{" "}
                      <Link
                        to="/terms"
                        className="underline underline-offset-2 hover:text-foreground"
                      >
                        Terms
                      </Link>{" "}
                      and{" "}
                      <Link
                        to="/privacy"
                        className="underline underline-offset-2 hover:text-foreground"
                      >
                        Privacy Policy
                      </Link>
                      .
                    </div>
                  </form>
                )}
              </CardContent>

              <CardFooter className="flex flex-col gap-2">
                <Button variant="outline" className="w-full" asChild>
                  <Link to="/">Back to Home</Link>
                </Button>
              </CardFooter>
            </>
          )}

          {isAuthenticated && (
            <>
              <CardContent className="space-y-4">
                <div className="rounded-md border p-3">
                  <p className="text-sm text-muted-foreground">Signed in as</p>
                  <p className="font-medium">
                    {user?.email ?? "Authenticated user"}
                  </p>
                </div>
                <div className="space-y-2">
                  <Button className="w-full" onClick={handleContinue}>
                    Continue
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={handleLogout}
                  >
                    Sign out
                  </Button>
                </div>
              </CardContent>
              <CardFooter className="flex justify-center">
                <Link
                  to="/"
                  className="text-sm text-muted-foreground underline underline-offset-2 hover:text-foreground"
                >
                  Go to Home
                </Link>
              </CardFooter>
            </>
          )}
        </Card>

        {!sent && !isAuthenticated && (
          <p className="text-xs text-center mt-4 text-muted-foreground">
            We use passwordless authentication. You’ll receive a one-time
            sign-in link at your email.
          </p>
        )}
      </div>
    </div>
  );
};

export default Auth;
