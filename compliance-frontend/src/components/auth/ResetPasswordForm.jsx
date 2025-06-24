// src/components/auth/ResetPasswordForm.jsx (AVEC CONSOLE.LOG POUR DÉBOGAGE)

import React, { useState, useEffect } from 'react';
import {  useNavigate } from 'react-router-dom';
import { resetPassword } from '../../api/auth';
import Alert from '../common/Alert';

const ResetPasswordForm = ({ token: propToken }) => { // <<< Réception du token via les props
  // const { token } = useParams(); // Ancien code, à ne plus utiliser si le token vient des props
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  // Vérifier si le token est présent (qu'il vienne des props ou d'useParams)
  const actualToken = propToken; // Si le token vient des props
  // Si vous décidez de revenir à useParams (moins recommandé avec le Auth.jsx actuel)
  // const { token: urlParamToken } = useParams();
  // const actualToken = propToken || urlParamToken;

  useEffect(() => {
    console.log('ResetPasswordForm useEffect - Token received:', actualToken);
    if (!actualToken) {
      setError('Lien de réinitialisation invalide ou manquant.');
      // Optionnel: rediriger si le token est manquant, mais soyez prudent pour ne pas créer une boucle de redirection
      // setTimeout(() => navigate('/auth?mode=forgot'), 3000);
    }
  }, [actualToken, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      return setError('Passwords do not match');
    }

    // Assurez-vous que le token est disponible avant d'appeler l'API
    if (!actualToken) {
      setError('Token de réinitialisation manquant pour la requête.');
      return;
    }

    try {
      setLoading(true);
      setError('');
      setSuccess('');
      await resetPassword(actualToken, formData.password); // <<< Utilisation du token effectif
      setSuccess('Password reset successfully. You will be redirected to login...');
      setTimeout(() => navigate('/auth?mode=login'), 3000);
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Failed to reset password';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="flex flex-col md:flex-row bg-white rounded-lg shadow-lg overflow-hidden w-full max-w-4xl mx-4">
        {/* Logo à gauche */}
        <div className="hidden md:flex flex-1 bg-blue-800">
          <div
            className="m-12 w-full bg-contain bg-center bg-no-repeat"
            style={{ backgroundImage: `url(https://cybersecurity.fi/assets/images/logo.png)` }}
          ></div>
        </div>

        {/* Formulaire à droite */}
        <div className="w-full md:w-1/2 p-8">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-blue-800 mb-2">Reset Your Password</h2>
            <p className="text-sm text-gray-600">Enter your new password below</p>
          </div>

          {error && <Alert type="error" message={error} />}
          {success && <Alert type="success" message={success} />}
          {!actualToken && !error && <Alert type="warning" message="No reset token found in URL. Please use the link from your email." />} {/* Message si pas de token */}


          <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                minLength="6"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter new password"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                minLength="6"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Confirm new password"
              />
            </div>

            <button
              type="submit"
              disabled={loading || !actualToken} // Désactiver si loading ou pas de token
              className={`w-full bg-blue-800 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition duration-300 ${
                loading || !actualToken ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {loading ? 'Resetting...' : 'Reset Password'}
            </button>

            <p className="text-sm text-center text-gray-600 mt-4">
              Back to{' '}
              <a href="/auth?mode=login" className="text-blue-800 font-medium hover:underline">
                login
              </a>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordForm;