import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/auth-context';
import { updateProfile } from '../../api/auth';
import Alert from '../common/Alert';

const UserProfile = () => {
  const { user, updateUser } = useAuth();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.newPassword && formData.newPassword !== formData.confirmPassword) {
      return setError('New passwords do not match');
    }

    try {
      setLoading(true);
      const updatedUser = await updateProfile({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword
      });
      updateUser(updatedUser);
      setSuccess('Profile updated successfully');
      setError('');
      setFormData({
        ...formData,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile');
      setSuccess('');
    } finally {
      setLoading(false);
    }
  };

  if (!user) return <div>Loading...</div>;

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
          <h2 className="text-2xl font-bold text-blue-800 text-center mb-6">Update Profile</h2>

          {error && <Alert type="error" message={error} />}
          {success && <Alert type="success" message={success} />}

          <form onSubmit={handleSubmit}>
            {/* First Name */}
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-medium mb-1">First Name</label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {/* Last Name */}
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-medium mb-1">Last Name</label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {/* Email */}
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-medium mb-1">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {/* Password Section */}
            <h3 className="text-md font-semibold text-gray-700 mt-6 mb-2">Change Password</h3>

            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-medium mb-1">Current Password</label>
              <input
                type="password"
                name="currentPassword"
                value={formData.currentPassword}
                onChange={handleChange}
                placeholder="Required to change password"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-medium mb-1">New Password</label>
              <input
                type="password"
                name="newPassword"
                value={formData.newPassword}
                onChange={handleChange}
                placeholder="Leave blank to keep current password"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-medium mb-1">Confirm New Password</label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm new password"
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
              {loading ? 'Updating...' : 'Update Profile'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
