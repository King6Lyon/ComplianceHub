import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const OAuthSuccess = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');

    if (token) {
      localStorage.setItem('token', token);
      // Redirige vers dashboard ou home
      navigate('/dashboard');
    } else {
      navigate('/login');
    }
  }, [navigate]);

  return <p>Connexion en cours...</p>;
};

export default OAuthSuccess;
