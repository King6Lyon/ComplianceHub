import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { verifyMfa } from '../../api/auth';
import { Box, Typography, Button, Alert } from '@mui/material';
import OtpInput from 'otp-input-react';

const MfaVerification = ({ mfaData }) => {
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      setError('');
      await verifyMfa(mfaData.token, otp);
      navigate('/');
    } catch (err) {
      setError(err.message || 'Échec de la vérification MFA');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 400, mx: 'auto', mt: 4, textAlign: 'center' }}>
      <Typography variant="h4" gutterBottom>
        Vérification MFA
      </Typography>
      <Typography variant="body1" gutterBottom>
        Entrez le code à 6 chiffres de votre application d'authentification
      </Typography>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      <Box sx={{ my: 3 }}>
        <OtpInput
          value={otp}
          onChange={setOtp}
          OTPLength={6}
          otpType="number"
          disabled={false}
          autoFocus
          inputStyles={{
            width: '3rem',
            height: '3rem',
            margin: '0 0.5rem',
            fontSize: '1.5rem',
            borderRadius: '4px',
            border: '1px solid rgba(0, 0, 0, 0.23)'
          }}
        />
      </Box>
      <Button
        variant="contained"
        onClick={handleSubmit}
        disabled={otp.length !== 6 || isSubmitting}
        fullWidth
      >
        {isSubmitting ? 'Vérification...' : 'Vérifier'}
      </Button>
    </Box>
  );
};

export default MfaVerification;