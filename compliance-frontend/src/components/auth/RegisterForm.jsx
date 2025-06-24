// RegisterForm.jsx (refactoré avec le style demandé)
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { register } from '../../api/auth';
import Alert from '../common/Alert';

const RegisterForm = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      return setError('Passwords do not match');
    }

    try {
      setLoading(true);
      setError('');
      await register(formData);
      navigate('/auth?mode=login');
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Registration failed';
      setError(errorMessage);
      console.error('Registration error:', err.response?.data || err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center py-12 bg-gray-100">
      <div className="flex flex-col md:flex-row bg-white rounded-lg shadow-lg overflow-hidden w-full max-w-4xl mx-4">
        <div className="flex-1 bg-blue-800 text-center hidden md:flex">
          <div
            className="m-12 xl:m-16 w-full bg-contain bg-center bg-no-repeat"
            style={{ backgroundImage: `url(https://cybersecurity.fi/assets/images/logo.png)` }}
          ></div>
        </div>
        <div className="lg:w-1/2 xl:w-5/12 p-6 sm:p-12">
          <div className="flex flex-col items-center">
            <div className="text-center">
              <h1 className="text-2xl xl:text-4xl font-extrabold text-blue-800">ComplianceHub</h1>
              <p className="text-sm text-gray-500">Enter your details to create your account</p>
            </div>

            <form onSubmit={handleSubmit} className="w-full flex-1 mt-8">
              {error && <Alert type="error" message={error} />}

              <div className="mx-auto max-w-xs flex flex-col gap-4">
                <input
                  name="firstName"
                  type="text"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                  placeholder="First Name"
                  className="w-full px-5 py-3 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white"
                />
                <input
                  name="lastName"
                  type="text"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                  placeholder="Last Name"
                  className="w-full px-5 py-3 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white"
                />
                <input
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="Email"
                  className="w-full px-5 py-3 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white"
                />
                <input
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  minLength="6"
                  placeholder="Password"
                  className="w-full px-5 py-3 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white"
                />
                <input
                  name="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  minLength="6"
                  placeholder="Confirm Password"
                  className="w-full px-5 py-3 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white"
                />

                <button
                  type="submit"
                  disabled={loading}
                  className="mt-5 tracking-wide font-semibold bg-blue-800 text-white w-full py-4 rounded-lg hover:bg-blue-700 transition-all duration-300 ease-in-out flex items-center justify-center focus:shadow-outline focus:outline-none"
                >
                  {loading ? 'Registering...' : 'Sign Up'}
                </button>

                <p className="mt-6 text-xs text-gray-600 text-center">
                  Already have an account?{' '}
                  <a href="/auth?mode=login" className="text-blue-800 font-semibold">Sign in</a>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;
