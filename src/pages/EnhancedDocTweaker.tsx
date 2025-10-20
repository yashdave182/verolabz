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
  Eye,
  RefreshCw
} from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";

type ProcessingStage = 'idle' | 'uploading' | 'enhancing' | 'complete' | 'error';

const EnhancedDocTweaker = () => {
  const [context, setContext] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStage, setProcessingStage] = useState<ProcessingStage>('idle');
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState("");
  const [uploadedFileName, setUploadedFileName] = useState("");
  const [enhancedFileBlob, setEnhancedFileBlob] = useState<Blob | null>(null);
  const [processingMessage, setProcessingMessage] = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const updateProgress = (stage: ProcessingStage, message: string = "") => {
    setProcessingStage(stage);
    setProcessingMessage(message);
    const progressMap: Record<ProcessingStage, number> = {
      idle: 0,
      uploading: 30,
      enhancing: 70,
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
  };

  const clearUploadedFile = () => {
    setUploadedFileName('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // New function to call the Hugging Face API
  const enhanceDocumentWithHuggingFace = async (file: File, prompt: string): Promise<Blob> => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("user_prompt", prompt);
    formData.append("model_choice", "gemini-2.0-flash");

    const response = await fetch("https://omgy-verolabz.hf.space/process-document", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const err = await response.text();
      throw new Error(`API error: ${err}`);
    }

    return await response.blob(); // The enhanced .docx file
  };

  const handleProcess = async () => {
    if (!fileInputRef.current?.files?.[0]) {
      toast({
        title: "No Document",
        description: "Please upload a document",
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

    setIsProcessing(true);
    setError("");
    setEnhancedFileBlob(null);
    updateProgress('uploading', "Uploading document...");

    try {
      const file = fileInputRef.current?.files?.[0];

      if (file) {
        // Check file type - only .docx is supported by the Hugging Face API
        if (!file.name.endsWith('.docx')) {
          throw new Error("Only .docx files are supported by the Hugging Face API");
        }

        updateProgress('enhancing', "Enhancing with AI... This may take a moment.");
        toast({
          title: "Enhancing Document",
          description: "AI is improving your document while preserving layout...",
        });

        // Call the Hugging Face API
        const enhancedBlob = await enhanceDocumentWithHuggingFace(file, context.trim());
        setEnhancedFileBlob(enhancedBlob);

        updateProgress('complete', "Complete!");

        toast({
          title: "Success!",
          description: "Your document has been enhanced successfully.",
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
      const a = document.createElement('a');
      a.href = url;
      a.download = `enhanced_${uploadedFileName || 'document'}.docx`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast({
        title: "Downloaded",
        description: "Enhanced document has been downloaded.",
      });
    } catch (error) {
      console.error('Download error:', error);
      toast({
        title: "Download Failed",
        description: "Failed to download the enhanced document. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleReset = () => {
    setContext("");
    setEnhancedFileBlob(null);
    setError("");
    setUploadedFileName("");
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
      enhancing: 'Enhancing with AI...',
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
            Upload a .docx document and describe what you want to achieve. Our AI will enhance it to perfection.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              variant="default"
              size="lg"
              className="font-semibold"
            >
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
              <CardTitle className="text-2xl">Document Enhancement Pipeline</CardTitle>
              <CardDescription>
                Upload → AI Enhance → Download
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

              {/* Input Section */}
              <div className="space-y-6">
                {/* File Upload */}
                <div className="space-y-4">
                  <Label className="text-base font-medium">Upload Document (.docx only)</Label>

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
                    Your specific request will be the primary focus of the AI enhancement.
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <Button
                    onClick={handleProcess}
                    disabled={isProcessing || !uploadedFileName || !context.trim()}
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

                  {(enhancedFileBlob) && (
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
              {enhancedFileBlob && (
                <div className="border-t pt-6">
                  <div className="flex items-center justify-between mb-4">
                    <Label className="text-base font-medium">Results</Label>
                    <div className="flex gap-2">
                      <Button
                        variant="default"
                        size="sm"
                        onClick={handleDownload}
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Download Enhanced DOCX
                      </Button>
                    </div>
                  </div>
                  <Alert>
                    <CheckCircle className="h-4 w-4" />
                    <AlertTitle>Success!</AlertTitle>
                    <AlertDescription>
                      Your document has been successfully enhanced. Click the download button to get your enhanced .docx file.
                    </AlertDescription>
                  </Alert>
                </div>
              )}

              {/* Features Info */}
              {!enhancedFileBlob && (
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
                        <p className="text-xs text-muted-foreground">Upload a .docx file</p>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <div className="flex-shrink-0">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                          <Wand2 className="w-4 h-4 text-primary" />
                        </div>
                      </div>
                      <div>
                        <h4 className="font-medium text-sm">2. AI Enhancement</h4>
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
                        <h4 className="font-medium text-sm">3. Download</h4>
                        <p className="text-xs text-muted-foreground">Get your enhanced document</p>
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