import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { resetPassword } from '../../api/auth';
import  Alert  from '../common/Alert';

const ResetPasswordForm = () => {
  const { token } = useParams();
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
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
      await resetPassword(token, formData.password);
      setSuccess('Password reset successfully. You can now login with your new password.');
      setError('');
      setTimeout(() => navigate('/auth?mode=login'), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to reset password');
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
        <label>New Password</label>
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          required
          minLength="6"
        />
      </div>
      <div className="form-group">
        <label>Confirm New Password</label>
        <input
          type="password"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
          required
          minLength="6"
        />
      </div>
      <button type="submit" disabled={loading}>
        {loading ? 'Resetting...' : 'Reset Password'}
      </button>
    </form>
  );
};

export default ResetPasswordForm;