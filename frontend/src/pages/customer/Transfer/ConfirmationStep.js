import {
  Box,
  Typography,
  Button,
  Grid,
  Divider,
  Card,
  CardContent,
  IconButton,
} from '@mui/material';
import {
  Send as SendIcon,
  ArrowBack as ArrowBackIcon,
} from '@mui/icons-material';
import { useTransfer } from '../../../contexts/customer/TransferContext';
import { TRANSFER_STEPS } from '../../../utils/transferConstants';

const ConfirmationStep = () => {
  const { form, setStep, formatCurrency, handleRequestOtp, loading } =
    useTransfer();

  return (
    <>
      <Box display="flex" alignItems="center" mb={3}>
        <IconButton
          color="primary"
          onClick={() => setStep(TRANSFER_STEPS.FORM)}
          sx={{ mr: 1 }}
        >
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h5" fontWeight="bold" color="primary">
          Confirm Transfer
        </Typography>
      </Box>
      <Divider sx={{ mb: 3 }} />

      <Card variant="outlined" sx={{ mb: 3, borderRadius: 2 }}>
        <CardContent>
          <Grid container spacing={2}>
            <Grid item size={{ sx: 12 }}>
              <Typography color="textSecondary" gutterBottom>
                Transfer Type
              </Typography>
              <Typography variant="h6">
                {form.transferType === 'internal'
                  ? 'Internal Transfer'
                  : 'External Transfer'}
              </Typography>
            </Grid>

            <Grid item size={{ sx: 12 }}>
              <Typography color="textSecondary" gutterBottom>
                Recipient Account
              </Typography>
              <Typography variant="h6">{form.accountNumberReceiver}</Typography>
            </Grid>

            {form.recipientName && (
              <Grid item size={{ sx: 12, sm: 4, md: 4 }}>
                <Typography color="textSecondary" gutterBottom>
                  Recipient Name
                </Typography>
                <Typography variant="h6">{form.recipientName}</Typography>
              </Grid>
            )}

            <Grid item size={{ sx: 12, sm: 4, md: 4 }}>
              <Typography color="textSecondary" gutterBottom>
                Amount
              </Typography>
              <Typography variant="h5" color="primary" fontWeight="bold">
                {formatCurrency(form.amount)}
              </Typography>{' '}
            </Grid>

            {form.message ? (
              <Grid item size={{ sx: 12, sm: 4, md: 4 }}>
                <Typography color="textSecondary" gutterBottom>
                  Message
                </Typography>
                <Typography variant="h6">{form.message}</Typography>
              </Grid>
            ) : (
              <Grid item size={{ sx: 12 }}>
                <Typography color="textSecondary" gutterBottom>
                  Message
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  fontStyle="italic"
                >
                  No message provided
                </Typography>
              </Grid>
            )}
          </Grid>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              mt: 1,
              p: 1.5,
              bgcolor: form.feeType === 'SENDER' ? 'primary.50' : 'warning.50',
              borderRadius: 1,
            }}
          >
            <Typography
              variant="body1"
              fontWeight="medium"
              color={
                form.feeType === 'SENDER' ? 'primary.main' : 'warning.main'
              }
            >
              {form.feeType === 'SENDER'
                ? '💰 You will pay the transfer fees'
                : '💰 Recipient will pay the transfer fees'}
            </Typography>
          </Box>
        </CardContent>
      </Card>

      <Box display="flex" justifyContent="space-between">
        <Button
          variant="outlined"
          onClick={() => setStep(TRANSFER_STEPS.FORM)}
          startIcon={<ArrowBackIcon />}
        >
          Back
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={handleRequestOtp}
          startIcon={<SendIcon />}
          disabled={loading}
        >
          Confirm & Get OTP
        </Button>
      </Box>
    </>
  );
};

export default ConfirmationStep;
