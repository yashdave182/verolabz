import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { 
  FileText, 
  Upload, 
  Wand2, 
  Download, 
  Building2, 
  Loader2,
  CheckCircle,
  AlertTriangle,
  File,
  X,
  Layout,
  Layers,
  Target,
  BarChart3
} from "lucide-react";
import { BackendService } from "@/lib/backendService";
import { Alert, AlertDescription } from "@/components/ui/alert";

const EnhancedDocumentProcessor = () => {
  const [documentText, setDocumentText] = useState("");
  const [context, setContext] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [enhancedDocument, setEnhancedDocument] = useState("");
  const [reconstructedHTML, setReconstructedHTML] = useState<string | ArrayBuffer>("");
  const [error, setError] = useState("");
  const [uploadedFileName, setUploadedFileName] = useState("");
  const [isParsingFile, setIsParsingFile] = useState(false);
  const [backendAvailable, setBackendAvailable] = useState<boolean | null>(null);
  const [processingMethod, setProcessingMethod] = useState<string>("");
  const [processingProgress, setProcessingProgress] = useState("");
  const [documentType, setDocumentType] = useState<'business' | 'student'>('business');
  const [outputFormat, setOutputFormat] = useState<'html' | 'markdown' | 'text' | 'docx' | 'pdf'>('html');
  const [enhancementLevel, setEnhancementLevel] = useState<'light' | 'standard' | 'comprehensive'>('standard');
  const [documentStats, setDocumentStats] = useState<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Check backend availability on component mount
  useEffect(() => {
    const checkBackend = async () => {
      const isAvailable = await BackendService.isAvailable();
      setBackendAvailable(isAvailable);
    };
    checkBackend();
  }, []);

  const handleEnhancedProcessing = async () => {
    if (!documentText.trim() || !context.trim()) return;
    
    setIsProcessing(true);
    setError("");
    setEnhancedDocument("");
    setReconstructedHTML("");
    setDocumentStats(null);
    
    try {
      // Create a simple text file for processing
      const textBlob = new Blob([documentText], { type: 'text/plain' });
      const textFile = new File([textBlob], uploadedFileName || 'document.txt', { type: 'text/plain' });
      
      const result = await BackendService.processDocumentEnhanced(
        textFile,
        context.trim(),
        documentType,
        {
          outputFormat,
          enhancementLevel,
          includeOriginal: true
        },
        (message) => setProcessingProgress(message)
      );
      
      if (result.success && result.data) {
        setEnhancedDocument(result.data.enhancedText);
        if (result.data.reconstructedDocument) {
          setReconstructedHTML(result.data.reconstructedDocument);
        }
        if (result.data.statistics) {
          setDocumentStats(result.data.statistics);
        }
        setProcessingMethod('Enhanced Backend API with Format Preservation');
        setProcessingProgress('Enhanced processing completed successfully!');

        // Handle different output formats for download
        if (outputFormat === 'docx' && result.data.reconstructedDocument) {
          downloadFile(result.data.reconstructedDocument, `enhanced-${uploadedFileName || 'document'}.docx`, 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
        } else if (outputFormat === 'pdf' && result.data.reconstructedDocument) {
          downloadFile(result.data.reconstructedDocument, `enhanced-${uploadedFileName || 'document'}.pdf`, 'application/pdf');
        }

      } else {
        throw new Error(result.error || 'Enhancement failed');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setIsProcessing(false);
      setTimeout(() => setProcessingProgress(''), 3000);
    }
  };

  const downloadFile = (data: string | ArrayBuffer, filename: string, mimeType: string) => {
    const blob = new Blob([data], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const downloadHTMLResult = () => {
    if (!reconstructedHTML) return;
    downloadFile(reconstructedHTML, `enhanced-${uploadedFileName || 'document'}.html`, 'text/html');
  };

  const downloadTextResult = () => {
    if (!enhancedDocument) return;
    downloadFile(enhancedDocument, `enhanced-${uploadedFileName || 'document'}.txt`, 'text/plain');
  };

  return (
    <div className="min-h-screen bg-gradient-subtle py-8">
      <div className="max-w-6xl mx-auto px-4">
        <Card className="shadow-business mb-8">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl flex items-center justify-center gap-3">
              <Layout className="w-8 h-8 text-business-primary" />
              Enhanced Document Processor
            </CardTitle>
            <CardDescription className="text-lg">
              Advanced AI-powered document enhancement with complete format preservation
            </CardDescription>
            
            {/* Backend Status Indicator */}
            <div className="mt-4 flex justify-center">
              {backendAvailable === null ? (
                <div className="flex items-center gap-2 px-3 py-1 bg-gray-100 rounded-full text-sm">
                  <Loader2 className="w-3 h-3 animate-spin" />
                  <span>Checking enhanced backend...</span>
                </div>
              ) : backendAvailable ? (
                <div className="flex items-center gap-2 px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                  <CheckCircle className="w-3 h-3" />
                  <span>🚀 Enhanced Backend Active (OCR + AI + Format Preservation)</span>
                </div>
              ) : (
                <div className="flex items-center gap-2 px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm">
                  <AlertTriangle className="w-3 h-3" />
                  <span>Enhanced Backend Offline - Basic Mode Only</span>
                </div>
              )}
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Processing Options */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="documentType">Document Type</Label>
                <Select value={documentType} onValueChange={(value: 'business' | 'student') => setDocumentType(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="business">Business Document</SelectItem>
                    <SelectItem value="student">Academic Document</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="enhancementLevel">Enhancement Level</Label>
                <Select value={enhancementLevel} onValueChange={(value: 'light' | 'standard' | 'comprehensive') => setEnhancementLevel(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">Light Enhancement</SelectItem>
                    <SelectItem value="standard">Standard Enhancement</SelectItem>
                    <SelectItem value="comprehensive">Comprehensive Rewrite</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="outputFormat">Output Format</Label>
                <Select value={outputFormat} onValueChange={(value: 'html' | 'markdown' | 'text' | 'docx' | 'pdf') => setOutputFormat(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="html">HTML (Formatted)</SelectItem>
                    <SelectItem value="markdown">Markdown</SelectItem>
                    <SelectItem value="text">Plain Text</SelectItem>
                    <SelectItem value="docx">Word Document (DOCX)</SelectItem>
                    <SelectItem value="pdf">PDF Document</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Error Display */}
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* Processing Progress */}
            {processingProgress && (
              <Alert>
                <AlertDescription className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  {processingProgress}
                </AlertDescription>
              </Alert>
            )}

            {/* Text Input */}
            <div className="space-y-2">
              <Label htmlFor="document" className="text-base font-medium">Document Text</Label>
              <Textarea
                id="document"
                placeholder="Paste your document here for enhanced processing..."
                value={documentText}
                onChange={(e) => setDocumentText(e.target.value)}
                className="min-h-[200px]"
              />
            </div>

            {/* Context Input */}
            <div className="space-y-2">
              <Label htmlFor="context" className="text-base font-medium">Enhancement Context</Label>
              <Textarea
                id="context"
                placeholder="Describe the purpose, audience, and goals for enhancement..."
                value={context}
                onChange={(e) => setContext(e.target.value)}
                className="min-h-[100px]"
              />
            </div>

            {/* Action Button */}
            <Button
              onClick={handleEnhancedProcessing}
              disabled={!documentText.trim() || !context.trim() || isProcessing || !backendAvailable}
              className="w-full"
              variant="business"
              size="lg"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Processing with Format Preservation...
                </>
              ) : (
                <>
                  <Layers className="w-4 h-4 mr-2" />
                  Enhance with Format Preservation
                </>
              )}
            </Button>

            {/* Document Statistics */}
            {documentStats && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <BarChart3 className="w-5 h-5" />
                    Document Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-business-primary">{documentStats.totalBlocks}</div>
                      <div className="text-sm text-muted-foreground">Text Blocks</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-business-primary">{documentStats.wordCount}</div>
                      <div className="text-sm text-muted-foreground">Words</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-business-primary">{Math.round(documentStats.averageConfidence * 100)}%</div>
                      <div className="text-sm text-muted-foreground">Confidence</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-business-primary">{Math.round(documentStats.enhancementRatio * 100)}%</div>
                      <div className="text-sm text-muted-foreground">Enhanced</div>
                    </div>
                  </div>
                  
                  {documentStats.blockTypes && (
                    <div className="mt-4">
                      <Label className="text-sm font-medium">Block Types Detected:</Label>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {Object.entries(documentStats.blockTypes).map(([type, count]: [string, number]) => (
                          <Badge key={type} variant="secondary">
                            {type}: {count}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Results */}
            {enhancedDocument && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="text-base font-medium">Enhanced Document</Label>
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-muted-foreground">
                      Processed via: {processingMethod}
                    </span>
                    <div className="flex gap-2">
                      {reconstructedHTML && (
                        <Button
                          onClick={downloadHTMLResult}
                          variant="outline"
                          size="sm"
                        >
                          <Download className="w-4 h-4 mr-2" />
                          Download HTML
                        </Button>
                      )}
                      <Button
                        onClick={downloadTextResult}
                        variant="outline"
                        size="sm"
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Download Text
                      </Button>
                    </div>
                  </div>
                </div>
                
                {/* Enhanced Text */}
                <Textarea
                  value={enhancedDocument}
                  readOnly
                  className="min-h-[300px] bg-muted"
                />
                
                {/* Formatted HTML Preview */}
                {reconstructedHTML && outputFormat === 'html' && (
                  <div className="space-y-2">
                    <Label className="text-base font-medium">Formatted Preview (with Layout Preservation)</Label>
                    <div 
                      className="border rounded-lg p-4 bg-white max-h-[400px] overflow-auto"
                      dangerouslySetInnerHTML={{ __html: reconstructedHTML }}
                    />
                  </div>
                )}
                {/* No preview for DOCX/PDF, just download */}
                {(outputFormat === 'docx' || outputFormat === 'pdf') && (
                  <Alert>
                    <AlertDescription className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4" />
                      {`Document successfully generated as ${outputFormat.toUpperCase()}. Please use the download button.`}
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EnhancedDocumentProcessor;