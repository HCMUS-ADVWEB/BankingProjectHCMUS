import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { Button, TextField, Box, Typography } from '@mui/material';
import styles from '../../styles/ChangePassword.module.css';

const ChangePassword = () => {
  return (
    <Box className={styles.changePassword}>
      <Typography variant="h4" className={styles.title}>
        Change Password
      </Typography>
      <Formik
        initialValues={{
          currentPassword: '',
          newPassword: '',
          confirmPassword: '',
        }}
        validate={(values) => {
          const errors = {};
          if (!values.currentPassword) errors.currentPassword = 'Required';
          if (!values.newPassword) errors.newPassword = 'Required';
          if (values.newPassword.length < 8)
            errors.newPassword = 'Password must be at least 8 characters';
          if (!values.confirmPassword) errors.confirmPassword = 'Required';
          if (values.newPassword !== values.confirmPassword)
            errors.confirmPassword = 'Passwords do not match';
          return errors;
        }}
        onSubmit={(values, { resetForm }) => {
          // Mock password change with bcrypt
          alert('Password changed successfully');
          resetForm();
        }}
      >
        {({ isSubmitting }) => (
          <Form className={styles.form}>
            <Field
              as={TextField}
              name="currentPassword"
              label="Current Password"
              type="password"
              fullWidth
              margin="normal"
            />
            <ErrorMessage
              name="currentPassword"
              component="div"
              className={styles.error}
            />
            <Field
              as={TextField}
              name="newPassword"
              label="New Password"
              type="password"
              fullWidth
              margin="normal"
            />
            <ErrorMessage name="newPassword" component="div" className={styles.error} />
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
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={isSubmitting}
              className={styles.submitButton}
            >
              Change Password
            </Button>
          </Form>
        )}
      </Formik>
    </Box>
  );
};

export default ChangePassword;