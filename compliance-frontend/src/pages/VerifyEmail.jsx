import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { verifyEmail } from '../api/auth';
import { Alert, CircularProgress, Box, Typography } from '@mui/material';

const VerifyEmailPage = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  const verify = async () => {
    try {
      await verifyEmail(token);
      
      // Option 1: Si vous utilisez un état global
      localStorage.setItem('emailVerified', 'true');
      
      // Option 2: Si vous voulez forcer le re-login
      localStorage.removeItem('token');
      
      navigate('/auth?verified=true', {
        state: { message: 'Email verified successfully!' }
      });
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Invalid or expired verification link';
      setError(errorMsg);
      
      navigate('/auth', {
        state: { 
          error: errorMsg,
          email: localStorage.getItem('unverifiedEmail') 
        }
      });
    } finally {
      setLoading(false);
    }
  };
  
  verify();
}, [token, navigate]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <CircularProgress />
        <Typography variant="body1" ml={2}>
          Verifying your email...
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box maxWidth={600} mx="auto" mt={4}>
        <Alert severity="error">
          {error}
        </Alert>
      </Box>
    );
  }

  return null;
};

export default VerifyEmailPage;