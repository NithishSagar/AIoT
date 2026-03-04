import { useState } from 'react';
import './LoginGate.css';

const LoginGate = ({ onLogin }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const [shake, setShake] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    const expectedPassword = import.meta.env.VITE_ADMIN_PASSWORD || 'admin123';
    
    if (password === expectedPassword) {
      onLogin();
    } else {
      setError(true);
      setShake(true);
      setPassword('');
      
      // Remove shake after animation
      setTimeout(() => setShake(false), 500);
    }
  };

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
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError(false);
              }}
              placeholder="Enter access code"
              className={`login-input ${error ? 'error' : ''}`}
              autoFocus
            />
            <div className="input-glow"></div>
          </div>
          
          {error && (
            <p className="login-error">Access Denied</p>
          )}
          
          <button type="submit" className="login-btn">
            Authenticate
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
