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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Upload,
  Download,
  Trash2,
  FileSignature,
  Sparkles,
  CheckCircle2,
  Loader2,
  X,
  Zap,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/lib/AuthContext";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";

// Backend URL
const BACKEND_URL = "https://omgy-vero-ps.hf.space";

const ERROR_MESSAGES = {
  processing_failed: "We're having trouble processing your document. Please try again.",
  file_invalid: "Please upload a valid DOCX file.",
  signature_required: "Please create a signature before proceeding.",
  network_error: "Network connection issue. Please check your internet and try again.",
};

const SignDocument = () => {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [uploadedFileName, setUploadedFileName] = useState("");
  const [signerName, setSignerName] = useState("");
  const [signaturePosition, setSignaturePosition] = useState("bottom-right");
  const [isDrawing, setIsDrawing] = useState(false);
  const [signatureData, setSignatureData] = useState<string | null>(null);
  const [isSigning, setIsSigning] = useState(false);
  const [signedDocument, setSignedDocument] = useState<Blob | null>(null);
  const [error, setError] = useState("");

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { toast } = useToast();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  // Initialize canvas
  const initCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas size
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * 2; // High DPI
    canvas.height = rect.height * 2;
    ctx.scale(2, 2);

    // Set drawing style
    ctx.strokeStyle = "#0066ff";
    ctx.lineWidth = 2;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
  };

  // Start drawing
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    setIsDrawing(true);

    const rect = canvas.getBoundingClientRect();
    const x = "touches" in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = "touches" in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;

    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  // Draw
  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = "touches" in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = "touches" in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  // Stop drawing
  const stopDrawing = () => {
    if (isDrawing) {
      const canvas = canvasRef.current;
      if (canvas) {
        setSignatureData(canvas.toDataURL("image/png"));
      }
    }
    setIsDrawing(false);
  };

  // Clear signature
  const clearSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setSignatureData(null);
  };

  // Handle file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.toLowerCase().endsWith(".docx")) {
      setError(ERROR_MESSAGES.file_invalid);
      toast({
        title: "Invalid File",
        description: ERROR_MESSAGES.file_invalid,
        variant: "destructive",
      });
      return;
    }

    setUploadedFile(file);
    setUploadedFileName(file.name);
    setError("");
    setSignedDocument(null);
  };

  // Clear uploaded file
  const clearFile = () => {
    setUploadedFile(null);
    setUploadedFileName("");
    setSignedDocument(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Sign document
  const handleSignDocument = async () => {
    if (!isAuthenticated) {
      navigate(`/auth?next=${encodeURIComponent("/sign-document")}`);
      return;
    }

    if (!uploadedFile) {
      setError("Please upload a document first.");
      return;
    }

    if (!signatureData) {
      setError(ERROR_MESSAGES.signature_required);
      toast({
        title: "Signature Required",
        description: ERROR_MESSAGES.signature_required,
        variant: "destructive",
      });
      return;
    }

    setIsSigning(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("file", uploadedFile);
      formData.append("signature", signatureData);
      formData.append("position", signaturePosition);
      if (signerName.trim()) {
        formData.append("signer_name", signerName.trim());
      }

      const response = await fetch(`${BACKEND_URL}/add-signature`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("processing_failed");
      }

      const blob = await response.blob();
      setSignedDocument(blob);

      toast({
        title: "Document Signed!",
        description: "Your signature has been added successfully.",
      });
    } catch (err) {
      setError(ERROR_MESSAGES.processing_failed);
      toast({
        title: "Signing Failed",
        description: ERROR_MESSAGES.processing_failed,
        variant: "destructive",
      });
    } finally {
      setIsSigning(false);
    }
  };

  // Download signed document
  const downloadSignedDocument = () => {
    if (!signedDocument) return;

    try {
      const url = URL.createObjectURL(signedDocument);
      const a = document.createElement("a");
      a.href = url;

      const baseFileName = uploadedFileName?.replace(/\.[^/.]+$/, "") || "document";
      a.download = `Signed_${baseFileName}.docx`;

      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast({
        title: "Downloaded",
        description: "Signed document has been downloaded.",
      });
    } catch (error) {
      toast({
        title: "Download Error",
        description: "We couldn't download your file. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Reset all
  const resetAll = () => {
    clearFile();
    clearSignature();
    setSignerName("");
    setSignaturePosition("bottom-right");
    setError("");
  };

  // Initialize canvas on mount
  useState(() => {
    setTimeout(initCanvas, 100);
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 relative overflow-hidden">
      {/* Animated background effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-cyan-500/5 rounded-full blur-3xl animate-pulse delay-500" />
      </div>

      {/* Content */}
      <div className="relative z-10">
        {/* Hero Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-500/20 text-blue-300 text-sm font-medium mb-6 backdrop-blur-sm border border-blue-500/30">
              <Sparkles className="w-4 h-4 mr-2" />
              Digital Signature
            </div>
            <h1 className="text-4xl lg:text-6xl font-bold text-white mb-6">
              Sign Documents
              <span className="block bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                Digitally
              </span>
            </h1>
            <p className="text-xl text-blue-200/80 mb-8 max-w-2xl mx-auto">
              Add your digital signature to documents with our futuristic signing tool.
              Secure, fast, and legally binding.
            </p>
          </div>
        </section>

        {/* Main Content */}
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left Column - File Upload & Settings */}
              <div className="space-y-6">
                {/* File Upload Card */}
                <Card className="bg-slate-900/50 border-blue-500/30 backdrop-blur-xl shadow-2xl shadow-blue-500/10">
                  <CardHeader>
                    <CardTitle className="text-2xl text-white flex items-center gap-2">
                      <FileSignature className="w-6 h-6 text-blue-400" />
                      Upload Document
                    </CardTitle>
                    <CardDescription className="text-blue-200/60">
                      Upload the DOCX file you want to sign
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => fileInputRef.current?.click()}
                        className="w-full h-32 border-2 border-dashed border-blue-500/50 hover:border-blue-400 bg-blue-500/5 hover:bg-blue-500/10 text-blue-300 transition-all duration-300"
                      >
                        <div className="flex flex-col items-center gap-2">
                          <Upload className="w-8 h-8" />
                          <span className="text-sm font-medium">
                            {uploadedFileName || "Click to upload DOCX file"}
                          </span>
                        </div>
                      </Button>

                      <input
                        ref={fileInputRef}
                        type="file"
                        accept=".docx"
                        onChange={handleFileUpload}
                        className="hidden"
                      />

                      {uploadedFileName && (
                        <div className="flex items-center justify-between p-3 bg-blue-500/10 rounded-lg border border-blue-500/30">
                          <div className="flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-green-400" />
                            <span className="text-sm text-blue-200 truncate">
                              {uploadedFileName}
                            </span>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={clearFile}
                            className="h-auto p-1 text-red-400 hover:text-red-300"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Signature Settings Card */}
                <Card className="bg-slate-900/50 border-purple-500/30 backdrop-blur-xl shadow-2xl shadow-purple-500/10">
                  <CardHeader>
                    <CardTitle className="text-xl text-white flex items-center gap-2">
                      <Zap className="w-5 h-5 text-purple-400" />
                      Signature Settings
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="signerName" className="text-blue-200">
                        Your Name (Optional)
                      </Label>
                      <Input
                        id="signerName"
                        type="text"
                        placeholder="Enter your name"
                        value={signerName}
                        onChange={(e) => setSignerName(e.target.value)}
                        className="bg-slate-800/50 border-blue-500/30 text-white placeholder:text-blue-200/40 focus:border-blue-400"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="position" className="text-blue-200">
                        Signature Position
                      </Label>
                      <Select value={signaturePosition} onValueChange={setSignaturePosition}>
                        <SelectTrigger className="bg-slate-800/50 border-blue-500/30 text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-900 border-blue-500/30">
                          <SelectItem value="bottom-right">Bottom Right</SelectItem>
                          <SelectItem value="bottom-center">Bottom Center</SelectItem>
                          <SelectItem value="bottom-left">Bottom Left</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>

                {/* Action Buttons */}
                {signedDocument && (
                  <Card className="bg-gradient-to-r from-green-900/30 to-emerald-900/30 border-green-500/30 backdrop-blur-xl">
                    <CardContent className="pt-6">
                      <div className="space-y-3">
                        <div className="flex items-center gap-2 text-green-300 mb-4">
                          <CheckCircle2 className="w-5 h-5" />
                          <span className="font-medium">Document signed successfully!</span>
                        </div>
                        <Button
                          onClick={downloadSignedDocument}
                          className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white shadow-lg shadow-green-500/20"
                        >
                          <Download className="w-4 h-4 mr-2" />
                          Download Signed Document
                        </Button>
                        <Button
                          onClick={resetAll}
                          variant="outline"
                          className="w-full border-green-500/30 text-green-300 hover:bg-green-500/10"
                        >
                          Sign Another Document
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>

              {/* Right Column - Signature Pad */}
              <div className="space-y-6">
                <Card className="bg-slate-900/50 border-cyan-500/30 backdrop-blur-xl shadow-2xl shadow-cyan-500/10">
                  <CardHeader>
                    <CardTitle className="text-2xl text-white flex items-center gap-2">
                      <Sparkles className="w-6 h-6 text-cyan-400" />
                      Create Your Signature
                    </CardTitle>
                    <CardDescription className="text-cyan-200/60">
                      Draw your signature below using your mouse or touch
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Signature Canvas */}
                    <div className="relative">
                      <canvas
                        ref={canvasRef}
                        onMouseDown={startDrawing}
                        onMouseMove={draw}
                        onMouseUp={stopDrawing}
                        onMouseLeave={stopDrawing}
                        onTouchStart={startDrawing}
                        onTouchMove={draw}
                        onTouchEnd={stopDrawing}
                        className="w-full h-64 bg-white/95 rounded-lg border-2 border-cyan-500/50 cursor-crosshair shadow-inner touch-none"
                        style={{ touchAction: "none" }}
                      />
                      {!signatureData && (
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                          <p className="text-slate-400 text-sm">Sign here</p>
                        </div>
                      )}
                    </div>

                    {/* Canvas Controls */}
                    <div className="flex gap-3">
                      <Button
                        onClick={clearSignature}
                        variant="outline"
                        className="flex-1 border-red-500/30 text-red-300 hover:bg-red-500/10"
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Clear
                      </Button>
                      <Button
                        onClick={handleSignDocument}
                        disabled={!uploadedFile || !signatureData || isSigning}
                        className="flex-1 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white shadow-lg shadow-blue-500/20 disabled:opacity-50"
                      >
                        {isSigning ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Signing...
                          </>
                        ) : (
                          <>
                            <FileSignature className="w-4 h-4 mr-2" />
                            Sign Document
                          </>
                        )}
                      </Button>
                    </div>

                    {error && (
                      <Alert variant="destructive" className="bg-red-900/20 border-red-500/30">
                        <AlertDescription className="text-red-300">
                          {error}
                        </AlertDescription>
                      </Alert>
                    )}
                  </CardContent>
                </Card>

                {/* Info Card */}
                <Card className="bg-gradient-to-br from-slate-900/50 to-blue-900/30 border-blue-500/20 backdrop-blur-xl">
                  <CardContent className="pt-6">
                    <div className="space-y-3 text-sm text-blue-200/80">
                      <div className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
                        <span>Your signature is added to the document securely</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
                        <span>Original document formatting is preserved</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
                        <span>Download your signed document instantly</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default SignDocument;
