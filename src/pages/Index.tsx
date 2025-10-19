import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Wand2, 
  Clock, 
  Target, 
  CheckCircle, 
  Building2, 
  GraduationCap,
  ArrowRight,
  Users,
  FileText,
  Zap
} from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  const features = [
    {
      icon: Clock,
      title: "Save Time",
      description: "Get professional documents in seconds, not hours of editing."
    },
    {
      icon: Target,
      title: "Tailored to Audience",
      description: "AI understands your context and optimizes for your specific audience."
    },
    {
      icon: CheckCircle,
      title: "Professional Tone",
      description: "Transform casual writing into polished, professional communication."
    },
    {
      icon: Zap,
      title: "Polished & Error-Free",
      description: "Advanced grammar, style, and clarity improvements in every document."
    }
  ];

  const testimonials = [
    {
      quote: "DocTweak helped me land my dream job. My resume and cover letter were transformed!",
      author: "Sarah Chen",
      role: "Software Engineer"
    },
    {
      quote: "Our business proposals have a 90% higher success rate since using DocTweak.",
      author: "Michael Torres",
      role: "Business Development Manager"
    },
    {
      quote: "As a freelancer, DocTweak gives me the professional edge I need to win clients.",
      author: "Emma Rodriguez",
      role: "Freelance Designer"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center">
            <h1 className="text-5xl lg:text-7xl font-bold text-foreground mb-6">
              Tweak Your Documents with AI
              <span className="block text-transparent bg-clip-text gradient-hero">
                Smarter, Faster, Better
              </span>
            </h1>
            <p className="text-xl lg:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto">
              From business proposals to resumes, let AI polish your documents instantly. 
              Transform any document into a professional masterpiece.
            </p>
            <Button variant="hero" size="lg" className="font-semibold text-lg px-8 py-4 h-auto" asChild>
              <Link to="/business-backend">
                <Wand2 className="w-5 h-5 mr-2" />
                Get Started Free
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Dual Audience Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-4">Choose Your Path</h2>
          <p className="text-xl text-muted-foreground text-center mb-12 max-w-2xl mx-auto">
            Whether you're running a business or building your career, we have tools tailored for you.
          </p>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Business Card */}
            <Card className="hover-lift border-business-primary/20 shadow-business relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 gradient-business opacity-10 rounded-full -mr-16 -mt-16"></div>
              <CardHeader className="relative">
                <div className="w-12 h-12 gradient-business rounded-lg flex items-center justify-center mb-4">
                  <Building2 className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-2xl">For Businesses</CardTitle>
                <CardDescription className="text-base">
                  Professional document enhancement for teams and enterprises
                </CardDescription>
              </CardHeader>
              <CardContent className="relative space-y-4">
                <ul className="space-y-3">
                  <li className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-business-primary flex-shrink-0" />
                    <span>Business proposals & pitch decks</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-business-primary flex-shrink-0" />
                    <span>Contracts & legal documents</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-business-primary flex-shrink-0" />
                    <span>Reports & presentations</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-business-primary flex-shrink-0" />
                    <span>Team communications</span>
                  </li>
                </ul>
                <Button variant="business" className="w-full mt-6" asChild>
                  <Link to="/business-backend">
                    Try Backend Integration
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
                <Button variant="outline" className="w-full" asChild>
                  <Link to="/business">
                    Original Version
                  </Link>
                </Button>
              </CardContent>
            </Card>

            {/* Students Card */}
            <Card className="hover-lift border-student-primary/20 shadow-student relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 gradient-student opacity-10 rounded-full -mr-16 -mt-16"></div>
              <CardHeader className="relative">
                <div className="w-12 h-12 gradient-student rounded-lg flex items-center justify-center mb-4">
                  <GraduationCap className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-2xl">For Students & Freelancers</CardTitle>
                <CardDescription className="text-base">
                  Perfect your applications and proposals for career success
                </CardDescription>
              </CardHeader>
              <CardContent className="relative space-y-4">
                <ul className="space-y-3">
                  <li className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-student-primary flex-shrink-0" />
                    <span>Resume optimization</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-student-primary flex-shrink-0" />
                    <span>Cover letters & applications</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-student-primary flex-shrink-0" />
                    <span>Personal statements & essays</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-student-primary flex-shrink-0" />
                    <span>Freelance proposals</span>
                  </li>
                </ul>
                <Button variant="student" className="w-full mt-6" asChild>
                  <Link to="/students-backend">
                    Try Backend Integration
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
                <Button variant="outline" className="w-full" asChild>
                  <Link to="/students">
                    Original Version
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-accent/30">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-4">How It Works</h2>
          <p className="text-xl text-muted-foreground mb-12">
            Transform your documents in just 3 simple steps
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 gradient-hero rounded-full flex items-center justify-center mb-4">
                <FileText className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">1. Upload or Paste</h3>
              <p className="text-muted-foreground">
                Add your document and describe the context or audience
              </p>
            </div>
            
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 gradient-hero rounded-full flex items-center justify-center mb-4">
                <Wand2 className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">2. AI Enhancement</h3>
              <p className="text-muted-foreground">
                Our AI analyzes and enhances your document instantly
              </p>
            </div>
            
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 gradient-hero rounded-full flex items-center justify-center mb-4">
                <CheckCircle className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">3. Get Results</h3>
              <p className="text-muted-foreground">
                Download your polished, professional document
              </p>
            </div>
          </div>

          <div className="mt-12">
            <Button variant="outline" size="lg" asChild>
              <Link to="/how-it-works">
                Learn More About Our Process
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-4">Why Choose DocTweak?</h2>
          <p className="text-xl text-muted-foreground text-center mb-12 max-w-2xl mx-auto">
            Everything you need to create professional, impactful documents
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="hover-lift text-center">
                <CardContent className="p-6">
                  <div className="w-12 h-12 gradient-hero rounded-lg flex items-center justify-center mx-auto mb-4">
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground text-sm">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-accent/30">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12">What Our Users Say</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="hover-lift">
                <CardContent className="p-6">
                  <p className="text-muted-foreground mb-4 italic">
                    "{testimonial.quote}"
                  </p>
                  <div>
                    <p className="font-semibold">{testimonial.author}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Transform Your Documents?</h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join thousands of professionals who use DocTweak to create better documents faster.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="business" size="lg" asChild>
              <Link to="/business">
                <Building2 className="w-5 h-5 mr-2" />
                For Business
              </Link>
            </Button>
            <Button variant="student" size="lg" asChild>
              <Link to="/students">
                <GraduationCap className="w-5 h-5 mr-2" />
                For Students
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
