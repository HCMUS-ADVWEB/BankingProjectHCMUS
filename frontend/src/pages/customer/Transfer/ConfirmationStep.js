import {
  Box, Typography, Button, Alert, Divider, IconButton,
} from '@mui/material';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useTransfer } from '../../../contexts/customer/TransferContext';
import { TRANSFER_STEPS, TRANSFER_TYPES } from '../../../utils/transferConstants';

const ConfirmationStep = () => {
  const {
    transferInfo,
    error,
    setError,
    setStep,
    sendOtp,
    setLoading,
    setSuccess,
  } = useTransfer();

  const handleConfirm = async () => {
    if (!transferInfo) return;

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
    // 🚨 No actual transfer API call — just move to OTP step
      await sendOtp(); // ✅ send OTP before showing OTP step

      setStep(TRANSFER_STEPS.OTP);
    } catch (err) {
      console.error('Transfer failed:', err);
      setError('Failed to send OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };


  const handleBack = () => {
    setStep(TRANSFER_STEPS.FORM);
  };

  if (!transferInfo) return null;

  return (
    <Box p={4}>
      {/* Heading row */}
      <Box display="flex" alignItems="center" justifyContent="space-between" mb={3}>
        <Typography variant="h5">Confirm Transfer Details</Typography>
        <IconButton onClick={handleBack} color="inherit">
          <ArrowBackIcon />
        </IconButton>
      </Box>

      <Typography variant="body1" mb={1}><strong>Recipient Name:</strong> {transferInfo.recipientName}</Typography>
      <Typography variant="body1" mb={1}><strong>Account Number:</strong> {transferInfo.accountNumberReceiver}</Typography>
      {transferInfo.transferType === TRANSFER_TYPES.EXTERNAL && (
        <Typography variant="body1" mb={1}><strong>Bank:</strong> {transferInfo.bankId}</Typography>
      )}
      <Typography variant="body1" mb={1}><strong>Amount:</strong> {transferInfo.amount} VND</Typography>
      <Typography variant="body1" mb={1}><strong>Message:</strong> {transferInfo.message || 'N/A'}</Typography>
      <Typography variant="body1" mb={2}><strong>Fee Paid By:</strong> {transferInfo.feeType}</Typography>

      <Divider sx={{ my: 2 }} />

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <Button
        variant="contained"
        color="primary"
        fullWidth
        size="large"
        startIcon={<MonetizationOnIcon />}
        onClick={handleConfirm}
      >
        Confirm Transfer
      </Button>
    </Box>
  );
};

export default ConfirmationStep;
