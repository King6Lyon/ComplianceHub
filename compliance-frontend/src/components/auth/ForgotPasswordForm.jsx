import React, { useState } from 'react';
import { forgotPassword } from '../../api/auth';
import Alert from '../common/Alert';

const ForgotPasswordForm = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError('');
      setSuccess('');
      await forgotPassword(email);
      setSuccess('Password reset link sent to your email');
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Failed to send reset link';
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
            <h2 className="text-2xl font-bold text-blue-800 mb-2">Forgot Password</h2>
            <p className="text-sm text-gray-600">
              Enter your email address and we’ll send you a password reset link
            </p>
          </div>

          {error && <Alert type="error" message={error} />}
          {success && <Alert type="success" message={success} />}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="you@example.com"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full bg-blue-800 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition duration-300 ${
                loading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {loading ? 'Sending...' : 'Send Reset Link'}
            </button>

            <p className="text-sm text-center text-gray-600 mt-4">
              Remember your password?{' '}
              <a href="/auth?mode=login" className="text-blue-800 font-medium hover:underline">
                Sign in
              </a>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordForm;
