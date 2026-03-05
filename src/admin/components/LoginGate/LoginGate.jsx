import { useState, useEffect } from 'react';
import { auth } from '../../../firebase/firebaseConfig';
import { signInWithEmailAndPassword, onAuthStateChanged, signOut } from 'firebase/auth';
import './LoginGate.css';

const LoginGate = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [shake, setShake] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Check auth state on mount
  useEffect(() => {
    if (!auth) {
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setLoading(false);
      if (user) {
        // User is signed in, restore session
        sessionStorage.setItem('admin_auth', 'true');
        onLogin();
      }
    });

    // Also check sessionStorage for existing session
    const sessionAuth = sessionStorage.getItem('admin_auth');
    if (sessionAuth === 'true' && auth.currentUser) {
      onLogin();
    }

    return () => unsubscribe();
  }, [onLogin]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      sessionStorage.setItem('admin_auth', 'true');
      onLogin();
    } catch (err) {
      let errorMessage = 'Authentication failed';
      
      // Map Firebase error codes to user-friendly messages
      switch (err.code) {
        case 'auth/user-not-found':
          errorMessage = 'User not found';
          break;
        case 'auth/wrong-password':
          errorMessage = 'Incorrect password';
          break;
        case 'auth/invalid-email':
          errorMessage = 'Invalid email format';
          break;
        case 'auth/invalid-credential':
          errorMessage = 'Invalid credentials';
          break;
        case 'auth/too-many-requests':
          errorMessage = 'Too many attempts. Try again later';
          break;
        default:
          errorMessage = err.message || 'Authentication failed';
      }

      setError(errorMessage);
      setShake(true);
      setPassword('');
      
      // Remove shake after animation
      setTimeout(() => setShake(false), 500);
    } finally {
      setSubmitting(false);
    }
  };

  // Export logout function for use elsewhere
  LoginGate.logout = async () => {
    try {
      if (auth) {
        await signOut(auth);
      }
      sessionStorage.removeItem('admin_auth');
      window.location.href = '/';
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  if (loading) {
    return (
      <div className="login-gate">
        <div className="login-gate-content">
          <div className="login-gate-logo">
            <span className="logo-text">AIoT</span>
            <span className="logo-accent">Admin</span>
          </div>
          <p className="login-hint">Checking authentication...</p>
        </div>
        <div className="login-grid"></div>
        <div className="login-scanlines"></div>
      </div>
    );
  }

  return (
    <div className="login-gate">
      <div className="login-gate-content">
        <div className="login-gate-logo">
          <span className="logo-text">AIoT</span>
          <span className="logo-accent">Admin</span>
        </div>
        
        <form className={`login-form ${shake ? 'shake' : ''}`} onSubmit={handleSubmit}>
          <div className="login-input-wrapper">
            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError('');
              }}
              placeholder="Email address"
              className={`login-input ${error ? 'error' : ''}`}
              autoFocus
              disabled={submitting}
            />
            <div className="input-glow"></div>
          </div>

          <div className="login-input-wrapper">
            <input
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError('');
              }}
              placeholder="Password"
              className={`login-input ${error ? 'error' : ''}`}
              disabled={submitting}
            />
            <div className="input-glow"></div>
          </div>
          
          {error && (
            <p className="login-error">{error}</p>
          )}
          
          <button type="submit" className="login-btn" disabled={submitting}>
            {submitting ? 'Authenticating...' : 'Authenticate'}
          </button>
        </form>
        
        <p className="login-hint">
          Authorized personnel only
        </p>
      </div>
      
      <div className="login-grid"></div>
      <div className="login-scanlines"></div>
    </div>
  );
};

export default LoginGate;
