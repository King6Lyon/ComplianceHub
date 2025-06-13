import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/auth-context';
import { login } from '../../api/auth';
import { TextField, Button, Box, Typography, Link, Alert } from '@mui/material';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import MfaVerification from './MfaVerification';

const LoginSchema = Yup.object().shape({
  email: Yup.string().email('Email invalide').required('Requis'),
  password: Yup.string().required('Requis')
});

const LoginForm = () => {
  const { setError } = useAuth();
  const navigate = useNavigate();
  const [mfaData, setMfaData] = useState(null);

  const handleSubmit = async (values, { setSubmitting }) => {
  try {
    console.log('Attempting login with:', values); // Log des credentials
    await login(values).then((response)=>{
      console.log('Login response:', response); // Réponse complète
    
    if (response.mfaRequired) {
      setMfaData({ token: response.token, email: values.email });
    } else {
      console.log('Redirecting to /'); // Confirmation
      navigate('/');
    }
    }) 
  } catch (err) {
    console.error('Login error:', err); // Log détaillé
    setError(err.message || 'Échec de la connexion');
  } finally {
    setSubmitting(false);
  }
};

  if (mfaData) {
    return <MfaVerification mfaData={mfaData} />;
  }

  return (
    <Box sx={{ maxWidth: 400, mx: 'auto', mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Connexion
      </Typography>
      <Formik
        initialValues={{ email: '', password: '' }}
        validationSchema={LoginSchema}
        onSubmit={handleSubmit}
      >
        {({ errors, touched, isSubmitting }) => (
          <Form>
            <Field
              as={TextField}
              name="email"
              label="Email"
              fullWidth
              margin="normal"
              error={touched.email && !!errors.email}
              helperText={touched.email && errors.email}
            />
            <Field
              as={TextField}
              name="password"
              label="Mot de passe"
              type="password"
              fullWidth
              margin="normal"
              error={touched.password && !!errors.password}
              helperText={touched.password && errors.password}
            />
            <Button
              type="submit"
              variant="contained"
              fullWidth
              sx={{ mt: 2 }}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Connexion...' : 'Se connecter'}
            </Button>
            <Box sx={{ mt: 2 }}>
              <Link href="/forgot-password" underline="hover">
                Mot de passe oublié?
              </Link>
            </Box>
            <Box sx={{ mt: 1 }}>
              <Link href="/register" underline="hover">
                Créer un compte
              </Link>
            </Box>
          </Form>
        )}
      </Formik>
    </Box>
  );
};

export default LoginForm;