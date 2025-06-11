import React, { useState, useEffect } from 'react';
import { setupMfa, verifyMfa } from '../../api/auth';
import QRCode from 'react-qr-code';
import  Alert  from '../common/Alert';

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
      await verifyMfa(verificationCode, mfaData.secret);
      setSuccess('MFA setup completed successfully');
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid verification code');
    } finally {
      setLoading(false);
    }
  };

  if (!mfaData) return <div>Loading MFA setup...</div>;

  return (
    <div>
      <h2>Multi-Factor Authentication Setup</h2>
      {error && <Alert type="error" message={error} />}
      {success && <Alert type="success" message={success} />}
      
      <div>
        <p>Scan this QR code with your authenticator app:</p>
        <QRCode value={mfaData.uri} />
        <p>Or enter this secret manually:</p>
        <code>{mfaData.secret}</code>
      </div>

      <form onSubmit={handleVerify}>
        <div className="form-group">
          <label>Verification Code</label>
          <input
            type="text"
            value={verificationCode}
            onChange={(e) => setVerificationCode(e.target.value)}
            required
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? 'Verifying...' : 'Verify'}
        </button>
      </form>
    </div>
  );
};

export default MfaSetup;