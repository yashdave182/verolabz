import React, { useEffect, useMemo, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/lib/AuthContext";
import {
  Star,
  CheckCircle2,
  Sparkles,
  Rocket,
  Shield,
  Wand2,
  Languages,
  MessageSquare,
  Gauge,
  Workflow,
  Brain,
} from "lucide-react";

type FeedbackAction = "preview" | "download";

type FeedbackPayload = {
  rating: number;
  notes?: string;
  features: string[];
  otherFeature?: string;
  fileName?: string;
  action?: FeedbackAction;
  userEmail?: string | null;
  createdAt: string;
  userAgent?: string;
  appVersion?: string;
};

type FeedbackDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  context?: {
    fileName?: string;
    action?: FeedbackAction;
  };
  onSubmitted?: (payload: FeedbackPayload) => void;
};

const FEATURES: {
  key: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}[] = [
  { key: "better_quality", label: "Even Better Quality", icon: Sparkles },
  { key: "faster_speed", label: "Faster Processing", icon: Rocket },
  { key: "privacy_controls", label: "More Privacy Controls", icon: Shield },
  { key: "advanced_tweak", label: "Advanced Tweak Modes", icon: Wand2 },
  { key: "multi_language", label: "Multi-language Support", icon: Languages },
  {
    key: "feedback_context",
    label: "Feedback on Context",
    icon: MessageSquare,
  },
  { key: "batch_processing", label: "Batch Processing", icon: Workflow },
  { key: "accuracy", label: "Higher Accuracy", icon: Gauge },
  { key: "smarter_ai", label: "Smarter AI Reasoning", icon: Brain },
];

const MAX_NOTES = 1000;
const DESTINATION_EMAILS = ["ladkenil80@gmail.com", "yashdave785@gmail.com"];

export default function FeedbackDialog(props: FeedbackDialogProps) {
  const { open, onOpenChange, context, onSubmitted } = props;
  const { toast } = useToast();
  const { user } = useAuth();

  const [rating, setRating] = useState<number>(0);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [notes, setNotes] = useState<string>("");
  const [selected, setSelected] = useState<string[]>([]);
  const [otherFeature, setOtherFeature] = useState<string>("");
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [submitted, setSubmitted] = useState<boolean>(false);

  const remaining = useMemo(
    () => Math.max(0, MAX_NOTES - notes.length),
    [notes],
  );

  // Defer render for 30s when action is "preview" so users can view the enhanced doc first.
  const [timerExpired, setTimerExpired] = useState<boolean>(true);
  useEffect(() => {
    if (!open) {
      setTimerExpired(true);
      return;
    }
    if (context?.action === "preview") {
      setTimerExpired(false);
      const t = setTimeout(() => setTimerExpired(true), 30000);
      return () => clearTimeout(t);
    } else {
      setTimerExpired(true);
    }
  }, [open, context?.action]);

  const effectiveOpen = open;

  const bodyForEmail = (payload: FeedbackPayload) => {
    const lines = [
      `Verolabz - DocTweaker Feedback`,
      ``,
      `Rating: ${payload.rating} / 5`,
      `Action: ${payload.action ?? "unknown"}`,
      `File: ${payload.fileName ?? "n/a"}`,
      `User: ${payload.userEmail ?? "anonymous"}`,
      `Time: ${payload.createdAt}`,
      ``,
      `Requested Features:`,
      ...(payload.features.length
        ? payload.features.map((f) => `- ${f}`)
        : ["- (none)"]),
      ...(payload.otherFeature
        ? [`Other Feature: ${payload.otherFeature}`]
        : []),
      ``,
      `Notes:`,
      payload.notes?.trim() ? payload.notes.trim() : "(none provided)",
      ``,
      `Client Info:`,
      `- userAgent: ${payload.userAgent ?? "n/a"}`,
      `- appVersion: ${payload.appVersion ?? "n/a"}`,
    ];
    return lines.join("\n");
  };

  const openGmailCompose = (subject: string, body: string) => {
    const to = DESTINATION_EMAILS.join(",");
    const url = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(
      to,
    )}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const openMailTo = (subject: string, body: string) => {
    const to = DESTINATION_EMAILS.join(",");
    const url = `mailto:${encodeURIComponent(to)}?subject=${encodeURIComponent(
      subject,
    )}&body=${encodeURIComponent(body)}`;
    window.location.href = url;
  };

  const handleSubmit = async () => {
    if (rating < 1) {
      toast({
        title: "Add a rating",
        description: "Please rate your experience (1 to 5 stars).",
        variant: "destructive",
      });
      return;
    }

    setSubmitting(true);
    const payload: FeedbackPayload = {
      rating,
      notes: notes.trim() || undefined,
      features: selected,
      otherFeature: otherFeature.trim() || undefined,
      fileName: context?.fileName,
      action: context?.action,
      userEmail: user?.email ?? null,
      createdAt: new Date().toISOString(),
      userAgent:
        typeof navigator !== "undefined" ? navigator.userAgent : undefined,
      appVersion:
        typeof navigator !== "undefined" ? navigator.appVersion : undefined,
    };

    const subject = "Verolabz DocTweaker Feedback";
    const body = bodyForEmail(payload);

    // Prefer Gmail compose; user can fallback to default email app if needed
    openGmailCompose(subject, body);

    setSubmitting(false);
    setSubmitted(true);
    onSubmitted?.(payload);
  };

  const handleClose = () => {
    onOpenChange(false);
    // Reset form state after closing
    setTimeout(() => {
      setRating(0);
      setHoverRating(0);
      setNotes("");
      setSelected([]);
      setOtherFeature("");
      setSubmitting(false);
      setSubmitted(false);
      setTimerExpired(true);
    }, 100);
  };

  const toggleFeature = (key: string) => {
    setSelected((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key],
    );
  };

  return (
    <Dialog
      open={effectiveOpen}
      onOpenChange={(state) => (!submitting ? onOpenChange(state) : null)}
    >
      <DialogContent className="w-[95vw] max-w-[44rem] md:max-w-2xl max-h-[85vh] overflow-y-auto sm:rounded-lg sm:p-6 p-4 animate-in fade-in-50 zoom-in-95 duration-200">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            Share your feedback
            <span className="inline-flex items-center rounded-full bg-primary/10 text-primary text-xs px-2 py-0.5">
              beta
            </span>
          </DialogTitle>
          <DialogDescription>
            Tell us how your{" "}
            {context?.action === "download" ? "download" : "preview"} went so we
            can improve DocTweaker.
          </DialogDescription>
        </DialogHeader>

        {!submitted ? (
          <div className="space-y-6">
            {/* Rating */}
            <section className="space-y-2">
              <p className="text-sm font-medium">Rate your experience</p>
              <div className="flex flex-wrap items-center gap-1">
                {[1, 2, 3, 4, 5].map((i) => {
                  const active = (hoverRating || rating) >= i;
                  return (
                    <button
                      key={i}
                      type="button"
                      className="p-1 transition-transform hover:scale-110 active:scale-95"
                      onMouseEnter={() => setHoverRating(i)}
                      onMouseLeave={() => setHoverRating(0)}
                      onClick={() => setRating(i)}
                      aria-label={`Set rating ${i}`}
                    >
                      <Star
                        className={`h-7 w-7 ${active ? "text-yellow-400 fill-yellow-400" : "text-muted-foreground"}`}
                      />
                    </button>
                  );
                })}
                <span className="ml-2 text-sm text-muted-foreground">
                  {rating > 0 ? `${rating} / 5` : "Select a rating"}
                </span>
              </div>
            </section>

            {/* Feature cards */}
            <section className="space-y-3">
              <p className="text-sm font-medium">
                What should we improve next?
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {FEATURES.map((f) => {
                  const Icon = f.icon;
                  const isActive = selected.includes(f.key);
                  return (
                    <Card
                      key={f.key}
                      onClick={() => toggleFeature(f.key)}
                      className={`cursor-pointer transition-all hover:shadow-md hover:-translate-y-0.5 ${
                        isActive
                          ? "border-primary ring-2 ring-primary/30"
                          : "border-border"
                      }`}
                    >
                      <CardContent className="p-4 flex items-center gap-3">
                        <div
                          className={`w-9 h-9 rounded-lg flex items-center justify-center transition-colors ${
                            isActive
                              ? "bg-primary/10 text-primary"
                              : "bg-muted text-foreground"
                          }`}
                        >
                          <Icon className="w-5 h-5" />
                        </div>
                        <div className="text-sm font-medium">{f.label}</div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                <Input
                  placeholder="Other feature (optional)"
                  value={otherFeature}
                  onChange={(e) => setOtherFeature(e.target.value)}
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    const trimmed = otherFeature.trim();
                    if (!trimmed) return;
                    if (!selected.includes(trimmed))
                      setSelected((s) => [...s, trimmed]);
                    setOtherFeature("");
                  }}
                >
                  Add
                </Button>
              </div>
            </section>

            {/* Notes */}
            <section className="space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium">Any additional notes?</p>
                <span className="text-xs text-muted-foreground">
                  {remaining} chars left
                </span>
              </div>
              <Textarea
                placeholder="What worked well? What needs improvement?"
                value={notes}
                onChange={(e) => setNotes(e.target.value.slice(0, MAX_NOTES))}
                className="min-h-[110px]"
              />
            </section>

            {/* Context summary */}
            <section className="rounded-lg border p-3 bg-muted/30 text-xs">
              <div className="grid gap-1 sm:grid-cols-2">
                <div>
                  <span className="text-muted-foreground">File:</span>{" "}
                  <span className="font-medium break-all">
                    {context?.fileName ?? "N/A"}
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground">Action:</span>{" "}
                  <span className="font-medium capitalize">
                    {context?.action ?? "N/A"}
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground">User:</span>{" "}
                  <span className="font-medium break-all">
                    {user?.email ?? "anonymous"}
                  </span>
                </div>
              </div>
            </section>

            <DialogFooter className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2">
              <Button type="button" variant="ghost" onClick={handleClose}>
                Skip for now
              </Button>
              <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setRating(5);
                    setNotes("Everything worked great! 🚀");
                  }}
                  className="w-full sm:w-auto"
                >
                  Quick 5★
                </Button>
                <Button
                  type="button"
                  onClick={handleSubmit}
                  disabled={submitting}
                  className="w-full sm:w-auto"
                >
                  {submitting ? "Sending..." : "Send feedback"}
                </Button>
              </div>
            </DialogFooter>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold leading-none">
                  Thanks for your feedback!
                </h3>
                <p className="text-sm text-muted-foreground">
                  We’ve opened your email composer to send the details to our
                  team.
                </p>
              </div>
            </div>

            <div className="rounded-lg border p-4 space-y-3">
              <p className="text-sm font-medium">Did the email not open?</p>
              <div className="flex flex-wrap gap-2">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => {
                    const payload: FeedbackPayload = {
                      rating,
                      notes: notes.trim() || undefined,
                      features: selected,
                      otherFeature: otherFeature.trim() || undefined,
                      fileName: context?.fileName,
                      action: context?.action,
                      userEmail: user?.email ?? null,
                      createdAt: new Date().toISOString(),
                      userAgent:
                        typeof navigator !== "undefined"
                          ? navigator.userAgent
                          : undefined,
                      appVersion:
                        typeof navigator !== "undefined"
                          ? navigator.appVersion
                          : undefined,
                    };
                    const body = bodyForEmail(payload);
                    navigator.clipboard
                      .writeText(body)
                      .then(() =>
                        toast({
                          title: "Copied",
                          description:
                            "Feedback details copied. Paste into your email to send.",
                        }),
                      )
                      .catch(() =>
                        toast({
                          title: "Clipboard blocked",
                          description:
                            "Please try again or use your email app.",
                          variant: "destructive",
                        }),
                      );
                  }}
                >
                  Copy feedback
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    const payload: FeedbackPayload = {
                      rating,
                      notes: notes.trim() || undefined,
                      features: selected,
                      otherFeature: otherFeature.trim() || undefined,
                      fileName: context?.fileName,
                      action: context?.action,
                      userEmail: user?.email ?? null,
                      createdAt: new Date().toISOString(),
                      userAgent:
                        typeof navigator !== "undefined"
                          ? navigator.userAgent
                          : undefined,
                      appVersion:
                        typeof navigator !== "undefined"
                          ? navigator.appVersion
                          : undefined,
                    };
                    const subject = "Verolabz DocTweaker Feedback";
                    const body = bodyForEmail(payload);
                    openMailTo(subject, body);
                  }}
                >
                  Use email app
                </Button>
              </div>
            </div>

            <DialogFooter>
              <Button onClick={handleClose} className="w-full sm:w-auto">
                Close
              </Button>
            </DialogFooter>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
