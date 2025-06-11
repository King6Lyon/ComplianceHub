import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/auth-context';
import RegisterForm from '../components/auth/RegisterForm';
import ForgotPasswordForm from '../components/auth/ForgotPasswordForm';
import ResetPasswordForm from '../components/auth/ResetPasswordForm';
import MfaSetup from '../components/auth/MfaSetup';
import  Alert  from '../components/common/Alert';
import './Auth.css';

const Auth = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { login, user } = useAuth();
  const [mode, setMode] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mfaCode, setMfaCode] = useState('');
  const [mfaRequired, setMfaRequired] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Parse query parameters
  React.useEffect(() => {
    const params = new URLSearchParams(location.search);
    const urlMode = params.get('mode');
    if (urlMode && ['login', 'register', 'forgot', 'reset', 'mfa-setup'].includes(urlMode)) {
      setMode(urlMode);
    }
  }, [location.search]);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError('');
      const result = await login(email, password, mfaCode);
      if (!result.success) {
        if (result.error === 'MFA required') {
          setMfaRequired(true);
        } else {
          setError(result.error);
        }
      }
    } catch (err) {
      console.error('Erreur:', err.message);
      setError('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (user) {
    navigate('/');
    return null;
  }

  if (mode === 'reset') {
    return <ResetPasswordForm />;
  }

  if (mode === 'mfa-setup') {
    return <MfaSetup />;
  }

  return (
    <div className="auth-page">
      <div className="auth-container">
        <h1>ComplianceHub</h1>
        
        {error && <Alert type="error" message={error} />}
        
        {mode === 'login' && (
          <form onSubmit={handleLogin} className="login-form">
            <h2>Login</h2>
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            {mfaRequired && (
              <div className="form-group">
                <label>MFA Code</label>
                <input
                  type="text"
                  value={mfaCode}
                  onChange={(e) => setMfaCode(e.target.value)}
                  placeholder="Enter 6-digit code"
                  required
                />
              </div>
            )}
            <button type="submit" disabled={loading}>
              {loading ? 'Logging in...' : 'Login'}
            </button>
            <div className="auth-links">
              <button type="button" onClick={() => setMode('forgot')}>
                Forgot Password?
              </button>
              <button type="button" onClick={() => setMode('register')}>
                Create Account
              </button>
            </div>
          </form>
        )}
        
        {mode === 'register' && <RegisterForm />}
        
        {mode === 'forgot' && <ForgotPasswordForm />}
      </div>
    </div>
  );
};

export default Auth;