import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/auth-context';
import LoginForm from '../components/auth/LoginForm';
import RegisterForm from '../components/auth/RegisterForm';
import ForgotPasswordForm from '../components/auth/ForgotPasswordForm';
import ResetPasswordForm from '../components/auth/ResetPasswordForm';
import MfaSetup from '../components/auth/MfaSetup';

const Auth = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [mode, setMode] = useState('login');
  const [resetToken, setResetToken] = useState(null); // <<< NOUVEL ÉTAT POUR LE TOKEN

  // Lire ?mode=xxx et ?token=xxx dans l'URL pour changer de formulaire
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const urlMode = params.get('mode');
    const urlToken = params.get('token'); // <<< RÉCUPÈRE LE TOKEN AUSSI

    if (urlMode && ['login', 'register', 'forgot', 'reset', 'mfa-setup'].includes(urlMode)) {
      setMode(urlMode);
    } else {
      setMode('login'); // Fallback si le mode n'est pas valide
    }

    if (urlToken && urlMode === 'reset') { // Ne stocke le token que si le mode est 'reset'
      setResetToken(urlToken);
    } else {
      setResetToken(null); // Réinitialise le token si le mode change
    }

  }, [location.search]);

  // Si l'utilisateur est déjà connecté → redirection vers /
  useEffect(() => {
    if (user) navigate('/');
  }, [user, navigate]);

  // Afficher le bon composant selon le mode
  const renderForm = () => {
    switch (mode) {
      case 'login':
        return <LoginForm />;
      case 'register':
        return <RegisterForm />;
      case 'forgot':
        return <ForgotPasswordForm />;
      case 'reset':
        // PASSE LE TOKEN AU COMPOSANT ResetPasswordForm
        return <ResetPasswordForm token={resetToken} />; // <<< CHANGEMENT CLÉ ICI
      case 'mfa-setup':
        return <MfaSetup />;
      default:
        return <LoginForm />;
    }
  };

  return <>{renderForm()}</>;
};

export default Auth; 