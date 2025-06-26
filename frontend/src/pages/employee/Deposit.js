import { useState, useEffect, useCallback } from 'react';
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
} from '@mui/material';
import {
  CreditCard as CardIcon,
  AttachMoney as MoneyIcon,
  Clear as ClearIcon,
  Check as CheckIcon,
} from '@mui/icons-material';
import { useDeposit } from '../../contexts/employee/DepositContext';

export default function DepositPage() {
  const { form, setForm, handleDepositAccount, loading, error, success, formatVND, resetForm, clearMessages } = useDeposit();
  const [formErrors, setFormErrors] = useState({});
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [buttonPulse, setButtonPulse] = useState(false);

  useEffect(() => {
    clearMessages();
  }, []);

  const validateForm = useCallback(() => {
    const errors = {};
    if (!form.accountNumberReceiver?.trim()) {
      errors.accountNumberReceiver = 'Account number is required';
    }
    if (!form.amount || parseInt(form.amount) <= 0) {
      errors.amount = 'Amount must be greater than 0';
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  }, [form]);

  const handleConfirm = async () => {
    clearMessages();
    if (!validateForm()) {
      return;
    }
    const result = await handleDepositAccount();
    if (result) {
      setButtonPulse(true);
      setFormErrors({});
      setTimeout(() => setButtonPulse(false), 500);
    }
    setSnackbarOpen(true);
  };

  const handleResetForm = () => {
    setSnackbarOpen(false);
    resetForm();
    setFormErrors({});
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  return (
    <EmployeeLayout>
      <Container
        maxWidth="xl"
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
            sx={{ fontWeight: 700, color: 'text.primary', mb: 1, display: 'flex', alignItems: 'center' }}
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
              <MoneyIcon />
            </Avatar>
            Deposit Funds
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Deposit money into a customer account using account number.
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
              boxShadow: '0 16px 40px rgba(0, 0, 0, 0.2)',
            },
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
            Deposit Information
          </Typography>
          <Grid container spacing={2}>
            <Grid item size={{ xs: 12, sm: 6 }}>
              <TextField
                label="Account Number"
                placeholder="Enter account number"
                variant="outlined"
                fullWidth
                value={form.accountNumberReceiver}
                onChange={(e) => setForm({ accountNumberReceiver: e.target.value })}
                error={!!formErrors.accountNumberReceiver}
                helperText={formErrors.accountNumberReceiver}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <CardIcon />
                      </InputAdornment>
                    ),
                  },
                }}
              />
            </Grid>
            <Grid item size={{ xs: 12, sm: 6 }}>
              <TextField
                label="Amount (VND)"
                placeholder="Enter amount"
                variant="outlined"
                fullWidth
                value={form.amount ? formatVND(form.amount) : ''}
                onChange={(e) => {
                  const raw = e.target.value.replace(/\D/g, '');
                  setForm({ amount: raw });
                }}
                error={!!formErrors.amount}
                helperText={formErrors.amount}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <MoneyIcon />
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
              {loading ? 'Processing...' : 'Deposit Funds'}
            </Button>
          </Box>
        </Paper>
      </Container>
    </EmployeeLayout>
  );
}