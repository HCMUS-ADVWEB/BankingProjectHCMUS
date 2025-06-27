import {
  Box,
  Typography,
  Button,
  Divider,
  TextField,
  Grid,
  IconButton,
  Alert,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  SaveAlt as SaveIcon,
} from '@mui/icons-material';
import { useTransfer } from '../../../contexts/customer/TransferContext';
import { TRANSFER_STEPS } from '../../../utils/transferConstants';

const SaveRecipientStep = () => {
  const {
    saveRecipient,
    handleSaveRecipientChange,
    handleSaveRecipient,
    setStep,
    loading,
    error,
    form,
  } = useTransfer();

  return (
    <>
      <Box display="flex" alignItems="center" mb={3}>
        <IconButton
          color="primary"
          onClick={() => setStep(TRANSFER_STEPS.COMPLETE)}
          sx={{ mr: 1 }}
        >
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h5" fontWeight="bold" color="primary">
          Save Recipient
        </Typography>
      </Box>
      <Divider sx={{ mb: 3 }} />

      <Box mb={3}>
        <Typography variant="body1" mb={3}>
          Would you like to save this recipient for future transfers?
        </Typography>

        <Grid container spacing={3}>
          <Grid item size={{ sx: 12 }}>
            <TextField
              label="Recipient Nickname"
              name="recipientNickname"
              fullWidth
              value={saveRecipient.recipientNickname}
              onChange={handleSaveRecipientChange}
              placeholder="e.g. Mom, Friend, Landlord"
              autoFocus
            />
          </Grid>

          <Grid item size={{ sx: 12 }}>
            <TextField
              label="Account Number"
              name="accountNumber"
              fullWidth
              value={saveRecipient.accountNumber || form.accountNumberReceiver}
              onChange={handleSaveRecipientChange}
              disabled
            />
          </Grid>

          <Grid item size={{ sx: 12 }}>
            <TextField
              label="Bank Name"
              name="bankName"
              fullWidth
              value={saveRecipient.bankName || form.bankId}
              onChange={handleSaveRecipientChange}
              disabled
            />
          </Grid>

          <Grid item size={{ sx: 12 }}>
            <TextField
              label="Recipient Name"
              name="recipientName"
              fullWidth
              value={saveRecipient.recipientName || form.recipientName}
              onChange={handleSaveRecipientChange}
              disabled
            />
          </Grid>
        </Grid>

        {error && (
          <Alert severity="error" sx={{ mt: 3, width: '100%' }}>
            {error}
          </Alert>
        )}
      </Box>

      <Box display="flex" justifyContent="space-between">
        <Button
          variant="outlined"
          onClick={() => setStep(TRANSFER_STEPS.COMPLETE)}
        >
          Skip
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={handleSaveRecipient}
          startIcon={<SaveIcon />}
          disabled={loading || !saveRecipient.recipientNickname}
        >
          Save Recipient
        </Button>
      </Box>
    </>
  );
};

export default SaveRecipientStep;
