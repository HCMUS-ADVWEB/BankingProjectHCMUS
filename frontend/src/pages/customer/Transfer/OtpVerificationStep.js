import React from 'react';
import {
  Box,
  Typography,
  Button,
  Divider,
  TextField,
  IconButton,
  Alert,
} from '@mui/material';
import {
  Send as SendIcon,
  ArrowBack as ArrowBackIcon,
} from '@mui/icons-material';
import { useTransfer } from '../../../contexts/TransferContext';
import { TRANSFER_STEPS } from '../../../utils/transferConstants';
import { useAuth } from '../../../contexts/AuthContext';

const OtpVerificationStep = () => {
  const {
    otp,
    setOtp,
    setStep,
    handleVerifyOtp,    loading,
    error,
  } = useTransfer();
  
  const { state: authState } = useAuth();

  return (
    <>
      <Box display="flex" alignItems="center" mb={3}>
        <IconButton 
          color="primary" 
          onClick={() => setStep(TRANSFER_STEPS.CONFIRM)}
          sx={{ mr: 1 }}
        >
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h5" fontWeight="bold" color="primary">
          Verify OTP
        </Typography>
      </Box>
      <Divider sx={{ mb: 3 }} />

      <Box 
        display="flex" 
        flexDirection="column" 
        alignItems="center" 
        justifyContent="center"
        p={3}
      >        <Typography textAlign="center" mb={3}>
          Please enter the OTP sent to your email address ({authState?.user?.email})
        </Typography>

        <TextField
          label="Enter OTP"
          fullWidth
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          autoFocus
          sx={{ maxWidth: 300, mb: 3 }}
        />

        {error && (
          <Alert severity="error" sx={{ mb: 3, width: '100%' }}>
            {error}
          </Alert>
        )}

        <Button
          variant="contained"
          color="primary"
          onClick={handleVerifyOtp}
          disabled={loading || !otp}
          startIcon={<SendIcon />}
          fullWidth
          sx={{ maxWidth: 300 }}
        >
          {loading ? 'Verifying...' : 'Verify OTP'}
        </Button>
      </Box>
    </>
  );
};

export default OtpVerificationStep;
