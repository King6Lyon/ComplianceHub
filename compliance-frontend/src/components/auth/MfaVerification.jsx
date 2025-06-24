import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { verifyMfa } from '../../api/auth';
import { useAuth } from '../../context/auth-context';
import Alert from '../common/Alert';

const MfaVerification = ({ mfaData }) => {
  const { setError } = useAuth();
  const navigate = useNavigate();
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [localError, setLocalError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setLocalError('');
    setError(null);

    try {
      const response = await verifyMfa(mfaData.token, code);
      if (response?.token) {
        localStorage.setItem('token', response.token);
       navigate('/');
      } else {
        throw new Error('Erreur lors de la vérification MFA');
      }
    } catch (err) {
      console.error('MFA verification error:', err);
      const msg = err.response?.data?.message || err.message || 'Code MFA invalide';
      setLocalError(msg);
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white rounded-lg shadow-md p-8 max-w-md w-full">
        <h2 className="text-2xl font-bold text-blue-800 text-center mb-6">
          Vérification MFA
        </h2>

        {localError && <Alert type="error" message={localError} />}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">
              Code MFA (à 6 chiffres)
            </label>
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Ex: 123456"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-blue-800 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg transition duration-200 ${
              loading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {loading ? 'Vérification...' : 'Vérifier'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default MfaVerification;
