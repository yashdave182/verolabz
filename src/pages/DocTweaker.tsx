import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
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
  FileText,
  Upload,
  Wand2,
  Download,
  Zap,
  AlertCircle,
  File,
  X,
  Loader2,
  Eye,
  RefreshCw,
} from "lucide-react";
import { parseDocument } from "@/lib/documentParser";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { DocumentPreview } from "@/components/DocumentPreview";
import { useAuth } from "@/lib/AuthContext";
import FeedbackDialog from "@/components/FeedbackDialog";

// ⚙️ CONFIGURATION - Your HuggingFace backend URL
const BACKEND_URL = "https://omgy-vero-ps.hf.space";

// Generic error messages (no technical details exposed)
const ERROR_MESSAGES = {
  processing_failed: "We're having trouble processing your document. Please try again.",
  file_invalid: "We couldn't process this file. Please ensure it's a valid document.",
  network_error: "Network connection issue. Please check your internet and try again.",
  server_error: "Our service is temporarily unavailable. Please try again later.",
  unknown: "Something went wrong. Please try again.",
};

const DocTweaker = () => {
  // Text workflows
  const [documentText, setDocumentText] = useState("");
  const [context, setContext] = useState("");

  // Processing & feedback
  const [isProcessing, setIsProcessing] = useState(false);
  const [tweakedDocument, setTweakedDocument] = useState("");
  const [error, setError] = useState("");
  const [isParsingFile, setIsParsingFile] = useState(false);

  // File handling
  const [uploadedFileName, setUploadedFileName] = useState("");
  const [docxFile, setDocxFile] = useState<File | null>(null);
  const [enhancedDocxBlob, setEnhancedDocxBlob] = useState<Blob | null>(null);

  // Preview and Feedback
  const [showPreview, setShowPreview] = useState(false);
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const [feedbackAction, setFeedbackAction] = useState<
    "preview" | "download" | null
  >(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const { toast } = useToast();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  // ✅ Secure API call - hides all technical errors
  const enhanceDocumentWithBackend = async (
    file: File,
    userPrompt: string = "",
    docType: string = "auto"
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

  const handleTweak = async () => {
    // Require authentication before using enhancer services
    if (!isAuthenticated) {
      navigate(`/auth?next=${encodeURIComponent("/doc-tweaker")}`);
      return;
    }

    // Reset any previous preview state
    setShowPreview(false);

    // If we have a .docx or .pdf file, use the backend API
    if (docxFile) {
      setIsProcessing(true);
      setError("");
      setTweakedDocument("");
      setEnhancedDocxBlob(null);

      try {
        // Detect document type from file extension
        const fileName = docxFile.name.toLowerCase();
        let docType = "auto";

        if (fileName.endsWith(".pdf")) {
          docType = "auto";
        } else if (fileName.endsWith(".docx") || fileName.endsWith(".doc")) {
          docType = "auto";
        }

        const enhancedBlob = await enhanceDocumentWithBackend(
          docxFile,
          context.trim(),
          docType
        );
        setEnhancedDocxBlob(enhancedBlob);

        toast({
          title: "Success!",
          description:
            "Your document has been enhanced successfully. Preview it or download it.",
        });
      } catch (err) {
        // Show generic user-friendly message
        setError(ERROR_MESSAGES.processing_failed);
        toast({
          title: "Processing Error",
          description: ERROR_MESSAGES.processing_failed,
          variant: "destructive",
        });
      } finally {
        setIsProcessing(false);
      }
      return;
    }

    // For text-based enhancement (non-.docx/.pdf files)
    if (!documentText.trim()) {
      setError("Please provide document text or upload a file");
      return;
    }

    setIsProcessing(true);
    setError("");
    setTweakedDocument("");

    try {
      // Create a temporary .txt file and send to backend
      const textBlob = new Blob([documentText], { type: "text/plain" });

      const enhancedBlob = await enhanceDocumentWithBackend(
        textBlob as any,
        context.trim(),
        "auto"
      );

      // For text files, the backend returns a .docx, so we save it
      setEnhancedDocxBlob(enhancedBlob);

      toast({
        title: "Success!",
        description: "Your document has been enhanced and converted to DOCX format.",
      });
    } catch (err) {
      // Show generic user-friendly message
      setError(ERROR_MESSAGES.processing_failed);
      toast({
        title: "Processing Error",
        description: ERROR_MESSAGES.processing_failed,
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploadedFileName(file.name);
    setError("");
    setIsParsingFile(true);
    setDocxFile(null);
    setEnhancedDocxBlob(null);
    setShowPreview(false);
    setTweakedDocument("");

    try {
      const fileExtension = file.name.toLowerCase();

      // .docx and .pdf files are sent directly to API
      if (fileExtension.endsWith(".docx") || fileExtension.endsWith(".pdf")) {
        setDocxFile(file);
        setDocumentText("");
      } else {
        // Parse other formats client-side (.txt, .doc)
        const parseResult = await parseDocument(file);

        if (!parseResult.success || !parseResult.content) {
          throw new Error("parse_failed");
        }

        setDocumentText(parseResult.content);
        setDocxFile(null);
      }
    } catch (e) {
      // Show generic error message, don't expose details
      setError(ERROR_MESSAGES.file_invalid);
      setUploadedFileName("");
      setDocumentText("");
      setDocxFile(null);
    } finally {
      setIsParsingFile(false);
    }
  };

  const clearUploadedFile = () => {
    setUploadedFileName("");
    setDocumentText("");
    setDocxFile(null);
    setEnhancedDocxBlob(null);
    setTweakedDocument("");
    setShowPreview(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const downloadEnhancedDocx = () => {
    if (!enhancedDocxBlob) {
      toast({
        title: "Error",
        description: "No enhanced file available. Please enhance a document first.",
        variant: "destructive",
      });
      return;
    }

    try {
      const url = URL.createObjectURL(enhancedDocxBlob);
      const a = document.createElement("a");
      a.href = url;

      // Preserve original file extension
      const baseFileName =
        uploadedFileName?.replace(/\.[^/.]+$/, "") || "document";
      const originalExtension =
        uploadedFileName?.split(".").pop()?.toLowerCase() || "docx";
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

      // Trigger feedback after download
      setFeedbackAction("download");
      setFeedbackOpen(true);
    } catch (error) {
      // Show generic error message
      toast({
        title: "Download Error",
        description: "We couldn't download your file. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
            <Zap className="w-4 h-4 mr-2" />
            Document Enhancer
          </div>
          <h1 className="text-4xl lg:text-6xl font-bold text-foreground mb-6">
            Your Documents,
            <span className="block text-primary">Perfected</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Upload any document and our AI will enhance it to perfection with
            improved formatting and professional layout.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              variant="default"
              size="lg"
              className="font-semibold"
              onClick={() => {
                if (!isAuthenticated) {
                  navigate(`/auth?next=${encodeURIComponent("/doc-tweaker")}`);
                  return;
                }
              }}
            >
              <Wand2 className="w-5 h-5 mr-2" />
              Start Enhancing
            </Button>
          </div>
        </div>
      </section>

      {/* Document Enhancement Tool */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <Card className="shadow-lg">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Document Enhancer</CardTitle>
              <CardDescription>
                Upload your document for AI-powered enhancement with
                professional formatting
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* File Upload Section */}
              <div className="space-y-4">
                <Label className="text-base font-medium">
                  Upload Document (.txt, .doc, .docx, .pdf)
                </Label>

                {/* File Upload Button */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex-1"
                    disabled={isParsingFile}
                  >
                    {isParsingFile ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <Upload className="w-4 h-4 mr-2" />
                        Upload Document
                      </>
                    )}
                  </Button>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".txt,.doc,.docx,.pdf"
                    onChange={handleFileUpload}
                    className="hidden"
                  />

                  {uploadedFileName && (
                    <div className="flex items-center gap-2 px-3 py-2 bg-muted rounded-lg border border-primary/20">
                      <File className="w-4 h-4 text-primary" />
                      <span className="text-sm font-medium truncate">
                        {uploadedFileName}
                      </span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={clearUploadedFile}
                        className="h-auto p-1"
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </div>
                  )}
                </div>
              </div>

              {/* Document text area - only show for text input */}
              {!docxFile && (
                <div>
                  <Label htmlFor="document" className="text-base font-medium">
                    Your Document (or paste text here)
                  </Label>
                  <Textarea
                    id="document"
                    placeholder="Paste your document text here..."
                    className="min-h-[200px] mt-2"
                    value={documentText}
                    onChange={(e) => setDocumentText(e.target.value)}
                  />
                </div>
              )}

              {/* Info for .docx and .pdf files */}
              {docxFile && (
                <Alert>
                  <FileText className="h-4 w-4" />
                  <AlertDescription>
                    You&apos;ve uploaded a document file. When you click
                    &quot;Enhance with AI&quot;, your document will be sent to
                    our AI service for enhancement with improved formatting and
                    professional layout.
                  </AlertDescription>
                </Alert>
              )}

              {/* User instructions field */}
              <div>
                <Label htmlFor="context" className="text-base font-medium">
                  Enhancement Instructions (Optional)
                </Label>
                <Textarea
                  id="context"
                  placeholder="e.g., 'Make each practical more detailed' or 'Add more professional language' or 'Reorganize sections for better flow'"
                  className="min-h-[100px] mt-2"
                  value={context}
                  onChange={(e) => setContext(e.target.value)}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Tell the AI how you want to enhance your document. Leave blank
                  for automatic enhancement.
                </p>
              </div>

              <div className="flex gap-3">
                <Button
                  onClick={handleTweak}
                  disabled={(!documentText.trim() && !docxFile) || isProcessing}
                  className="flex-1"
                  size="lg"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      AI is enhancing your document...
                    </>
                  ) : (
                    <>
                      <Wand2 className="w-5 h-5 mr-2" />
                      Enhance with AI
                    </>
                  )}
                </Button>

                {(enhancedDocxBlob || documentText || docxFile) && (
                  <Button
                    onClick={() => {
                      clearUploadedFile();
                      setContext("");
                    }}
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
              {showPreview && enhancedDocxBlob && (
                <div className="pt-4">
                  <DocumentPreview
                    fileBlob={enhancedDocxBlob}
                    fileName={uploadedFileName || "enhanced_document.docx"}
                    onClose={() => {
                      setShowPreview(false);
                      setFeedbackAction("preview");
                      setFeedbackOpen(true);
                    }}
                    onDownload={downloadEnhancedDocx}
                  />
                </div>
              )}

              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {/* Results for enhanced document */}
              {enhancedDocxBlob && (
                <div className="border-t pt-6 space-y-4">
                  <h3 className="text-base font-medium">Enhanced Document</h3>

                  {/* Action Buttons */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <Button
                      variant="outline"
                      onClick={() =>
                        setShowPreview((s) => {
                          const next = !s;
                          if (!next) {
                            setFeedbackAction("preview");
                            setFeedbackOpen(true);
                          }
                          return next;
                        })
                      }
                      className="w-full"
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      {showPreview ? "Hide" : "Preview"} Document
                    </Button>

                    <Button
                      variant="default"
                      onClick={downloadEnhancedDocx}
                      className="w-full"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download Enhanced Document
                    </Button>
                  </div>

                  <div className="p-4 bg-muted rounded-lg border border-primary/20">
                    <p className="text-sm text-foreground">
                      Your document has been successfully enhanced with improved
                      formatting and professional layout. Use the Preview button
                      for an HTML preview before downloading.
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </section>

      <FeedbackDialog
        open={feedbackOpen}
        onOpenChange={setFeedbackOpen}
        context={{
          fileName:
            uploadedFileName ||
            (docxFile ? "enhanced_document.docx" : "enhanced-document.txt"),
          action: feedbackAction ?? undefined,
        }}
      />
    </div>
  );
};

export default DocTweaker;
