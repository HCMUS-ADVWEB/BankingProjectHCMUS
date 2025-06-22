import { useState, useEffect, useCallback } from 'react';
import EmployeeLayout from '../../layouts/EmployeeLayout';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  Button,
  TextField,
  InputAdornment,
  Snackbar,
  Alert,
  Divider,
  CircularProgress,
  Backdrop
} from '@mui/material';
import {
  Person as PersonIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Home as HomeIcon,
  CalendarMonth as CalendarIcon,
  AccountCircle as UserIcon,
  Lock as LockIcon,
  Clear as ClearIcon
} from '@mui/icons-material';

import { useEmployee } from '../../contexts/EmployeeContext';

export default function AccountsPage() {
  const { 
    createAccount, 
    setCreateAccount, 
    handleCreateAccount, 
    loading, 
    error, 
    success
  } = useEmployee();
  
  // Form validation state
  const [formErrors, setFormErrors] = useState({});
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [localSuccess, setLocalSuccess] = useState('');
  const [localError, setLocalError] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const resetForm = useCallback(() => {
    setCreateAccount({
      username: '',
      email: '',
      phoneNumber: '',
      fullName: '',
      address: '',
      dateOfBirth: '',
      password: '',
      confirmPassword: ''
    });
    setFormErrors({});
  }, [setCreateAccount]);

  // Handle success and error messages
  useEffect(() => {
    if (success) {
      setLocalSuccess(success);
      setSnackbarOpen(true);
      
      // Reset form after successful account creation
      if (formSubmitted) {
        resetForm();
        setFormSubmitted(false);
      }
    }
  }, [success, formSubmitted, resetForm]);

  useEffect(() => {
    if (error) {
      setLocalError(error);
      setSnackbarOpen(true);
    }
  }, [error]);

  const validateForm = () => {
    const errors = {};
    // Basic validation
    if (!createAccount.fullName?.trim()) errors.fullName = "Full name is required";
    if (!createAccount.email?.trim()) errors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(createAccount.email)) errors.email = "Email is invalid";
    
    if (!createAccount.phone?.trim()) errors.phone = "Phone is required";
    else if (!/^\d{10,11}$/.test(createAccount.phone.replace(/\D/g, ''))) errors.phone = "Phone must be 10-11 digits";
    
    if (!createAccount.address?.trim()) errors.address = "Address is required";
    if (!createAccount.dob) errors.dob = "Date of birth is required";
    
    if (!createAccount.username?.trim()) errors.username = "Username is required";
    else if (createAccount.username.length < 5) errors.username = "Username must be at least 5 characters";

    if (!createAccount.password?.trim()) errors.password = "Password is required";
    else if (createAccount.password.length < 8) errors.password = "Password must be at least 8 characters";
    
    if (createAccount.password !== createAccount.passwordConfirmation) 
      errors.passwordConfirmation = "Passwords do not match";

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleConfirm = async () => {
    if (!validateForm()) return;
    
    setFormSubmitted(true);
    try {
      await handleCreateAccount();
      // Success is handled by the effect above
    } catch (err) {
      // Error is handled by the effect above
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
    setLocalSuccess('');
    setLocalError('');
  };

  return (
    <EmployeeLayout>
      <Container maxWidth="false" sx={{ py: 4, bgcolor: 'background.default', minHeight: '100vh' }}>
        <Backdrop
          sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={loading}
        >
          <CircularProgress color="inherit" />
        </Backdrop>

        <Snackbar 
          open={snackbarOpen} 
          autoHideDuration={6000} 
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
          <Alert 
            onClose={handleCloseSnackbar} 
            severity={localError ? "error" : "success"} 
            sx={{ width: '100%' }}
          >
            {localError || localSuccess}
          </Alert>
        </Snackbar>

        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" sx={{ fontWeight: 700, color: 'primary.main' }}>
            Create User Account
          </Typography>
        </Box>

        <Paper
          elevation={3}
          sx={{
            p: { xs: 2, sm: 3 },
            mb: 4,
            borderRadius: 'shape.borderRadius',
            bgcolor: 'background.paper',
          }}
        >
          <Divider sx={{ mb: 3 }} />
          
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Box
                sx={{
                  p: 3,
                  borderRadius: 2,
                  bgcolor: 'background.paper',
                }}
              >
                <Typography
                  variant="subtitle1"
                  color="primary.main"
                  fontWeight={600}
                  gutterBottom
                  sx={{ display: 'flex', alignItems: 'center' }}
                >
                  <PersonIcon sx={{ mr: 1 }} /> Personal Information
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6} md={4}>
                    <TextField 
                      label="Full Name" 
                      variant="outlined" 
                      fullWidth 
                      required
                      value={createAccount.fullName || ''}
                      onChange={e => setCreateAccount(prev => ({ ...prev, fullName: e.target.value }))}
                      error={!!formErrors.fullName}
                      helperText={formErrors.fullName}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <PersonIcon />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <TextField 
                      label="Email" 
                      type="email" 
                      variant="outlined" 
                      fullWidth 
                      required
                      value={createAccount.email || ''}
                      onChange={e => setCreateAccount(prev => ({ ...prev, email: e.target.value }))}
                      error={!!formErrors.email}
                      helperText={formErrors.email}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <EmailIcon />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <TextField 
                      label="Phone" 
                      variant="outlined" 
                      fullWidth 
                      required
                      value={createAccount.phone || ''}
                      onChange={e => setCreateAccount(prev => ({ ...prev, phone: e.target.value }))}
                      error={!!formErrors.phone}
                      helperText={formErrors.phone}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <PhoneIcon />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={6}>
                    <TextField 
                      label="Address" 
                      variant="outlined" 
                      fullWidth 
                      required
                      value={createAccount.address || ''}
                      onChange={e => setCreateAccount(prev => ({ ...prev, address: e.target.value }))}
                      error={!!formErrors.address}
                      helperText={formErrors.address}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <HomeIcon />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={6}>
                    <TextField 
                      label="Date of Birth" 
                      type="date" 
                      variant="outlined" 
                      fullWidth 
                      required 
                      InputLabelProps={{ shrink: true }}
                      value={createAccount.dob || ''}
                      onChange={e => setCreateAccount(prev => ({ ...prev, dob: e.target.value }))}
                      error={!!formErrors.dob}
                      helperText={formErrors.dob}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <CalendarIcon />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                </Grid>
                
                <Typography
                  variant="subtitle1"
                  color="primary.main"
                  fontWeight={600}
                  gutterBottom
                  sx={{ display: 'flex', alignItems: 'center', mt: 4 }}
                >
                  <LockIcon sx={{ mr: 1 }} /> Account Credentials
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={12} md={4}>
                    <TextField 
                      label="Username" 
                      variant="outlined" 
                      fullWidth 
                      required
                      value={createAccount.username || ''}
                      onChange={e => setCreateAccount(prev => ({ ...prev, username: e.target.value }))}
                      error={!!formErrors.username}
                      helperText={formErrors.username}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <UserIcon />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <TextField 
                      label="Password" 
                      type="password" 
                      variant="outlined" 
                      fullWidth 
                      required
                      value={createAccount.password || ''}
                      onChange={e => setCreateAccount(prev => ({ ...prev, password: e.target.value }))}
                      error={!!formErrors.password}
                      helperText={formErrors.password}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <LockIcon />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <TextField 
                      label="Confirm Password" 
                      type="password" 
                      variant="outlined" 
                      fullWidth 
                      required
                      value={createAccount.passwordConfirmation || ''}
                      onChange={e => setCreateAccount(prev => ({ ...prev, passwordConfirmation: e.target.value }))}
                      error={!!formErrors.passwordConfirmation}
                      helperText={formErrors.passwordConfirmation}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <LockIcon />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                </Grid>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
                <Button 
                  variant="outlined" 
                  color="secondary" 
                  onClick={resetForm} 
                  sx={{ mr: 2 }}
                  startIcon={<ClearIcon />}
                >
                  Clear Form
                </Button>
                <Button
                  onClick={handleConfirm}
                  color="primary"
                  variant="contained"
                  disabled={loading}
                >
                  {loading ? 'Creating...' : 'Create Account'}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Paper>
      </Container>
    </EmployeeLayout>
  );
}
