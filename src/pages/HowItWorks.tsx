import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, MessageSquare, Wand2, Download, ArrowRight, CheckCircle, X } from "lucide-react";
import { Link } from "react-router-dom";

const HowItWorks = () => {
  const steps = [
    {
      icon: Upload,
      title: "Upload or Paste",
      description: "Simply paste your document text or upload your file. We support all major document formats.",
      details: ["Text documents", "PDFs", "Word files", "Copy & paste"]
    },
    {
      icon: MessageSquare,
      title: "Add Context",
      description: "Tell us about your audience and purpose. The more specific, the better the results.",
      details: ["Target audience", "Document purpose", "Industry context", "Tone preferences"]
    },
    {
      icon: Wand2,
      title: "AI Enhancement",
      description: "Our AI analyzes your document and context to create a polished, professional version.",
      details: ["Grammar & style", "Tone optimization", "Structure improvement", "Content enhancement"]
    },
    {
      icon: Download,
      title: "Download & Use",
      description: "Get your enhanced document instantly. Copy, download, or continue editing as needed.",
      details: ["Multiple formats", "Instant results", "Easy sharing", "Version history"]
    }
  ];

  const benefits = [
    "Save hours of editing time",
    "Professional tone and style",
    "Tailored to your specific audience",
    "Grammar and clarity improvements",
    "Enhanced persuasive language",
    "Consistent formatting"
  ];

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl lg:text-6xl font-bold text-foreground mb-6">
            How <span className="text-primary">DocTweak</span> Works
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Transform any document in just 4 simple steps. Our AI-powered enhancement 
            makes your documents professional, polished, and perfectly tailored to your audience.
          </p>
        </div>
      </section>

      {/* Steps Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            {steps.map((step, index) => (
              <div key={index} className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 gradient-hero rounded-lg flex items-center justify-center">
                    <step.icon className="w-6 h-6 text-white" />
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="text-sm font-semibold text-primary">
                      Step {index + 1}
                    </span>
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    {step.title}
                  </h3>
                  <p className="text-muted-foreground mb-3">
                    {step.description}
                  </p>
                  <ul className="space-y-1">
                    {step.details.map((detail, detailIndex) => (
                      <li key={detailIndex} className="flex items-center space-x-2 text-sm text-muted-foreground">
                        <CheckCircle className="w-3 h-3 text-success" />
                        <span>{detail}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                {index < steps.length - 1 && (
                  <div className="hidden lg:block">
                    <ArrowRight className="w-6 h-6 text-muted-foreground" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Visualization */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-accent/30">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">See the Transformation</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="border-destructive/20">
              <CardHeader>
                <CardTitle className="text-destructive">Before DocTweak</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-destructive/5 p-4 rounded-lg text-sm">
                  <p className="font-mono text-muted-foreground">
                    "Hey, I want to apply for the marketing position at your company. 
                    I think I'd be good at it because I like marketing and I have some experience. 
                    Please consider me for the job. Thanks."
                  </p>
                </div>
                <ul className="mt-4 space-y-2 text-sm">
                  <li className="flex items-center space-x-2 text-destructive">
                    <X className="w-3 h-3" />
                    <span>Informal tone</span>
                  </li>
                  <li className="flex items-center space-x-2 text-destructive">
                    <X className="w-3 h-3" />
                    <span>Vague qualifications</span>
                  </li>
                  <li className="flex items-center space-x-2 text-destructive">
                    <X className="w-3 h-3" />
                    <span>No specific value proposition</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-success/20">
              <CardHeader>
                <CardTitle className="text-success">After DocTweak</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-success/5 p-4 rounded-lg text-sm">
                  <p className="font-mono text-muted-foreground">
                    "I am writing to express my strong interest in the Marketing Specialist position 
                    at [Company Name]. With my proven track record in digital marketing and passion 
                    for creating compelling brand narratives, I am confident I can drive significant 
                    growth for your marketing initiatives..."
                  </p>
                </div>
                <ul className="mt-4 space-y-2 text-sm">
                  <li className="flex items-center space-x-2 text-success">
                    <CheckCircle className="w-3 h-3" />
                    <span>Professional tone</span>
                  </li>
                  <li className="flex items-center space-x-2 text-success">
                    <CheckCircle className="w-3 h-3" />
                    <span>Specific qualifications</span>
                  </li>
                  <li className="flex items-center space-x-2 text-success">
                    <CheckCircle className="w-3 h-3" />
                    <span>Clear value proposition</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose Verolabz?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-center space-x-3">
                <CheckCircle className="w-5 h-5 text-success flex-shrink-0" />
                <span className="text-foreground font-medium">{benefit}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Transform Your Documents?</h2>
          <p className="text-muted-foreground mb-8">
            Join thousands of professionals who trust Verolabz to enhance their documents.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="hero" size="lg" asChild>
              <Link to="/business">Try for Business</Link>
            </Button>
            <Button variant="student" size="lg" asChild>
              <Link to="/students">Try for Students</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HowItWorks;