import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { auth } from '../../firebase/firebaseConfig';
import { signOut } from 'firebase/auth';

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

  const login = useCallback(() => {
    setIsAuthenticated(true);
    sessionStorage.setItem('admin_auth', 'true');
    // Strip the ?key= param from URL
    window.history.replaceState({}, '', '/admin');
    return true;
  }, []);

  const logout = useCallback(async () => {
    try {
      await signOut(auth);
    } catch (err) {
      console.error('Firebase signOut error:', err);
    }
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
