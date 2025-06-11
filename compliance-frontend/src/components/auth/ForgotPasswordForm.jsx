import React, { useState } from 'react';
import { forgotPassword } from '../../api/auth';
import  Alert  from '../common/Alert';

const ForgotPasswordForm = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await forgotPassword(email);
      setSuccess('Password reset link sent to your email');
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send reset link');
      setSuccess('');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && <Alert type="error" message={error} />}
      {success && <Alert type="success" message={success} />}
      <div className="form-group">
        <label>Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <button type="submit" disabled={loading}>
        {loading ? 'Sending...' : 'Send Reset Link'}
      </button>
    </form>
  );
};

export default ForgotPasswordForm;