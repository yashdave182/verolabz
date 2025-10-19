import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
  CheckCircle,
  Info,
  Eye,
  Copy,
  RefreshCw
} from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  processDocument,
  validateBackendConfiguration,
  detectDocumentMode,
  downloadDocument
} from "@/lib/enhancedBackendService";
import { useToast } from "@/hooks/use-toast";

type ProcessingStage = 'idle' | 'uploading' | 'ocr' | 'enhancing' | 'formatting' | 'complete' | 'error';

const EnhancedDocTweaker = () => {
  const [document, setDocument] = useState("");
  const [context, setContext] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStage, setProcessingStage] = useState<ProcessingStage>('idle');
  const [progress, setProgress] = useState(0);
  const [originalText, setOriginalText] = useState("");
  const [enhancedText, setEnhancedText] = useState("");
  const [error, setError] = useState("");
  const [uploadedFileName, setUploadedFileName] = useState("");
  const [documentId, setDocumentId] = useState("");
  const [backendStatus, setBackendStatus] = useState<{
    isConfigured: boolean;
    message: string;
    checked: boolean;
  }>({ isConfigured: false, message: '', checked: false });
  // Add state for detailed processing messages
  const [processingMessage, setProcessingMessage] = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  // Check backend configuration on mount
  const checkBackend = async () => {
    try {
      const status = await validateBackendConfiguration();
      setBackendStatus({
        isConfigured: status.isConfigured,
        message: status.message,
        checked: true
      });

      if (!status.isConfigured) {
        toast({
          title: "Configuration Required",
          description: status.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      setBackendStatus({
        isConfigured: false,
        message: "Backend server is not running. Please start the Flask server.",
        checked: true
      });
    }
  };

  const updateProgress = (stage: ProcessingStage, message: string = "") => {
    setProcessingStage(stage);
    setProcessingMessage(message);
    const progressMap: Record<ProcessingStage, number> = {
      idle: 0,
      uploading: 20,
      ocr: 40,
      enhancing: 60,
      formatting: 80,
      complete: 100,
      error: 0
    };
    setProgress(progressMap[stage]);
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploadedFileName(file.name);
    setError('');

    // Detect appropriate processing mode
    const mode = detectDocumentMode(file);
    console.log(`File uploaded: ${file.name}, Mode: ${mode}`);
  };

  const clearUploadedFile = () => {
    setUploadedFileName('');
    setDocument('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleProcess = async () => {
    if (!fileInputRef.current?.files?.[0] && !document.trim()) {
      toast({
        title: "No Document",
        description: "Please upload a document or paste text",
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

    // Check backend first
    if (!backendStatus.checked) {
      await checkBackend();
    }

    if (!backendStatus.isConfigured) {
      toast({
        title: "Backend Not Configured",
        description: backendStatus.message,
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    setError("");
    setEnhancedText("");
    updateProgress('uploading', "Uploading document...");

    try {
      const file = fileInputRef.current?.files?.[0];

      if (file) {
        // Process uploaded file
        const mode = detectDocumentMode(file);

        updateProgress('ocr', "Extracting text with Unstract OCR...");
        toast({
          title: "Extracting Text",
          description: "Using Unstract OCR to extract text from your document...",
        });

        updateProgress('enhancing', "Enhancing with Gemini AI... This may take a moment.");
        toast({
          title: "Enhancing Document",
          description: "Gemini AI is improving your document while preserving layout...",
        });

        const result = await processDocument(file, context.trim(), mode, true);

        if (!result.success) {
          throw new Error(result.error || 'Processing failed');
        }

        setOriginalText(result.original_text || '');
        setEnhancedText(result.enhanced_text || '');
        setDocumentId(result.document_id || '');

        updateProgress('formatting', "Applying format preservation...");
        // Small delay to show formatting step
        await new Promise(resolve => setTimeout(resolve, 500));

        updateProgress('complete', "Complete!");

        toast({
          title: "Success!",
          description: "Your document has been enhanced successfully.",
        });

      } else if (document.trim()) {
        // Process pasted text (direct enhancement without OCR)
        updateProgress('enhancing', "Enhancing with Gemini AI... This may take a moment.");

        // For direct text, we'll use the backend's enhance endpoint
        const { enhanceDocument } = await import('@/lib/enhancedBackendService');
        const result = await enhanceDocument(document.trim(), context.trim(), true);

        if (!result.success) {
          throw new Error(result.error || 'Enhancement failed');
        }

        setOriginalText(document.trim());
        setEnhancedText(result.enhanced_text || '');

        updateProgress('complete', "Complete!");

        toast({
          title: "Success!",
          description: "Your text has been enhanced successfully.",
        });
      }

    } catch (err) {
      console.error('Processing error:', err);
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
      setError(errorMessage);
      updateProgress('error', "Error occurred");

      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = (format: 'txt' | 'docx' = 'txt') => {
    if (!enhancedText || !documentId) return;

    // For DOCX format, we need to use the backend service
    if (format === 'docx' && documentId) {
      // Use the backend service to generate and download DOCX
      downloadDocument(documentId, 'docx')
        .then(blob => {
          const url = URL.createObjectURL(blob);
          const a = window.document.createElement('a');
          a.href = url;
          a.download = `enhanced_${uploadedFileName || 'document'}.docx`;
          window.document.body.appendChild(a);
          a.click();
          window.document.body.removeChild(a);
          URL.revokeObjectURL(url);

          toast({
            title: "Downloaded",
            description: "Enhanced document has been downloaded as Word document.",
          });
        })
        .catch(error => {
          console.error('Download error:', error);
          toast({
            title: "Download Failed",
            description: "Failed to download as Word document. Downloading as text instead.",
            variant: "destructive",
          });
          // Fallback to text download
          handleDownloadTxt();
        });
    } else {
      // Original TXT format
      handleDownloadTxt();
    }
  };

  const handleDownloadTxt = () => {
    if (!enhancedText) return;
    
    const blob = new Blob([enhancedText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = window.document.createElement('a');
    a.href = url;
    a.download = `enhanced_${uploadedFileName || 'document'}.txt`;
    window.document.body.appendChild(a);
    a.click();
    window.document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "Downloaded",
      description: "Enhanced document has been downloaded as text file.",
    });
  };

  const handleDownloadTxtClick = () => {
    handleDownload('txt');
  };

  const handleDownloadDocxClick = () => {
    handleDownload('docx');
  };

  const handleCopy = () => {
    if (!enhancedText) return;

    navigator.clipboard.writeText(enhancedText);
    toast({
      title: "Copied",
      description: "Enhanced text copied to clipboard.",
    });
  };

  const handleReset = () => {
    setDocument("");
    setContext("");
    setOriginalText("");
    setEnhancedText("");
    setError("");
    setUploadedFileName("");
    setDocumentId("");
    setProcessingStage('idle');
    setProgress(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const getStageLabel = (stage: ProcessingStage): string => {
    const labels: Record<ProcessingStage, string> = {
      idle: 'Ready',
      uploading: 'Uploading document...',
      ocr: 'Extracting text with OCR...',
      enhancing: 'Enhancing with AI...',
      formatting: 'Preserving format...',
      complete: 'Complete!',
      error: 'Error occurred'
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
            Upload any document (PDF, Word, or Text). Our AI extracts text with OCR,
            enhances it intelligently, and preserves your original formatting.
          </p>

          {/* Backend Status */}
          {backendStatus.checked && (
            <div className="mb-6">
              <Badge
                variant={backendStatus.isConfigured ? "default" : "destructive"}
                className="text-sm px-4 py-2"
              >
                {backendStatus.isConfigured ? (
                  <>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Backend Ready
                  </>
                ) : (
                  <>
                    <AlertCircle className="w-4 h-4 mr-2" />
                    Configuration Required
                  </>
                )}
              </Badge>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              variant="default"
              size="lg"
              className="font-semibold"
              onClick={() => !backendStatus.checked && checkBackend()}
            >
              {backendStatus.checked ? (
                <>
                  <Wand2 className="w-5 h-5 mr-2" />
                  Start Enhancing
                </>
              ) : (
                <>
                  <RefreshCw className="w-5 h-5 mr-2" />
                  Check Backend Status
                </>
              )}
            </Button>
          </div>
        </div>
      </section>

      {/* Main Processing Tool */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <Card className="shadow-lg">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Document Enhancement Pipeline</CardTitle>
              <CardDescription>
                Upload → OCR Extract → AI Enhance → Format Preserve
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">

              {/* Processing Progress */}
              {isProcessing && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{getStageLabel(processingStage)}</span>
                    <span className="text-sm text-muted-foreground">{progress}%</span>
                  </div>
                  <Progress value={progress} className="w-full" />
                  {processingMessage && (
                    <p className="text-xs text-muted-foreground text-center">{processingMessage}</p>
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

              {/* Backend Configuration Alert */}
              {backendStatus.checked && !backendStatus.isConfigured && (
                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertTitle>Configuration Required</AlertTitle>
                  <AlertDescription>
                    {backendStatus.message}
                    <br />
                    <span className="text-xs mt-2 block">
                      Please configure your API keys in the .env file and restart the backend server.
                    </span>
                  </AlertDescription>
                </Alert>
              )}

              {/* Input Section */}
              <div className="space-y-6">
                {/* File Upload */}
                <div className="space-y-4">
                  <Label className="text-base font-medium">Upload Document</Label>

                  <div className="flex flex-col sm:flex-row gap-3">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => fileInputRef.current?.click()}
                      className="flex-1"
                      disabled={isProcessing}
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      Choose File (.txt, .pdf, .doc, .docx)
                    </Button>

                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".txt,.pdf,.doc,.docx"
                      onChange={handleFileUpload}
                      className="hidden"
                    />

                    {uploadedFileName && (
                      <div className="flex items-center gap-2 px-4 py-2 bg-muted rounded-lg border border-primary/20">
                        <File className="w-4 h-4 text-primary" />
                        <span className="text-sm font-medium truncate max-w-[200px]">{uploadedFileName}</span>
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

                  <div className="text-center text-sm text-muted-foreground">
                    or paste your text below
                  </div>
                </div>

                {/* Text Input */}
                <div>
                  <Label htmlFor="document" className="text-base font-medium">
                    Your Document (Optional if file uploaded)
                  </Label>
                  <Textarea
                    id="document"
                    placeholder="Paste your document text here..."
                    className="min-h-[150px] mt-2 font-mono text-sm"
                    value={document}
                    onChange={(e) => setDocument(e.target.value)}
                    disabled={isProcessing}
                  />
                </div>

                {/* Context Input */}
                <div>
                  <Label htmlFor="context" className="text-base font-medium">
                    Enhancement Instructions *
                  </Label>
                  <Textarea
                    id="context"
                    placeholder="Examples of effective requests:
- 'Fix grammar and spelling errors'
- 'Make this sound more professional for a business proposal'
- 'Improve clarity for technical documentation'
- 'Make this more engaging for a general audience'
- 'Shorten this document while keeping key points'"
                    className="min-h-[120px] mt-2"
                    value={context}
                    onChange={(e) => setContext(e.target.value)}
                    disabled={isProcessing}
                  />
                  <p className="text-xs text-muted-foreground mt-2">
                    Be specific about what you want to achieve. The AI will follow your instructions.
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <Button
                    onClick={handleProcess}
                    disabled={isProcessing || (!uploadedFileName && !document.trim()) || !context.trim()}
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

                  {(originalText || enhancedText) && (
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
              </div>

              {/* Results Section */}
              {(originalText || enhancedText) && (
                <div className="border-t pt-6">
                  <div className="flex items-center justify-between mb-4">
                    <Label className="text-base font-medium">Results</Label>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleCopy}
                        disabled={!enhancedText}
                      >
                        <Copy className="w-4 h-4 mr-2" />
                        Copy
                      </Button>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleDownloadTxtClick}
                          disabled={!enhancedText}
                        >
                          <Download className="w-4 h-4 mr-2" />
                          Download TXT
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleDownloadDocxClick}
                          disabled={!enhancedText || !documentId}
                        >
                          <Download className="w-4 h-4 mr-2" />
                          Download DOCX
                        </Button>
                      </div>
                    </div>
                  </div>

                  <Tabs defaultValue="enhanced" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="original">
                        <FileText className="w-4 h-4 mr-2" />
                        Original
                      </TabsTrigger>
                      <TabsTrigger value="enhanced">
                        <Eye className="w-4 h-4 mr-2" />
                        Enhanced
                      </TabsTrigger>
                    </TabsList>

                    <TabsContent value="original" className="mt-4">
                      <div className="p-4 bg-muted rounded-lg border max-h-[500px] overflow-y-auto">
                        <pre className="whitespace-pre-wrap text-sm text-foreground font-mono">
                          {originalText || 'No original text available'}
                        </pre>
                      </div>
                      <p className="text-xs text-muted-foreground mt-2">
                        Original text extracted from your document
                      </p>
                    </TabsContent>

                    <TabsContent value="enhanced" className="mt-4">
                      <div className="p-4 bg-primary/5 rounded-lg border border-primary/20 max-h-[500px] overflow-y-auto">
                        <pre className="whitespace-pre-wrap text-sm text-foreground font-mono">
                          {enhancedText || 'Processing...'}
                        </pre>
                      </div>
                      <p className="text-xs text-muted-foreground mt-2">
                        AI-enhanced version with preserved formatting
                      </p>
                    </TabsContent>
                  </Tabs>
                </div>
              )}

              {/* Features Info */}
              {!originalText && !enhancedText && (
                <div className="bg-muted/50 rounded-lg p-6 space-y-4">
                  <h3 className="font-semibold text-center mb-4">How It Works</h3>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="flex gap-3">
                      <div className="flex-shrink-0">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                          <Upload className="w-4 h-4 text-primary" />
                        </div>
                      </div>
                      <div>
                        <h4 className="font-medium text-sm">1. Upload Document</h4>
                        <p className="text-xs text-muted-foreground">PDF, Word, or plain text files</p>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <div className="flex-shrink-0">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                          <Eye className="w-4 h-4 text-primary" />
                        </div>
                      </div>
                      <div>
                        <h4 className="font-medium text-sm">2. OCR Extraction</h4>
                        <p className="text-xs text-muted-foreground">Unstract extracts text & layout</p>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <div className="flex-shrink-0">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                          <Wand2 className="w-4 h-4 text-primary" />
                        </div>
                      </div>
                      <div>
                        <h4 className="font-medium text-sm">3. AI Enhancement</h4>
                        <p className="text-xs text-muted-foreground">Gemini improves your content</p>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <div className="flex-shrink-0">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                          <Download className="w-4 h-4 text-primary" />
                        </div>
                      </div>
                      <div>
                        <h4 className="font-medium text-sm">4. Format Preserved</h4>
                        <p className="text-xs text-muted-foreground">Download enhanced document</p>
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
