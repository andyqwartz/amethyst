import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { Toaster } from "@/components/ui/toaster";
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/client';
import { ModalProvider } from '@/components/providers/ModalProvider';
import Index from './pages/Index';
import Auth from './pages/Auth';
import Admin from './pages/Admin';

function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(() => {
      setIsLoading(false);
    });
  }, []);

  if (isLoading) {
    return <div>Chargement...</div>;
  }

  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <Router>
        <ModalProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/admin" element={<Admin />} />
          </Routes>
          <Toaster />
        </ModalProvider>
      </Router>
    </ThemeProvider>
  );
}

export default App;