import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navigation from "./components/Navigation";
import Footer from "./components/Footer";
import Index from "./pages/Index";
import DocTweaker from "./pages/DocTweaker";
import EnhancedDocTweaker from "./pages/EnhancedDocTweaker";
import Community from "./pages/Community";
import HowItWorks from "./pages/HowItWorks";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";
import { AuthProvider, ProtectedRoute } from "./lib/AuthContext";
import Auth from "./pages/Auth";
import AuthComplete from "./pages/AuthComplete";

const queryClient = new QueryClient();

const App = () => {
  // Add error boundary to catch rendering errors
  try {
    return (
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <div className="min-h-screen flex flex-col">
                <Navigation />
                <main className="flex-1">
                  <Routes>
                    <Route path="/" element={<Index />} />
                    <Route
                      path="/doc-tweaker"
                      element={
                        <ProtectedRoute>
                          <DocTweaker />
                        </ProtectedRoute>
                      }
                    />

                    <Route
                      path="/enhanced-doc-tweaker"
                      element={
                        <ProtectedRoute>
                          <EnhancedDocTweaker />
                        </ProtectedRoute>
                      }
                    />

                    <Route path="/auth" element={<Auth />} />
                    <Route path="/auth/complete" element={<AuthComplete />} />
                    <Route path="/community" element={<Community />} />

                    <Route path="/how-it-works" element={<HowItWorks />} />
                    <Route path="/contact" element={<Contact />} />
                    {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </main>
                <Footer />
              </div>
            </BrowserRouter>
          </TooltipProvider>
        </AuthProvider>
      </QueryClientProvider>
    );
  } catch (error) {
    console.error("App rendering error:", error);
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-500">Application Error</h1>
          <p className="text-gray-600">Please check the console for details.</p>
        </div>
      </div>
    );
  }
};

export default App;
