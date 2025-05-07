import { BrowserRouter as Router } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "@/components/theme/theme-provider";
import { AppRoutes } from "@/routes";
import { Navbar } from "@/components/layout/Navbar";
import { ScrollToTop } from '@/components/ScrollToTop';
import { Toaster } from './components/ui/toaster';
import { AuthProvider } from './hooks/useAuth';
import { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';

const queryClient = new QueryClient();

function App() {
  const [isInitializing, setIsInitializing] = useState(true);

  // Add a short delay before showing the app to ensure loading states are properly handled
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsInitializing(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  if (isInitializing) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <AuthProvider>
      <ThemeProvider defaultTheme="system" storageKey="med-theme">
        <QueryClientProvider client={queryClient}>
          <Router>
            <ScrollToTop />
            <div className="min-h-screen bg-background text-foreground">
              <Navbar />
              <AppRoutes />
            </div>
          </Router>
        </QueryClientProvider>
        <Toaster />
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
