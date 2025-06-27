import { useState, useCallback, useEffect } from 'react';
import EmployeeLayout from '../../layouts/EmployeeLayout';
import {
  Container,
  Grid,
  Typography,
  Box,
  Button,
  TextField,
  InputAdornment,
  Snackbar,
  Alert,
  Paper,
  CircularProgress,
  Backdrop,
  Avatar,
  IconButton,
  Dialog,
} from '@mui/material';
import {
  Person as PersonIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Home as HomeIcon,
  CalendarMonth as CalendarIcon,
  AccountCircle as UserIcon,
  Lock as PasswordIcon,
  Clear as ClearIcon,
  Check as CheckIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { useCreateAccount } from '../../contexts/employee/CreateAccountContext';

const passwordRequirements = [
  { test: (pwd) => pwd.length >= 8, message: 'At least 8 characters' },
  { test: (pwd) => /[A-Z]/.test(pwd), message: 'One uppercase letter' },
  { test: (pwd) => /[a-z]/.test(pwd), message: 'One lowercase letter' },
  { test: (pwd) => /\d/.test(pwd), message: 'One number' },
  { test: (pwd) => /[@$!%*?&]/.test(pwd), message: 'One special character' },
];

export default function AccountsPage() {
  const {
    form,
    loading,
    error,
    success,
    setForm,
    handleCreateAccount,
    resetForm,
    clearMessages,
  } = useCreateAccount();
  const [formErrors, setFormErrors] = useState({});
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [buttonPulse, setButtonPulse] = useState(false);
  const [accountNumberCreated, setAccountNumberCreated] = useState(null);

  useEffect(() => {
    clearMessages();
  }, [clearMessages]);

  const validateForm = useCallback(() => {
    const errors = {};
    if (!form.fullName?.trim()) errors.fullName = 'Full name is required';
    if (!form.email?.trim()) errors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email))
      errors.email = 'Email is invalid';
    if (!form.phone?.trim()) errors.phone = 'Phone is required';
    else if (!/^(0[0-9]{9})$/.test(form.phone))
      errors.phone = 'Phone must be 10 digits starting with 0';
    if (!form.address?.trim()) errors.address = 'Address is required';
    if (!form.dob) errors.dob = 'Date of birth is required';
    if (!form.username?.trim()) errors.username = 'Username is required';
    if (!form.password?.trim()) errors.password = 'Password is required';
    else if (
      !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(
        form.password,
      )
    ) {
      const failedReqs = passwordRequirements
        .filter(({ test }) => !test(form.password))
        .map(({ message }) => message)
        .join(', ')
        .toLowerCase();
      errors.password = `Password conditions: ${failedReqs}`;
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  }, [form]);

  const handleConfirm = async () => {
    clearMessages();
    setAccountNumberCreated(null);
    if (!validateForm()) {
      return;
    }
    const data = await handleCreateAccount();
    if (data) {
      resetForm();
      setFormErrors({});
      setButtonPulse(true);
      setTimeout(() => setButtonPulse(false), 500);
      setAccountNumberCreated(data);
    }
    setSnackbarOpen(true);
  };

  const handleResetForm = () => {
    setSnackbarOpen(false);
    resetForm();
    setFormErrors({});
  };

  const handleCloseAccountNumberBox = () => {
    setAccountNumberCreated(null);
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <EmployeeLayout>
      <Container
        maxWidth="2xl"
        sx={{ py: 4, bgcolor: 'background.default', minHeight: '100vh' }}
      >
        <Backdrop
          sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={loading}
        >
          <CircularProgress color="inherit" />
        </Backdrop>

        {(error || success) && (
          <Snackbar
            open={snackbarOpen}
            autoHideDuration={5000}
            onClose={handleCloseSnackbar}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          >
            <Alert
              onClose={handleCloseSnackbar}
              severity={error ? 'error' : success ? 'success' : 'error'}
              sx={{ width: '100%' }}
            >
              {error || success}
            </Alert>
          </Snackbar>
        )}

        <Box
          sx={{
            mb: 6,
            p: 3,
            borderRadius: 'shape.borderRadius',
            bgcolor: 'background.paper',
            backdropFilter: 'blur(8px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            animation: 'fadeIn 1s ease-in-out',
            '@keyframes fadeIn': {
              '0%': { opacity: 0, transform: 'translateY(-20px)' },
              '100%': { opacity: 1, transform: 'translateY(0)' },
            },
          }}
        >
          <Typography
            variant="h3"
            sx={{
              fontWeight: 700,
              color: 'text.primary',
              mb: 1,
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <Avatar
              sx={{
                bgcolor: 'linear-gradient(to right, #10b981, #06b6d4)',
                color: 'white',
                mr: 2,
                width: 40,
                height: 40,
              }}
            >
              <PersonIcon />
            </Avatar>
            Create Customer Account
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Enter customer details to create a new Internet Banking account.
          </Typography>
        </Box>

        <Paper
          elevation={3}
          sx={{
            p: { xs: 2, sm: 3 },
            borderRadius: 'shape.borderRadius',
            bgcolor: 'background.paper',
            transition: 'all 0.3s ease',
            '&:hover': {
              transform: 'translateY(-4px)',
              boxShadow: '0 12px 30px rgba(0, 0, 0, 0.4)',
            },
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
            Personal Information
          </Typography>
          <Grid container spacing={2}>
            <Grid item size={{ xs: 12, sm: 6 }}>
              <TextField
                label="Full Name"
                placeholder="Enter customer fullname"
                variant="outlined"
                fullWidth
                value={form.fullName}
                onChange={(e) => setForm({ fullName: e.target.value })}
                error={!!formErrors.fullName}
                helperText={formErrors.fullName}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <PersonIcon />
                      </InputAdornment>
                    ),
                  },
                }}
              />
            </Grid>
            <Grid item size={{ xs: 12, sm: 6 }}>
              <TextField
                label="Email"
                placeholder="Enter customer email"
                type="email"
                variant="outlined"
                fullWidth
                value={form.email}
                onChange={(e) => setForm({ email: e.target.value })}
                error={!!formErrors.email}
                helperText={formErrors.email}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <EmailIcon />
                      </InputAdornment>
                    ),
                  },
                }}
              />
            </Grid>
            <Grid item size={{ xs: 12, sm: 6 }}>
              <TextField
                label="Phone"
                placeholder="Enter customer phone number"
                variant="outlined"
                fullWidth
                value={form.phone}
                onChange={(e) => setForm({ phone: e.target.value })}
                error={!!formErrors.phone}
                helperText={formErrors.phone}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <PhoneIcon />
                      </InputAdornment>
                    ),
                  },
                }}
              />
            </Grid>
            <Grid item size={{ xs: 12, sm: 6 }}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label="Date of Birth"
                  format="DD/MM/YYYY"
                  value={form.dob ? dayjs(form.dob) : null}
                  onChange={(newValue) => {
                    const formattedDate = newValue
                      ? newValue.format('YYYY-MM-DD')
                      : '';
                    setForm({ dob: formattedDate });
                  }}
                  slotProps={{
                    textField: {
                      variant: 'outlined',
                      fullWidth: true,
                      error: !!formErrors.dob,
                      helperText: formErrors.dob,
                      InputProps: {
                        startAdornment: (
                          <InputAdornment position="start">
                            <CalendarIcon />
                          </InputAdornment>
                        ),
                      },
                    },
                  }}
                />
              </LocalizationProvider>
            </Grid>
            <Grid item size={{ xs: 12 }}>
              <TextField
                label="Address"
                placeholder="Enter customer address"
                variant="outlined"
                fullWidth
                value={form.address}
                onChange={(e) => setForm({ address: e.target.value })}
                error={!!formErrors.address}
                helperText={formErrors.address}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <HomeIcon />
                      </InputAdornment>
                    ),
                  },
                }}
              />
            </Grid>
          </Grid>

          <Typography variant="h6" sx={{ fontWeight: 600, mt: 4, mb: 2 }}>
            Login Information
          </Typography>
          <Grid container spacing={2}>
            <Grid item size={{ xs: 12, sm: 6 }}>
              <TextField
                label="Username"
                placeholder="Enter customer username"
                variant="outlined"
                fullWidth
                value={form.username}
                onChange={(e) => setForm({ username: e.target.value })}
                error={!!formErrors.username}
                helperText={formErrors.username}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <UserIcon />
                      </InputAdornment>
                    ),
                  },
                }}
              />
            </Grid>
            <Grid item size={{ xs: 12, sm: 6 }}>
              <TextField
                label="Password"
                placeholder="Enter customer password"
                type={showPassword ? 'text' : 'password'}
                variant="outlined"
                fullWidth
                value={form.password}
                onChange={(e) => setForm({ password: e.target.value })}
                error={!!formErrors.password}
                helperText={formErrors.password}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <PasswordIcon />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={handleTogglePassword} edge="end">
                          {showPassword ? (
                            <VisibilityOffIcon />
                          ) : (
                            <VisibilityIcon />
                          )}
                        </IconButton>
                      </InputAdornment>
                    ),
                  },
                }}
              />
            </Grid>
          </Grid>

          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
            <Button
              variant="outlined"
              color="secondary"
              onClick={handleResetForm}
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
              startIcon={<CheckIcon />}
              sx={{
                bgcolor: 'linear-gradient(to right, #10b981, #06b6d4)',
                animation: buttonPulse ? 'pulse 0.5s ease-in-out' : 'none',
                '@keyframes pulse': {
                  '0%': { transform: 'scale(1)' },
                  '50%': { transform: 'scale(1.1)' },
                  '100%': { transform: 'scale(1)' },
                },
              }}
            >
              {loading ? 'Creating...' : 'Create Account'}
            </Button>
          </Box>
        </Paper>

        <Dialog
          open={!!accountNumberCreated}
          onClose={handleCloseAccountNumberBox}
          maxWidth="xs"
          fullWidth
          PaperProps={{
            sx: {
              p: 3,
              borderRadius: 3,
              textAlign: 'center',
              animation: 'fadeInUp 0.5s ease-out',
              '@keyframes fadeInUp': {
                '0%': { opacity: 0, transform: 'translateY(20px)' },
                '100%': { opacity: 1, transform: 'translateY(0)' },
              },
            },
          }}
        >
          <Typography
            variant="h5"
            sx={{
              fontWeight: 700,
              mb: 2,
              background: 'linear-gradient(to right, #10b981, #06b6d4)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Account Created!
          </Typography>

          <Typography variant="body1" sx={{ mb: 1, color: 'text.secondary' }}>
            The new account number is:
          </Typography>

          <Typography
            sx={{
              fontFamily: '"Roboto Mono", monospace',
              fontSize: '1.8rem',
              fontWeight: 600,
              mb: 3,
              background: 'linear-gradient(to right, #10b981, #06b6d4)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            {accountNumberCreated}
          </Typography>

          <Button
            onClick={handleCloseAccountNumberBox}
            variant="contained"
            color="primary"
            sx={{
              bgcolor: 'linear-gradient(to right, #10b981, #06b6d4)',
              '&:hover': {
                bgcolor: 'linear-gradient(to right, #0a8f63, #0590a8)',
              },
            }}
          >
            Close
          </Button>
        </Dialog>

      </Container>
    </EmployeeLayout>
  );
}
