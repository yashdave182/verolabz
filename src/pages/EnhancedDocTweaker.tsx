import { useRef, useState, useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Upload,
  Wand2,
  Download,
  Zap,
  AlertCircle,
  File,
  X,
  Loader2,
  CheckCircle,
  Eye,
  RefreshCw,
} from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { DocumentPreview } from "@/components/DocumentPreview";
import { useAuth } from "@/lib/AuthContext";
import FeedbackDialog from "@/components/FeedbackDialog";

// ⚙️ CONFIGURATION - Your HuggingFace backend URL
const BACKEND_URL = "https://omgy-vero-back-test.hf.space";

// Generic error messages (no technical details exposed)
const ERROR_MESSAGES = {
  processing_failed:
    "We're having trouble processing your document. Please try again.",
  file_invalid:
    "We couldn't process this file. Please ensure it's a valid document.",
  network_error:
    "Network connection issue. Please check your internet and try again.",
  server_error:
    "Our service is temporarily unavailable. Please try again later.",
  unknown: "Something went wrong. Please try again.",
};

type ProcessingStage =
  | "idle"
  | "uploading"
  | "enhancing"
  | "complete"
  | "error";

const EnhancedDocTweaker = () => {
  // Hooks must be declared top-level and unconditionally
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  const { toast } = useToast();

  // UI/Flow state
  const [context, setContext] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [processingStage, setProcessingStage] =
    useState<ProcessingStage>("idle");
  const [progress, setProgress] = useState<number>(0);
  const [processingMessage, setProcessingMessage] = useState<string>("");
  const [error, setError] = useState<string>("");

  // File state
  const [uploadedFileName, setUploadedFileName] = useState<string>("");
  const [enhancedFileBlob, setEnhancedFileBlob] = useState<Blob | null>(null);

  // Preview + Feedback state
  const [showPreview, setShowPreview] = useState<boolean>(false);
  const [feedbackOpen, setFeedbackOpen] = useState<boolean>(false);
  const [feedbackAction, setFeedbackAction] = useState<
    "preview" | "download" | null
  >(null);

  // Refs
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Auth guard
  if (!isAuthenticated) {
    return (
      <Navigate
        to={`/auth?next=${encodeURIComponent("/enhanced-doc-tweaker")}`}
        replace
        state={{ from: location }}
      />
    );
  }

  // removed auto-feedback scheduling on preview open

  const updateProgress = (stage: ProcessingStage, message = "") => {
    setProcessingStage(stage);
    setProcessingMessage(message);
    const progressMap: Record<ProcessingStage, number> = {
      idle: 0,
      uploading: 30,
      enhancing: 70,
      complete: 100,
      error: 0,
    };
    setProgress(progressMap[stage]);
  };

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploadedFileName(file.name);
    setError("");
  };

  const clearUploadedFile = () => {
    setUploadedFileName("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Call the Hugging Face API to enhance the .docx document - Secure version
  const enhanceDocumentWithHuggingFace = async (
    file: File,
    userPrompt: string = "",
    docType: string = "auto",
  ): Promise<Blob> => {
    const formData = new FormData();
    formData.append("file", file);

    // Build URL with query parameters
    const params = new URLSearchParams();
    params.append("doc_type", docType);
    if (userPrompt.trim()) {
      params.append("prompt", userPrompt.trim());
    }

    const url = `${BACKEND_URL}/enhance?${params.toString()}`;

    try {
      const response = await fetch(url, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        // Don't expose HTTP status or technical details
        throw new Error("processing_failed");
      }

      const blob = await response.blob();
      if (!blob || blob.size === 0) {
        throw new Error("processing_failed");
      }

      return blob;
    } catch (err) {
      // Catch all errors and convert to generic message
      // Never expose stack traces or technical details
      throw new Error("processing_failed");
    }
  };

  const handleProcess = async () => {
    const file = fileInputRef.current?.files?.[0];

    if (!file) {
      toast({
        title: "No Document",
        description: "Please upload a document to enhance",
        variant: "destructive",
      });
      return;
    }

    if (!context.trim()) {
      toast({
        title: "Instructions Needed",
        description: "Please describe how you'd like to enhance your document",
        variant: "destructive",
      });
      return;
    }

    const fileName = file.name.toLowerCase();
    if (!fileName.endsWith(".docx") && !fileName.endsWith(".pdf")) {
      toast({
        title: "File Format",
        description: "Please upload a valid document file",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    setError("");
    setEnhancedFileBlob(null);
    setShowPreview(false);
    updateProgress("uploading", "Uploading document...");

    try {
      updateProgress(
        "enhancing",
        "Enhancing with AI... This may take a moment.",
      );
      toast({
        title: "Enhancing Document",
        description: "AI is improving your document while preserving layout...",
      });

      const enhancedBlob = await enhanceDocumentWithHuggingFace(
        file,
        context.trim(),
        "auto",
      );
      setEnhancedFileBlob(enhancedBlob);
      updateProgress("complete", "Complete!");

      toast({
        title: "Success!",
        description: "Your document has been enhanced successfully.",
      });
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "An unexpected error occurred";
      setError(message);
      updateProgress("error", "Error occurred");

      toast({
        title: "Error",
        description: message,
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (!enhancedFileBlob) {
      toast({
        title: "Error",
        description: "No enhanced file available for download.",
        variant: "destructive",
      });
      return;
    }

    try {
      const url = URL.createObjectURL(enhancedFileBlob);
      const a = document.createElement("a");
      a.href = url;
      const baseFileName =
        uploadedFileName?.replace(/\.[^/.]+$/, "") || "document";
      const originalExtension =
        uploadedFileName?.split(".")?.pop()?.toLowerCase() || "docx";
      const extension =
        originalExtension === "pdf" || originalExtension === "docx"
          ? originalExtension
          : "docx";

      a.download = `enhanced_${baseFileName}.${extension}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast({
        title: "Downloaded",
        description: "Enhanced document has been downloaded.",
      });
      setFeedbackAction("download");
      setFeedbackOpen(true);
    } catch {
      toast({
        title: "Download Error",
        description: "We couldn't download your file. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleReset = () => {
    setContext("");
    setEnhancedFileBlob(null);
    setError("");
    setUploadedFileName("");
    setProcessingStage("idle");
    setProgress(0);
    setShowPreview(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const getStageLabel = (stage: ProcessingStage): string => {
    const labels: Record<ProcessingStage, string> = {
      idle: "Ready",
      uploading: "Uploading document...",
      enhancing: "Enhancing with AI...",
      complete: "Complete!",
      error: "Error occurred",
    };
    return labels[stage];
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
            <Zap className="w-4 h-4 mr-2" />
            AI-Powered Document Enhancement
          </div>
          <h1 className="text-4xl lg:text-6xl font-bold text-foreground mb-6">
            Transform Your Documents
            <span className="block text-primary">with AI Precision</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Upload a .docx document and describe what you want to achieve. Our
            AI will enhance it to perfection.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="default" size="lg" className="font-semibold">
              <Wand2 className="w-5 h-5 mr-2" />
              Start Enhancing
            </Button>
          </div>
        </div>
      </section>

      {/* Main Processing Tool */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <Card className="shadow-lg">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">
                Document Enhancement Pipeline
              </CardTitle>
              <CardDescription>
                Upload → AI Enhance → Preview → Download
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Processing Progress */}
              {isProcessing && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">
                      {getStageLabel(processingStage)}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {progress}%
                    </span>
                  </div>
                  <Progress value={progress} className="w-full" />
                  {processingMessage && (
                    <p className="text-xs text-muted-foreground text-center">
                      {processingMessage}
                    </p>
                  )}
                </div>
              )}

              {/* Error Alert */}
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {/* Input Section */}
              <div className="space-y-6">
                {/* File Upload */}
                <div className="space-y-4">
                  <Label className="text-base font-medium">
                    Upload Document (.docx or .pdf)
                  </Label>

                  <div className="flex flex-col sm:flex-row gap-3">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => fileInputRef.current?.click()}
                      className="flex-1"
                      disabled={isProcessing}
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      Choose File (.docx or .pdf)
                    </Button>

                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".txt,.doc,.docx,.pdf"
                      onChange={handleFileUpload}
                      className="hidden"
                    />

                    {uploadedFileName && (
                      <div className="flex items-center gap-2 px-4 py-2 bg-muted rounded-lg border border-primary/20">
                        <File className="w-4 h-4 text-primary" />
                        <span className="text-sm font-medium truncate max-w-[200px]">
                          {uploadedFileName}
                        </span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={clearUploadedFile}
                          className="h-auto p-1"
                          disabled={isProcessing}
                        >
                          <X className="w-3 h-3" />
                        </Button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Context Input */}
                <div>
                  <Label htmlFor="context" className="text-base font-medium">
                    Enhancement Instructions *
                  </Label>
                  <Textarea
                    id="context"
                    placeholder="Be specific about what you want to achieve. Examples:
- 'Make this sound more professional'
- 'Fix grammar and spelling errors'
- 'Reorganize the content for better flow'
- 'Add a summary paragraph at the beginning'"
                    className="min-h-[120px] mt-2"
                    value={context}
                    onChange={(e) => setContext(e.target.value)}
                    disabled={isProcessing}
                  />
                  <p className="text-xs text-muted-foreground mt-2">
                    Your specific request will be the primary focus of the AI
                    enhancement.
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <Button
                    onClick={handleProcess}
                    disabled={
                      isProcessing || !uploadedFileName || !context.trim()
                    }
                    className="flex-1"
                    size="lg"
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <Wand2 className="w-5 h-5 mr-2" />
                        Enhance with AI
                      </>
                    )}
                  </Button>

                  {uploadedFileName && (
                    <Button
                      onClick={handleReset}
                      variant="outline"
                      size="lg"
                      disabled={isProcessing}
                    >
                      <RefreshCw className="w-5 h-5 mr-2" />
                      Reset
                    </Button>
                  )}
                </div>

                {/* Inline Preview */}
                {showPreview && enhancedFileBlob && (
                  <div className="pt-4">
                    <DocumentPreview
                      fileBlob={enhancedFileBlob}
                      fileName={uploadedFileName || "enhanced_document.docx"}
                      onClose={() => {
                        setShowPreview(false);

                        // Show feedback when closing preview
                        setFeedbackAction("preview");
                        setFeedbackOpen(true);
                      }}
                      onDownload={handleDownload}
                    />
                  </div>
                )}
              </div>

              {/* Results Section */}
              {enhancedFileBlob && (
                <div className="border-t pt-6 space-y-4">
                  <div>
                    <Label className="text-base font-medium">Results</Label>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
                    <Button
                      variant="outline"
                      size="lg"
                      onClick={() => {
                        const next = !showPreview;

                        // Only show feedback when closing preview
                        if (!next) {
                          setFeedbackAction("preview");

                          setFeedbackOpen(true);
                        }
                        setShowPreview(next);
                      }}
                      className="w-full"
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      {showPreview ? "Hide" : "Preview"} Document
                    </Button>
                    <Button
                      variant="default"
                      size="lg"
                      onClick={handleDownload}
                      className="w-full"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download Enhanced Document
                    </Button>
                  </div>

                  <Alert>
                    <CheckCircle className="h-4 w-4" />
                    <AlertTitle>Success!</AlertTitle>
                    <AlertDescription>
                      Your document has been successfully enhanced. Preview it
                      before downloading or go ahead and download directly.
                    </AlertDescription>
                  </Alert>
                </div>
              )}

              {/* Guidance Section */}
              {!enhancedFileBlob && (
                <div className="bg-muted/50 rounded-lg p-6 space-y-4">
                  <h3 className="font-semibold text-center mb-4">
                    How It Works
                  </h3>
                  <div className="grid sm:grid-cols-3 gap-4">
                    <div className="flex gap-3">
                      <div className="flex-shrink-0">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                          <Upload className="w-4 h-4 text-primary" />
                        </div>
                      </div>
                      <div>
                        <h4 className="font-medium text-sm">
                          1. Upload Document
                        </h4>
                        <p className="text-xs text-muted-foreground">
                          Upload a .docx file
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <div className="flex-shrink-0">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                          <Wand2 className="w-4 h-4 text-primary" />
                        </div>
                      </div>
                      <div>
                        <h4 className="font-medium text-sm">
                          2. AI Enhancement
                        </h4>
                        <p className="text-xs text-muted-foreground">
                          Gemini improves your content
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <div className="flex-shrink-0">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                          <Eye className="w-4 h-4 text-primary" />
                        </div>
                      </div>
                      <div>
                        <h4 className="font-medium text-sm">
                          3. Preview & Download
                        </h4>
                        <p className="text-xs text-muted-foreground">
                          Review before downloading
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Feedback Dialog */}
      <FeedbackDialog
        open={feedbackOpen}
        onOpenChange={setFeedbackOpen}
        context={{
          fileName: uploadedFileName || "enhanced_document.docx",
          action: feedbackAction ?? undefined,
        }}
      />
    </div>
  );
};

export default EnhancedDocTweaker;
