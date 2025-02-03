import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { Toaster } from "@/components/ui/toaster";
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/client';
import { ModalProvider } from '@/components/providers/ModalProvider';
import Index from './pages/Index';
import Auth from './pages/Auth';
import Admin from './pages/Admin';
import { AdminRoute } from './components/auth/AdminRoute';
import { AuthCallbackPage } from './pages/AuthCallbackPage';
import { ProtectedRoute } from './components/auth/ProtectedRoute';

function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(() => {
      setIsLoading(false);
    });
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <Router>
        <ModalProvider>
          <Routes>
            {/* Routes publiques */}
            <Route path="/auth" element={<Auth />} />
            <Route path="/auth/callback" element={<AuthCallbackPage />} />
            
            {/* Routes protégées */}
            <Route path="/" element={
              <ProtectedRoute>
                <Index />
              </ProtectedRoute>
            } />
            
            {/* Routes admin */}
            <Route path="/admin" element={
              <AdminRoute>
                <Admin />
              </AdminRoute>
            } />
          </Routes>
          <Toaster />
        </ModalProvider>
      </Router>
    </ThemeProvider>
  );
}

export default App;