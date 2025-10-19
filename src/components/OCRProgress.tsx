import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { 
  FileText, 
  Eye, 
  Wand2, 
  Download, 
  CheckCircle,
  Loader2
} from "lucide-react";

interface DocumentProgressProps {
  progress: number;
  currentStep: string;
  isVisible: boolean;
}

const DocumentProgress = ({ progress, currentStep, isVisible }: DocumentProgressProps) => {
  if (!isVisible) return null;

  const steps = [
    { icon: FileText, label: "Extracting PDF", range: [0, 25] },
    { icon: Eye, label: "Parsing Content", range: [25, 50] },
    { icon: Wand2, label: "AI Enhancement", range: [50, 75] },
    { icon: Download, label: "Creating PDF", range: [75, 100] }
  ];

  const getCurrentStepIndex = () => {
    return steps.findIndex(step => 
      progress >= step.range[0] && progress <= step.range[1]
    );
  };

  const currentStepIndex = getCurrentStepIndex();

  return (
    <Card className="mt-4 border-blue-200 bg-blue-50">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
          Document Processing in Progress
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Main Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="font-medium">{currentStep}</span>
            <span className="text-blue-600">{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Step Indicators */}
        <div className="grid grid-cols-4 gap-2 mt-4">
          {steps.map((step, index) => {
            const isActive = index === currentStepIndex;
            const isComplete = progress > step.range[1];
            
            return (
              <div
                key={index}
                className={`flex flex-col items-center p-2 rounded-lg text-xs ${
                  isActive 
                    ? 'bg-blue-100 text-blue-700' 
                    : isComplete 
                    ? 'bg-green-100 text-green-700'
                    : 'bg-gray-100 text-gray-500'
                }`}
              >
                {isComplete ? (
                  <CheckCircle className="w-4 h-4 mb-1" />
                ) : (
                  <step.icon className={`w-4 h-4 mb-1 ${isActive ? 'animate-pulse' : ''}`} />
                )}
                <span className="text-center leading-tight">{step.label}</span>
              </div>
            );
          })}
        </div>

        {/* Processing Tips */}
        <div className="mt-4 p-3 bg-blue-100 rounded-lg">
          <p className="text-sm text-blue-800">
            <strong>Processing your document:</strong> We're extracting text from your document, 
            then enhancing it with AI. This may take a few moments depending on document size.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default DocumentProgress;