import { useState, useRef, useEffect } from "react";
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
  Loader2
} from "lucide-react";
import { enhanceDocument } from "@/lib/groq";
import { parseDocument } from "@/lib/documentParser";
import { Alert, AlertDescription } from "@/components/ui/alert";

const DocTweaker = () => {
  const [document, setDocument] = useState("");
  const [context, setContext] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [tweakedDocument, setTweakedDocument] = useState("");
  const [error, setError] = useState("");
  const [uploadedFileName, setUploadedFileName] = useState("");
  const [isParsingFile, setIsParsingFile] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleTweak = async () => {
    if (!document.trim() || !context.trim()) return;
    
    setIsProcessing(true);
    setError("");
    setTweakedDocument("");
    
    try {
      const enhanced = await enhanceDocument({
        document: document.trim(),
        context: context.trim(),
        documentType: 'general'
      });
      
      setTweakedDocument(enhanced);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploadedFileName(file.name);
    setError('');
    setIsParsingFile(true);

    try {
      // Parse document directly without backend
      const parseResult = await parseDocument(file);
      
      if (!parseResult.success || !parseResult.content) {
        throw new Error(parseResult.error || 'Failed to extract text from document');
      }

      setDocument(parseResult.content);
    } catch (error) {
      console.error('File upload error:', error);
      setError('Failed to process file. Please try again.');
      setUploadedFileName('');
    } finally {
      setIsParsingFile(false);
    }
  };

  const clearUploadedFile = () => {
    setUploadedFileName('');
    setDocument('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
            <Zap className="w-4 h-4 mr-2" />
            Doc Tweaker
          </div>
          <h1 className="text-4xl lg:text-6xl font-bold text-foreground mb-6">
            Your Documents,
            <span className="block text-primary">Perfected</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Upload any document and describe what you want to achieve. Our AI will enhance it to perfection.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="default" size="lg" className="font-semibold">
              <Wand2 className="w-5 h-5 mr-2" />
              Start Tweaking
            </Button>
          </div>
        </div>
      </section>

      {/* Document Tweak Tool */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <Card className="shadow-lg">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Document Enhancer</CardTitle>
              <CardDescription>
                Upload your document and tell us your goal for personalized AI enhancement
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* File Upload Section */}
              <div className="space-y-4">
                <Label className="text-base font-medium">Upload Document or Paste Text</Label>
                
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
                      <span className="text-sm font-medium truncate">{uploadedFileName}</span>
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
                
                <div className="text-center text-sm text-muted-foreground">
                  or
                </div>
              </div>

              <div>
                <Label htmlFor="document" className="text-base font-medium">
                  Your Document
                </Label>
                <Textarea
                  id="document"
                  placeholder="Paste your document here..."
                  className="min-h-[200px] mt-2"
                  value={document}
                  onChange={(e) => setDocument(e.target.value)}
                />
              </div>

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

              <Button 
                onClick={handleTweak}
                disabled={!document.trim() || !context.trim() || isProcessing}
                className="w-full" 
                size="lg"
              >
                {isProcessing ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    AI is enhancing your document...
                  </>
                ) : (
                  <>
                    <Wand2 className="w-5 h-5 mr-2" />
                    Enhance with AI
                  </>
                )}
              </Button>

              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    {error}
                  </AlertDescription>
                </Alert>
              )}

              {tweakedDocument && (
                <div className="border-t pt-6">
                  <Label className="text-base font-medium">AI Enhanced Document</Label>
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
                        const blob = new Blob([tweakedDocument], { type: 'text/plain' });
                        const url = URL.createObjectURL(blob);
                        const a = window.document.createElement('a');
                        a.href = url;
                        a.download = 'enhanced-document.txt';
                        window.document.body.appendChild(a);
                        a.click();
                        window.document.body.removeChild(a);
                        URL.revokeObjectURL(url);
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
    </div>
  );
};

export default DocTweaker;