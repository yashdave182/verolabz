import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Twitter, Linkedin, Github, Mail, Instagram } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-accent/30 border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div className="col-span-1 md:col-span-2">
            <Link to="/" className="flex items-center space-x-2 mb-4">
              <div className="w-14 h-14 flex items-center justify-center">
                <img src="/favicon.ico" alt="Verolabz" className="w-10 h-10 object-contain" />
              </div>
              <span className="text-xl font-bold text-foreground">Verolabz</span>
            </Link>
            <p className="text-muted-foreground mb-4 max-w-md">
              AI-powered document enhancement for professionals, students, and freelancers. 
              Transform your documents with smart, context-aware refinements.
            </p>
            <div className="flex space-x-3">
              <Button variant="ghost" size="sm" className="w-9 h-9 p-0" asChild>
                <a href="https://x.com/kenil_lad?t=PApY929t9N6PyuAPiaiSjw&s=08" target="_blank" rel="noopener noreferrer">
                  <Twitter className="w-4 h-4" />
                </a>
              </Button>
              <Button variant="ghost" size="sm" className="w-9 h-9 p-0" asChild>
                <a href="https://www.linkedin.com" target="_blank" rel="noopener noreferrer">
                  <Linkedin className="w-4 h-4" />
                </a>
              </Button>
              <Button variant="ghost" size="sm" className="w-9 h-9 p-0" asChild>
                <a href="https://github.com" target="_blank" rel="noopener noreferrer">
                  <Github className="w-4 h-4" />
                </a>
              </Button>
              <Button variant="ghost" size="sm" className="w-9 h-9 p-0" asChild>
                <a href="https://www.instagram.com/verolabz?igsh=ejBkNHp4bXRvamFm" target="_blank" rel="noopener noreferrer">
                  <Instagram className="w-4 h-4" />
                </a>
              </Button>
              <Button variant="ghost" size="sm" className="w-9 h-9 p-0" asChild>
                <a href="mailto:support@verolabz.com">
                  <Mail className="w-4 h-4" />
                </a>
              </Button>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link 
                  to="/enhanced-doc-tweaker" 
                  className="text-muted-foreground hover:text-foreground transition-smooth"
                >
                  For Business
                </Link>
              </li>
              <li>
                <Link 
                  to="/enhanced-doc-tweaker" 
                  className="text-muted-foreground hover:text-foreground transition-smooth"
                >
                  For Students
                </Link>
              </li>
              <li>
                <Link 
                  to="/how-it-works" 
                  className="text-muted-foreground hover:text-foreground transition-smooth"
                >
                  How It Works
                </Link>
              </li>
              <li>
                <Link 
                  to="/contact" 
                  className="text-muted-foreground hover:text-foreground transition-smooth"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Legal</h3>
            <ul className="space-y-2">
              <li>
                <a 
                  href="#" 
                  className="text-muted-foreground hover:text-foreground transition-smooth"
                >
                  About
                </a>
              </li>
              <li>
                <a 
                  href="#" 
                  className="text-muted-foreground hover:text-foreground transition-smooth"
                >
                  Privacy Policy
                </a>
              </li>
              <li>
                <a 
                  href="#" 
                  className="text-muted-foreground hover:text-foreground transition-smooth"
                >
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-8 flex flex-col sm:flex-row justify-between items-center">
          <p className="text-sm text-muted-foreground">
            © 2024 Verolabz. All rights reserved.
          </p>
          <p className="text-sm text-muted-foreground mt-2 sm:mt-0">
            Made with ❤️ for better documents
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;