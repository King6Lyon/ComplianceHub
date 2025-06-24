import React, { useState, useEffect } from 'react';
import { setupMfa, verifyMfa } from '../../api/auth';
import QRCode from 'react-qr-code';
import Alert from '../common/Alert';

const MfaSetup = () => {
  const [mfaData, setMfaData] = useState(null);
  const [verificationCode, setVerificationCode] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const initMfaSetup = async () => {
      try {
        const data = await setupMfa();
        setMfaData(data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to initialize MFA setup');
      }
    };
    initMfaSetup();
  }, []);

  const handleVerify = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError('');
      setSuccess('');
      await verifyMfa(verificationCode, mfaData.secret);
      setSuccess('MFA setup completed successfully.');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid verification code');
    } finally {
      setLoading(false);
    }
  };

  if (!mfaData) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-600">Loading MFA setup...</p>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="flex flex-col md:flex-row bg-white rounded-lg shadow-lg overflow-hidden w-full max-w-4xl mx-4">
        
        {/* Image à gauche */}
        <div 
          className="hidden md:block md:w-1/2 bg-blue-800 bg-center bg-no-repeat bg-contain"
          style={{
            backgroundImage: 'url(https://cybersecurity.fi/assets/images/logo.png)',
          }}
        ></div>

        {/* Formulaire MFA à droite */}
        <div className="w-full md:w-1/2 p-8">
          <h2 className="text-2xl font-bold text-blue-800 text-center mb-6">
            Multi-Factor Authentication Setup
          </h2>

          {error && <Alert type="error" message={error} />}
          {success && <Alert type="success" message={success} />}

          <div className="mb-6 text-center">
            <p className="text-sm text-gray-600 mb-2">Scan this QR code with your authenticator app:</p>
            <div className="inline-block p-2 bg-white shadow-md rounded">
              <QRCode value={mfaData.uri} />
            </div>
            <p className="mt-4 text-sm text-gray-600">Or enter this code manually:</p>
            <code className="text-blue-700 font-mono text-sm">{mfaData.secret}</code>
          </div>

          <form onSubmit={handleVerify}>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-medium mb-2">
                Verification Code
              </label>
              <input
                type="text"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                required
                placeholder="Enter 6-digit code"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full bg-blue-800 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg transition duration-200 ${
                loading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {loading ? 'Verifying...' : 'Verify'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default MfaSetup;
