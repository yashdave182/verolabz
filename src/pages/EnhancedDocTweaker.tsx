import { useRef, useState } from "react";
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

type ProcessingStage =
  | "idle"
  | "uploading"
  | "enhancing"
  | "complete"
  | "error";

const EnhancedDocTweaker = () => {
  // Hooks must be declared first and unconditionally
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

  // Preview
  const [showPreview, setShowPreview] = useState<boolean>(false);

  // Refs
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Auth guard: after hooks are declared, we can early return a redirect
  if (!isAuthenticated) {
    return (
      <Navigate
        to={`/auth?next=${encodeURIComponent("/enhanced-doc-tweaker")}`}
        replace
        state={{ from: location }}
      />
    );
  }

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

  // Call the Hugging Face API to enhance the .docx document
  const enhanceDocumentWithHuggingFace = async (
    file: File,
    prompt: string,
  ): Promise<Blob> => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("user_prompt", prompt);
    formData.append("model_choice", "gemini-2.0-flash");

    const response = await fetch(
      "https://omgy-verolabz.hf.space/process-document",
      {
        method: "POST",
        body: formData,
      },
    );

    if (!response.ok) {
      const errText = await response.text().catch(() => "Unknown error");
      throw new Error(`API error: ${errText}`);
    }

    return await response.blob();
  };

  const handleProcess = async () => {
    const file = fileInputRef.current?.files?.[0];

    if (!file) {
      toast({
        title: "No Document",
        description: "Please upload a .docx document",
        variant: "destructive",
      });
      return;
    }

    if (!context.trim()) {
      toast({
        title: "No Context",
        description: "Please describe what you want to achieve",
        variant: "destructive",
      });
      return;
    }

    if (!file.name.toLowerCase().endsWith(".docx")) {
      toast({
        title: "Unsupported Format",
        description: "Only .docx files are supported for AI enhancement",
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
      a.download = `enhanced_${uploadedFileName || "document"}.docx`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast({
        title: "Downloaded",
        description: "Enhanced document has been downloaded.",
      });
    } catch (err) {
      toast({
        title: "Download Failed",
        description:
          "Failed to download the enhanced document. Please try again.",
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
                    Upload Document (.docx only)
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
                      Choose File (.docx)
                    </Button>

                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".docx"
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
                      onClose={() => setShowPreview(false)}
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
                      onClick={() => setShowPreview(!showPreview)}
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
                      Download Enhanced DOCX
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
    </div>
  );
};

export default EnhancedDocTweaker;
