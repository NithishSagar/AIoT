import { createContext, useContext, useState, useEffect, useCallback } from 'react';

const AdminContext = createContext(null);

export const AdminProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentSection, setCurrentSection] = useState('hero');
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [showPreview, setShowPreview] = useState(true);

  // Check sessionStorage on mount
  useEffect(() => {
    const authFlag = sessionStorage.getItem('admin_auth');
    if (authFlag === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  // Warn before leaving with unsaved changes
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = 'You have unsaved changes. Are you sure you want to leave?';
        return e.returnValue;
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [hasUnsavedChanges]);

  const login = useCallback((password) => {
    const expectedPassword = import.meta.env.VITE_ADMIN_PASSWORD || 'admin123';
    if (password === expectedPassword) {
      setIsAuthenticated(true);
      sessionStorage.setItem('admin_auth', 'true');
      // Strip the ?key= param from URL
      window.history.replaceState({}, '', '/admin');
      return true;
    }
    return false;
  }, []);

  const logout = useCallback(() => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('admin_auth');
    setHasUnsavedChanges(false);
    window.location.href = '/';
  }, []);

  return (
    <AdminContext.Provider
      value={{
        isAuthenticated,
        login,
        logout,
        currentSection,
        setCurrentSection,
        hasUnsavedChanges,
        setHasUnsavedChanges,
        showPreview,
        setShowPreview
      }}
    >
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
};

export default AdminContext;
