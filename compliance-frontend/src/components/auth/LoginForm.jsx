import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/auth-context';
import MfaVerification from './MfaVerification';
import Alert from '../common/Alert';

const LoginForm = () => {
  const { login, setError } = useAuth();
  const navigate = useNavigate();

  const [mfaData, setMfaData] = useState(null);
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [globalError, setGlobalError] = useState('');
  const [success, setSuccess] = useState('');

  const validate = () => {
    const newErrors = {};
    if (!formData.email) newErrors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      newErrors.email = 'Invalid email format';
    if (!formData.password) newErrors.password = 'Password is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  if (!validate()) return;

  setIsSubmitting(true);
  setGlobalError('');
  setError(null);
  setSuccess('');

  try {
    const response = await login(formData.email, formData.password);

    if (response.mfaRequired) {
      setMfaData({ token: response.token, email: formData.email });
    } else if (response.success) {
      setSuccess('Login successful! Redirecting...');

      // Pause visible de 2 secondes
      await new Promise((resolve) => setTimeout(resolve, 9000));

      navigate('/');
    } else if (response.error) {
      setGlobalError(response.error);
    }
  } catch (err) {
    console.error('Login error:', err);
    const msg = err.response?.data?.message || err.message || 'Login failed';
    setGlobalError(msg);
    setError(msg);
  } finally {
    setIsSubmitting(false);
  }
};


  if (mfaData) {
    return <MfaVerification mfaData={mfaData} />;
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="flex flex-col md:flex-row bg-white rounded-lg shadow-lg overflow-hidden w-full max-w-4xl mx-4">
        {/* Image à gauche */}
        <div
          className="hidden md:block md:w-1/2 bg-cover bg-blue-800"
          style={{
            backgroundImage: 'url(https://cybersecurity.fi/assets/images/logo.png)',
            backgroundPosition: 'center',
            backgroundSize: 'contain',
            backgroundRepeat: 'no-repeat'
          }}
        ></div>

        {/* Formulaire à droite */}
        <div className="w-full md:w-1/2 p-8">
          <h2 className="text-2xl font-bold text-blue-800 text-center mb-6">ComplianceHub</h2>

          {globalError && <Alert type="error" message={globalError} />}
          {success && <Alert type="success" message={success} />}

          <form onSubmit={handleSubmit}>
            {/* Email */}
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-medium mb-2">Email Address</label>
              <input
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                  errors.email ? 'border-red-500 focus:ring-red-300' : 'border-gray-300 focus:ring-blue-500'
                }`}
                placeholder="Enter your email"
              />
              {errors.email && <div className="text-red-500 text-xs mt-1">{errors.email}</div>}
            </div>

            {/* Password */}
            <div className="mb-4">
              <div className="flex justify-between items-center mb-2">
                <label className="block text-gray-700 text-sm font-medium">Password</label>
                <a href="/auth?mode=forgot" className="text-xs text-blue-800 hover:text-blue-600">
                  Forgot Password?
                </a>
              </div>
              <input
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                  errors.password ? 'border-red-500 focus:ring-red-300' : 'border-gray-300 focus:ring-blue-500'
                }`}
                placeholder="Enter your password"
              />
              {errors.password && <div className="text-red-500 text-xs mt-1">{errors.password}</div>}
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full bg-blue-800 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg transition duration-200 mb-4 ${
                isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {isSubmitting ? (
                <div className="flex justify-center items-center gap-2">
                  <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                  </svg>
                  Logging in...
                </div>
              ) : (
                'Login'
              )}
            </button>
          </form>

          {/* OR Separator */}
          <div className="flex items-center my-6">
            <div className="border-t border-gray-300 flex-grow"></div>
            <span className="mx-4 text-gray-500">OR</span>
            <div className="border-t border-gray-300 flex-grow"></div>
          </div>

          {/* Google Button */}
          <a href="http://localhost:5000/api/auth/google">
            <button className="w-full flex items-center justify-center gap-2 bg-gray-200 border border-gray-300 rounded-lg py-2 px-4 hover:bg-gray-140 transition duration-200">
              <svg className="h-5 w-5" viewBox="0 0 40 40">
                <path fill="#FFC107" d="M36.34 16.73H35V16.66H20v6.67h9.42c-1.38 3.88-5.07 6.67-9.42 6.67C14.48 30 10 25.52 10 20s4.48-10 10-10c2.55 0 4.87.96 6.63 2.53l4.72-4.72C28.37 5.04 24.39 3.33 20 3.33 10.8 3.33 3.33 10.8 3.33 20S10.8 36.67 20 36.67 36.67 29.2 36.67 20c0-1.12-.11-2.21-.33-3.27z" />
                <path fill="#FF3D00" d="M5.25 12.24l5.48 4.02C12.21 12.59 15.8 10 20 10c2.55 0 4.87.96 6.63 2.53l4.72-4.72C28.37 5.04 24.39 3.33 20 3.33 13.6 3.33 8.05 6.95 5.25 12.24z" />
                <path fill="#4CAF50" d="M20 36.67c4.3 0 8.22-1.65 11.18-4.34l-5.16-4.37c-1.67 1.27-3.75 2.04-6.02 2.04-4.34 0-8.02-2.76-9.4-6.62l-5.43 4.18C7.92 32.96 13.52 36.67 20 36.67z" />
                <path fill="#1976D2" d="M36.34 16.73H35V16.66H20v6.67h9.42c-.66 1.86-1.86 3.47-3.42 4.63l5.17 4.37C30.81 32.67 36.67 28.33 36.67 20c0-1.12-.11-2.21-.33-3.27z" />
              </svg>
              <span className="text-gray-700 font-medium">Sign in with Google</span>
            </button>
          </a>

          {/* Sign up Link */}
          <div className="text-center mt-6">
            <p className="text-gray-600 text-sm">
              Don’t have an account yet?{' '}
              <a href="/auth?mode=register" className="text-blue-800 hover:text-blue-600 font-medium">
                Sign Up
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
