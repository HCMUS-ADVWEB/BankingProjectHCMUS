import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { Button, TextField, Box, Typography } from '@mui/material';
import styles from '../../styles/ForgotPassword.module.css';

const ForgotPassword = () => {
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');

  const handleSendOtp = async (values) => {
    // Mock OTP sending
    alert(`OTP sent to ${values.email}`);
    setOtpSent(true);
  };

  return (
    <Box className={styles.forgotPassword}>
      <Typography variant="h4" className={styles.title}>
        Forgot Password
      </Typography>
      <Formik
        initialValues={{ email: '', newPassword: '', confirmPassword: '' }}
        validate={(values) => {
          const errors = {};
          if (!values.email) errors.email = 'Required';
          if (otpSent) {
            if (!values.newPassword) errors.newPassword = 'Required';
            if (values.newPassword.length < 8)
              errors.newPassword = 'Password must be at least 8 characters';
            if (!values.confirmPassword) errors.confirmPassword = 'Required';
            if (values.newPassword !== values.confirmPassword)
              errors.confirmPassword = 'Passwords do not match';
          }
          return errors;
        }}
        onSubmit={(values, { resetForm }) => {
          if (!otpSent) {
            handleSendOtp(values);
            return;
          }
          if (!otp) {
            alert('Please enter OTP');
            return;
          }
          // Mock password reset
          alert('Password reset successfully');
          resetForm();
          setOtpSent(false);
          setOtp('');
        }}
      >
        {({ isSubmitting }) => (
          <Form className={styles.form}>
            <Field
              as={TextField}
              name="email"
              label="Email"
              type="email"
              fullWidth
              margin="normal"
              disabled={otpSent}
            />
            <ErrorMessage name="email" component="div" className={styles.error} />
            {otpSent && (
              <>
                <Field
                  as={TextField}
                  name="otp"
                  label="OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  fullWidth
                  margin="normal"
                />
                <Field
                  as={TextField}
                  name="newPassword"
                  label="New Password"
                  type="password"
                  fullWidth
                  margin="normal"
                />
                <ErrorMessage
                  name="newPassword"
                  component="div"
                  className={styles.error}
                />
                <Field
                  as={TextField}
                  name="confirmPassword"
                  label="Confirm New Password"
                  type="password"
                  fullWidth
                  margin="normal"
                />
                <ErrorMessage
                  name="confirmPassword"
                  component="div"
                  className={styles.error}
                />
              </>
            )}
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={isSubmitting}
              className={styles.submitButton}
            >
              {otpSent ? 'Reset Password' : 'Send OTP'}
            </Button>
          </Form>
        )}
      </Formik>
    </Box>
  );
};

export default ForgotPassword;