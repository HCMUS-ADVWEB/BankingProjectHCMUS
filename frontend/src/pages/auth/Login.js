import React, { useContext, useState } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import ReCAPTCHA from 'react-google-recaptcha';
import {
  Button,
  TextField,
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { loginUser } from '../../services/api';
import styles from '../../styles/Login.module.css';

const Login = () => {
  const { login } = useContext(AuthContext);
  const [captchaVerified, setCaptchaVerified] = useState(false);

  const handleCaptcha = (value) => {
    setCaptchaVerified(!!value);
  };

  return (
    <Box className={styles.loginContainer}>
      <Typography variant="h4" className={styles.title}>
        Welcome to Digital Banking
      </Typography>
      <Formik
        initialValues={{ username: '', password: '', role: 'customer' }}
        validate={(values) => {
          const errors = {};
          if (!values.username) errors.username = 'Required';
          if (!values.password) errors.password = 'Required';
          if (!values.role) errors.role = 'Required';
          return errors;
        }}
        onSubmit={async (values, { setSubmitting }) => {
          if (!captchaVerified) {
            alert('Please verify CAPTCHA');
            setSubmitting(false);
            return;
          }
          try {
            await loginUser(values);
            login({ username: values.username, role: values.role });
          } catch (error) {
            alert('Login failed: ' + error.message);
            setSubmitting(false);
          }
        }}
      >
        {({ isSubmitting }) => (
          <Form className={styles.form}>
            <Field
              as={TextField}
              name="username"
              label="Username"
              variant="outlined"
              fullWidth
              margin="normal"
            />
            <ErrorMessage name="username" component="div" className={styles.error} />
            <Field
              as={TextField}
              name="password"
              label="Password"
              type="password"
              variant="outlined"
              fullWidth
              margin="normal"
            />
            <ErrorMessage name="password" component="div" className={styles.error} />
            <FormControl fullWidth margin="normal">
              <InputLabel>Role</InputLabel>
              <Field as={Select} name="role">
                <MenuItem value="customer">Customer</MenuItem>
                <MenuItem value="admin">Admin</MenuItem>
                <MenuItem value="employee">Employee</MenuItem>
              </Field>
            </FormControl>
            <ErrorMessage name="role" component="div" className={styles.error} />
            <ReCAPTCHA
              sitekey="6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI" // Replace with your Google ReCAPTCHA site key
              onChange={handleCaptcha}
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={isSubmitting || !captchaVerified}
              className={styles.submitButton}
            >
              Login
            </Button>
          </Form>
        )}
      </Formik>
    </Box>
  );
};

export default Login;