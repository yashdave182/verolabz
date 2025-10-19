import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Users, 
  MessageCircle, 
  Lightbulb, 
  Rocket, 
  ExternalLink,
  Slack,
  UserPlus,
  Calendar,
  Trophy,
  Coffee
} from "lucide-react";

const Community = () => {
  const handleJoinSlack = () => {
    // Replace this with your actual Slack community URL
    window.open("https://join.slack.com/t/your-slack-community/shared_invite/xxxxxxxx", "_blank");
  };

  const communityBenefits = [
    {
      icon: Users,
      title: "Connect with Peers",
      description: "Network with other document creators, professionals, and enthusiasts."
    },
    {
      icon: MessageCircle,
      title: "Real-time Support",
      description: "Get instant help from our community members and support team."
    },
    {
      icon: Lightbulb,
      title: "Share Ideas",
      description: "Exchange tips, tricks, and innovative ways to use DocTweak."
    },
    {
      icon: Trophy,
      title: "Exclusive Resources",
      description: "Access member-only templates, guides, and early feature previews."
    }
  ];

  const communityGuidelines = [
    "Be respectful and inclusive to all members",
    "Share knowledge and help others when possible",
    "Keep discussions relevant to document creation and DocTweak",
    "No self-promotion or spamming",
    "Report any inappropriate behavior to moderators"
  ];

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
            <Users className="w-4 h-4 mr-2" />
            Join Our Community
          </div>
          <h1 className="text-4xl lg:text-6xl font-bold text-foreground mb-6">
            DocTweak
            <span className="block text-primary">Community</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Connect with fellow document creators, get expert advice, and be part of a growing community 
            passionate about perfecting documents with AI.
          </p>
          <Button 
            onClick={handleJoinSlack}
            size="lg" 
            className="font-semibold group"
          >
            <Slack className="w-5 h-5 mr-2" />
            Join Our Slack Community
            <ExternalLink className="w-4 h-4 ml-2 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
          </Button>
        </div>
      </section>

      {/* Community Benefits */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-background">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Why Join Our Community?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {communityBenefits.map((benefit, index) => (
              <Card key={index} className="hover-lift border-primary/20">
                <CardHeader className="text-center">
                  <div className="w-12 h-12 gradient-primary rounded-lg flex items-center justify-center mx-auto mb-4">
                    <benefit.icon className="w-6 h-6 text-white" />
                  </div>
                  <CardTitle className="text-lg">{benefit.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-center">
                    {benefit.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Community Features */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Community Features</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Our Slack community offers exclusive channels and resources to help you get the most out of DocTweak
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MessageCircle className="w-5 h-5 mr-2 text-primary" />
                  Discussion Channels
                </CardTitle>
                <CardDescription>
                  Specialized channels for different document types and use cases
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start">
                  <div className="bg-primary/10 p-2 rounded-md mr-3">
                    <Coffee className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-medium">General Discussion</h4>
                    <p className="text-sm text-muted-foreground">For all your DocTweak questions and conversations</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="bg-primary/10 p-2 rounded-md mr-3">
                    <Rocket className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-medium">Feature Requests</h4>
                    <p className="text-sm text-muted-foreground">Suggest new features and vote on upcoming ones</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="bg-primary/10 p-2 rounded-md mr-3">
                    <Lightbulb className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-medium">Tips & Tricks</h4>
                    <p className="text-sm text-muted-foreground">Share and discover efficient ways to use DocTweak</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <UserPlus className="w-5 h-5 mr-2 text-primary" />
                  Exclusive Perks
                </CardTitle>
                <CardDescription>
                  Special benefits available only to community members
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start">
                  <div className="bg-primary/10 p-2 rounded-md mr-3">
                    <Calendar className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-medium">Community Events</h4>
                    <p className="text-sm text-muted-foreground">Webinars, workshops, and Q&A sessions with experts</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="bg-primary/10 p-2 rounded-md mr-3">
                    <Trophy className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-medium">Early Access</h4>
                    <p className="text-sm text-muted-foreground">Try new features before they're publicly released</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="bg-primary/10 p-2 rounded-md mr-3">
                    <Rocket className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-medium">Member Spotlights</h4>
                    <p className="text-sm text-muted-foreground">Showcase your work and get featured in our community</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Community Guidelines */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-background">
        <div className="max-w-4xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="w-5 h-5 mr-2 text-primary" />
                Community Guidelines
              </CardTitle>
              <CardDescription>
                Help us maintain a welcoming and productive environment for everyone
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {communityGuidelines.map((guideline, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-primary font-bold mr-2">•</span>
                    <span className="text-muted-foreground">{guideline}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Join Our Community?</h2>
          <p className="text-muted-foreground mb-8">
            Connect with like-minded document creators and get the most out of DocTweak
          </p>
          <Button 
            onClick={handleJoinSlack}
            size="lg" 
            className="font-semibold group"
          >
            <Slack className="w-5 h-5 mr-2" />
            Join Our Slack Community Now
            <ExternalLink className="w-4 h-4 ml-2 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
          </Button>
          <p className="text-sm text-muted-foreground mt-4">
            Already a member? <a href="#" className="text-primary hover:underline">Sign in to Slack</a>
          </p>
        </div>
      </section>
    </div>
  );
};

export default Community;