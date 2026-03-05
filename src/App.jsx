import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, useNavigate, useSearchParams } from 'react-router-dom';
import { SiteContentProvider } from './context/SiteContentContext';
import useSecretSequence from './hooks/useSecretSequence';
import Navbar from './components/Navbar/Navbar';
import Hero from './components/Hero/Hero';
import Stats from './components/Stats/Stats';
import FocusAreas from './components/FocusAreas/FocusAreas';
import AudienceTabs from './components/AudienceTabs/AudienceTabs';
import Events from './components/Events/Events';
import Projects from './components/Projects/Projects';
import Blog from './components/Blog/Blog';
import JoinCTA from './components/JoinCTA/JoinCTA';
import Footer from './components/Footer/Footer';
import AdminApp from './admin/AdminApp';
import LoginGate from './admin/components/LoginGate/LoginGate';
import NotFound from './admin/components/NotFound/NotFound';
import { Analytics } from '@vercel/analytics/react';
import './App.css';

// Main landing page component
const LandingPage = () => {
  const navigate = useNavigate();
  
  // Secret Konami sequence: ↑ ↑ ↓ ↓ ← → ← → B A
  const secretActivated = useSecretSequence([
    'ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown',
    'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight',
    'KeyN', 'KeyJ', 'KeyR'
  ]);

  useEffect(() => {
    if (secretActivated) {
      // Redirect to admin with secret token
      const adminKey = import.meta.env.VITE_ADMIN_KEY || 'aiot_access_2025';
      navigate(`/admin?key=${adminKey}`);
    }
  }, [secretActivated, navigate]);

  return (
    <div className="app">
      <Navbar />
      <main>
        <Hero />
        <Stats />
        <FocusAreas />
        <AudienceTabs />
        <Events />
        <Projects />
        <Blog />
        <JoinCTA />
      </main>
      <Footer />
    </div>
  );
};

// Admin route with authentication
const AdminRoute = () => {
  const [searchParams] = useSearchParams();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  
  const adminKey = import.meta.env.VITE_ADMIN_KEY || 'aiot_access_2025';
  const urlKey = searchParams.get('key');

  useEffect(() => {
    // Check if already authenticated in session
    const sessionAuth = sessionStorage.getItem('aiot_admin_auth');
    if (sessionAuth === 'true') {
      setIsAuthenticated(true);
      return;
    }

    // Check URL key
    if (urlKey === adminKey) {
      setShowLogin(true);
    }
  }, [urlKey, adminKey]);

  const handleLogin = () => {
    sessionStorage.setItem('aiot_admin_auth', 'true');
    setIsAuthenticated(true);
    setShowLogin(false);
  };

  // No valid key - show 404
  if (!showLogin && !isAuthenticated) {
    return <NotFound />;
  }

  // Valid key but not logged in - show password gate
  if (showLogin && !isAuthenticated) {
    return <LoginGate onLogin={handleLogin} />;
  }

  // Authenticated - show admin panel
  return <AdminApp />;
};

// Main App with routing
const App = () => {
  return (
    <SiteContentProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/admin" element={<AdminRoute />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
      <Analytics />
    </SiteContentProvider>
  );
};

export default App;
