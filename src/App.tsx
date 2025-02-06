import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Loading } from '@/components/ui/loading';
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
import { AccountSettingsPage } from './pages/account/AccountSettingsPage';
import { SecurityPage } from './pages/account/SecurityPage';
import { SubscriptionPage } from './pages/account/SubscriptionPage';
import { AdsPage } from './pages/account/AdsPage';

function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(() => {
      setIsLoading(false);
    });
  }, []);

  if (isLoading) {
    return (
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <Loading 
          fullScreen 
          message="Initialisation de l'application..." 
        />
      </ThemeProvider>
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

            {/* Routes du compte */}
            <Route path="/account/settings" element={
              <ProtectedRoute>
                <AccountSettingsPage />
              </ProtectedRoute>
            } />
            <Route path="/account/security" element={
              <ProtectedRoute>
                <SecurityPage />
              </ProtectedRoute>
            } />
            <Route path="/account/subscription" element={
              <ProtectedRoute>
                <SubscriptionPage />
              </ProtectedRoute>
            } />
            <Route path="/account/ads" element={
              <ProtectedRoute>
                <AdsPage />
              </ProtectedRoute>
            } />
            
            {/* Redirect /profile to /account/settings */}
            <Route path="/profile" element={
              <ProtectedRoute>
                <Navigate to="/account/settings" replace />
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
