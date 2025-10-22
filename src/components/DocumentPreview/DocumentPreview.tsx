import React, { useEffect, useState } from "react";
import { Loader2, AlertCircle, Eye, X, Download } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type MammothResult = {
  value: string;
  messages?: Array<{ message: string }>;
};

type MammothModule = {
  convertToHtml: (input: {
    arrayBuffer: ArrayBuffer;
  }) => Promise<MammothResult>;
};

declare global {
  interface Window {
    mammoth?: MammothModule;
  }
}

export interface DocumentPreviewProps {
  fileBlob: Blob;
  fileName: string;
  onClose: () => void;
  onDownload: () => void;
}

async function loadMammothFromCDN(): Promise<MammothModule> {
  if (typeof window === "undefined") {
    throw new Error("Preview is only available in the browser");
  }

  // Already loaded
  if (window.mammoth) return window.mammoth;

  // Reuse an existing script tag if present
  const existing = document.querySelector<HTMLScriptElement>(
    'script[data-mammoth-cdn="true"]',
  );
  if (existing) {
    // If mammoth was already loaded by this script
    if (window.mammoth) return window.mammoth;

    // Wait for existing script to finish loading
    await new Promise<void>((resolve, reject) => {
      existing.addEventListener("load", () => resolve(), { once: true });
      existing.addEventListener(
        "error",
        () => reject(new Error("Failed to load mammoth from CDN")),
        {
          once: true,
        },
      );
    });

    if (window.mammoth) return window.mammoth;
    throw new Error(
      "Mammoth CDN script loaded but module was not found on window",
    );
  }

  // Inject new script
  await new Promise<void>((resolve, reject) => {
    const s = document.createElement("script");
    s.src = "https://unpkg.com/mammoth@1.6.0/mammoth.browser.min.js";
    s.async = true;
    s.setAttribute("data-mammoth-cdn", "true");
    s.addEventListener("load", () => resolve(), { once: true });
    s.addEventListener(
      "error",
      () => reject(new Error("Failed to load mammoth from CDN")),
      { once: true },
    );
    document.head.appendChild(s);
  });

  if (window.mammoth) return window.mammoth;
  throw new Error(
    "Mammoth CDN script loaded but module was not found on window",
  );
}

export const DocumentPreview: React.FC<DocumentPreviewProps> = ({
  fileBlob,
  fileName,
  onClose,
  onDownload,
}) => {
  const [previewHtml, setPreviewHtml] = useState<string>("");
  const [previewText, setPreviewText] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [activeTab, setActiveTab] = useState<"preview" | "text">("preview");
  const [wordCount, setWordCount] = useState<number>(0);
  const [charCount, setCharCount] = useState<number>(0);

  useEffect(() => {
    let aborted = false;

    const run = async () => {
      try {
        setIsLoading(true);
        setError("");

        // 1) Ensure mammoth is available (CDN)
        const mammoth = await loadMammothFromCDN();
        if (aborted) return;

        // 2) Read blob
        const arrayBuffer = await fileBlob.arrayBuffer();
        if (aborted) return;

        // 3) Convert to HTML
        const result = await mammoth.convertToHtml({ arrayBuffer });
        if (aborted) return;

        const html = result.value || "";
        const container = document.createElement("div");
        container.innerHTML = html;
        const text = (
          container.innerText ||
          container.textContent ||
          ""
        ).trim();

        if (aborted) return;

        setPreviewHtml(html);
        setPreviewText(text);
        setWordCount(
          text.length ? text.split(/\s+/).filter(Boolean).length : 0,
        );
        setCharCount(text.length);
      } catch (e) {
        if (aborted) return;
        const message =
          e instanceof Error
            ? e.message
            : "Failed to generate preview for this document.";
        setError(message);
      } finally {
        if (!aborted) setIsLoading(false);
      }
    };

    run();
    return () => {
      aborted = true;
    };
  }, [fileBlob]);

  return (
    <Card className="w-full shadow-lg border-2 border-primary/20">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 border-b">
        <div className="flex-1">
          <CardTitle className="text-xl flex items-center gap-2">
            <Eye className="w-5 h-5 text-primary" />
            Document Preview
          </CardTitle>
          <p className="text-sm text-muted-foreground mt-1">{fileName}</p>
          {!isLoading && !error && (
            <p className="text-xs text-muted-foreground mt-1">
              {wordCount} words • {charCount} characters
            </p>
          )}
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          className="h-8 w-8 p-0"
        >
          <X className="w-4 h-4" />
        </Button>
      </CardHeader>

      <CardContent className="pt-6">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-3" />
              <p className="text-muted-foreground">
                Processing document preview...
              </p>
            </div>
          </div>
        ) : error ? (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Preview Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        ) : (
          <div className="space-y-4">
            <Tabs
              value={activeTab}
              onValueChange={(v) => setActiveTab(v as "preview" | "text")}
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="preview">Formatted View</TabsTrigger>
                <TabsTrigger value="text">Plain Text</TabsTrigger>
              </TabsList>

              <TabsContent value="preview" className="space-y-4 mt-4">
                <div className="border rounded-lg bg-white dark:bg-slate-950 p-6 max-h-96 overflow-y-auto">
                  {previewHtml ? (
                    <div
                      className="prose prose-sm max-w-none dark:prose-invert
                                 prose-headings:text-foreground prose-headings:font-bold
                                 prose-p:text-foreground prose-p:leading-relaxed
                                 prose-a:text-primary prose-a:underline
                                 prose-strong:font-bold prose-strong:text-foreground
                                 prose-em:text-muted-foreground prose-em:italic
                                 prose-code:bg-muted prose-code:px-2 prose-code:py-1 prose-code:rounded prose-code:text-sm
                                 prose-pre:bg-muted prose-pre:p-4 prose-pre:overflow-x-auto
                                 prose-blockquote:border-l-4 prose-blockquote:border-primary prose-blockquote:pl-4 prose-blockquote:text-muted-foreground
                                 prose-li:text-foreground prose-li:marker:text-primary
                                 prose-table:border-collapse prose-table:w-full
                                 prose-td:border prose-td:px-3 prose-td:py-2
                                 prose-th:border prose-th:px-3 prose-th:py-2 prose-th:bg-muted"
                      dangerouslySetInnerHTML={{ __html: previewHtml }}
                    />
                  ) : (
                    <p className="text-muted-foreground text-center py-8">
                      No content to display
                    </p>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="text" className="space-y-4 mt-4">
                <div className="border rounded-lg bg-muted/50 p-6 max-h-96 overflow-y-auto">
                  {previewText ? (
                    <pre className="text-sm whitespace-pre-wrap break-words font-mono text-foreground leading-relaxed">
                      {previewText}
                    </pre>
                  ) : (
                    <p className="text-muted-foreground text-center py-8">
                      No content to display
                    </p>
                  )}
                </div>
              </TabsContent>
            </Tabs>

            <div className="flex gap-3 pt-4 border-t">
              <Button variant="outline" onClick={onClose} className="flex-1">
                Close Preview
              </Button>
              <Button onClick={onDownload} className="flex-1">
                <Download className="w-4 h-4 mr-2" />
                Download Document
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DocumentPreview;
