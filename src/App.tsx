import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import LandingPage from './components/LandingPage';
import Dashboard from './components/Dashboard';
import PublisherProducts from './components/PublisherProducts';
import SharedView from './components/SharedView';
import Login from './components/Login';
import ProtectedRoute from './components/ProtectedRoute';
import { supabase } from './lib/supabase';

function App() {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Obtener la sesión actual
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    // Escuchar cambios en la autenticación
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50">
        <div className="w-12 h-12 border-3 border-neutral-200 border-t-black rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        {/* Rutas públicas */}
        <Route path="/" element={<LandingPage />} />
        <Route 
          path="/login" 
          element={session ? <Navigate to="/dashboard" replace /> : <Login />} 
        />
        <Route path="/shared/:token" element={<SharedView />} />

        {/* Rutas protegidas */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/published"
          element={
            <ProtectedRoute>
              <PublisherProducts />
            </ProtectedRoute>
          }
        />

        {/* Redirección por defecto */}
        <Route 
          path="*" 
          element={session ? <Navigate to="/dashboard" replace /> : <LandingPage />} 
        />
      </Routes>
    </Router>
  );
}

export default App;