import { useRef, useState, useEffect } from "react";
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

  // Calls the Hugging Face Space for .docx enhancement
  const enhanceDocumentWithHuggingFace = async (
    file: File,
    prompt: string,
  ): Promise<Blob> => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("prompt", prompt);
    formData.append("mode", "designer_auto_v2");
    formData.append("output_format", "docx");

    const response = await fetch(
      "https://omgy-vero-back-test.hf.space/enhance",
      {
        method: "POST",
        body: formData,
      },
    );

    if (!response.ok) {
      const err = await response.text();
      throw new Error(`API error: ${err}`);
    }

    return await response.blob();
  };

  const handleTweak = async () => {
    // Require authentication before using enhancer services
    if (!isAuthenticated) {
      navigate(`/auth?next=${encodeURIComponent("/doc-tweaker")}`);
      return;
    }

    // Reset any previous preview state
    setShowPreview(false);

    // If we have a .docx file, use the Hugging Face API
    if (docxFile) {
      if (!context.trim()) {
        setError("Please provide enhancement instructions");
        return;
      }

      setIsProcessing(true);
      setError("");
      setTweakedDocument("");
      setEnhancedDocxBlob(null);

      try {
        const enhancedBlob = await enhanceDocumentWithHuggingFace(
          docxFile,
          context.trim(),
        );
        setEnhancedDocxBlob(enhancedBlob);

        toast({
          title: "Success!",
          description:
            "Your .docx document has been enhanced successfully. Preview it or download it.",
        });
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "An unexpected error occurred",
        );
      } finally {
        setIsProcessing(false);
      }
      return;
    }

    // For text-based enhancement (non-.docx files). Placeholder behavior.
    if (!documentText.trim() || !context.trim()) return;

    setIsProcessing(true);
    setError("");
    setTweakedDocument("");

    try {
      // Placeholder: return original text. Replace with client-side AI if needed.
      setTweakedDocument(documentText.trim());

      toast({
        title: "Notice",
        description:
          "Text enhancement is not available in this version. Returning original text.",
      });
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unexpected error occurred",
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
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
      // .docx files are sent directly to API, no parsing
      if (file.name.toLowerCase().endsWith(".docx")) {
        setDocxFile(file);
        setDocumentText("");
      } else {
        // Parse other formats client-side
        const parseResult = await parseDocument(file);

        if (!parseResult.success || !parseResult.content) {
          throw new Error(
            parseResult.error || "Failed to extract text from document",
          );
        }

        setDocumentText(parseResult.content);
        setDocxFile(null);
      }
    } catch (e) {
      console.error("File upload error:", e);
      setError("Failed to process file. Please try again.");
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
        description: "No enhanced file available for download.",
        variant: "destructive",
      });
      return;
    }

    try {
      const url = URL.createObjectURL(enhancedDocxBlob);
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

      // Trigger feedback after download
      setFeedbackAction("download");
      setFeedbackOpen(true);
    } catch (error) {
      console.error("Download error:", error);
      toast({
        title: "Download Failed",
        description:
          "Failed to download the enhanced document. Please try again.",
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
            Upload any document and describe what you want to achieve. Our AI
            will enhance it to perfection.
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
              Start Tweaking
            </Button>
          </div>
        </div>
      </section>

      {/* Document Tweak Tool */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Preview moved below the Enhance button */}
          <Card className="shadow-lg">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Document Enhancer</CardTitle>
              <CardDescription>
                Upload your document and tell us your goal for personalized AI
                enhancement
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* File Upload Section */}
              <div className="space-y-4">
                <Label className="text-base font-medium">Upload Document</Label>

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
                        Upload Document (.txt, .pdf, .doc, .docx)
                      </>
                    )}
                  </Button>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".txt,.pdf,.doc,.docx"
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

              {/* Document text area - only show for non-.docx files */}
              {!docxFile && (
                <div>
                  <Label htmlFor="document" className="text-base font-medium">
                    Your Document
                  </Label>
                  <Textarea
                    id="document"
                    placeholder="Paste your document here..."
                    className="min-h-[200px] mt-2"
                    value={documentText}
                    onChange={(e) => setDocumentText(e.target.value)}
                  />
                </div>
              )}

              {/* Special note for .docx files */}
              {docxFile && (
                <Alert>
                  <FileText className="h-4 w-4" />
                  <AlertDescription>
                    You&apos;ve uploaded a .docx file. When you click
                    &quot;Enhance with AI&quot;, your document will be sent to
                    our AI service for enhancement while preserving the original
                    layout.
                  </AlertDescription>
                </Alert>
              )}

              <div>
                <Label htmlFor="context" className="text-base font-medium">
                  What would you like to achieve?
                </Label>
                <Textarea
                  id="context"
                  placeholder="e.g., 'Make this sound more professional for a job application' or 'Improve the flow and clarity of this essay'"
                  className="min-h-[100px] mt-2"
                  value={context}
                  onChange={(e) => setContext(e.target.value)}
                />
              </div>

              <div className="flex gap-3">
                <Button
                  onClick={handleTweak}
                  disabled={
                    (!documentText.trim() && !docxFile) ||
                    !context.trim() ||
                    isProcessing
                  }
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

              {/* Inline Preview (below Enhance button) */}
              {showPreview && enhancedDocxBlob && (
                <div className="pt-4">
                  <DocumentPreview
                    fileBlob={enhancedDocxBlob}
                    fileName={uploadedFileName || "enhanced_document.docx"}
                    onClose={() => {
                      setShowPreview(false);
                      // Trigger feedback when closing preview
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

              {/* Results for enhanced .docx */}
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

                          // Only show feedback when closing preview
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
                      Your .docx document has been successfully enhanced while
                      preserving formatting. Use the Preview button for an HTML
                      preview before downloading.
                    </p>
                  </div>
                </div>
              )}

              {/* Results for non-.docx text */}
              {tweakedDocument && !docxFile && (
                <div className="border-t pt-6">
                  <Label className="text-base font-medium">
                    AI Enhanced Document
                  </Label>
                  <div className="mt-2 p-4 bg-muted rounded-lg border border-primary/20">
                    <pre className="whitespace-pre-wrap text-sm text-foreground">
                      {tweakedDocument}
                    </pre>
                  </div>
                  <div className="flex gap-3 mt-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const blob = new Blob([tweakedDocument], {
                          type: "text/plain",
                        });
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement("a");
                        a.href = url;
                        a.download = "enhanced-document.txt";
                        document.body.appendChild(a);
                        a.click();
                        document.body.removeChild(a);
                        URL.revokeObjectURL(url);
                        // Prompt feedback after download for text case
                        setFeedbackAction("download");
                        setFeedbackOpen(true);
                      }}
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        navigator.clipboard.writeText(tweakedDocument);
                      }}
                    >
                      Copy to Clipboard
                    </Button>
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
