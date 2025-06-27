import {
  Box,
  Typography,
  Button,
  Divider,
  Card,
  CardContent,
  Chip,
  Alert,
} from '@mui/material';
import {
  CheckCircle as CheckCircleIcon,
  HomeWork as HomeWorkIcon,
  SaveAlt as SaveIcon,
  Receipt as ReceiptIcon,
} from '@mui/icons-material';
import { useTransfer } from '../../../contexts/customer/TransferContext';
import { TRANSFER_STEPS, TRANSFER_TYPES } from '../../../utils/transferConstants';
import { useNavigate } from 'react-router-dom';

const ResultStep = () => {
  const {
    result,
    transferInfo,
    formatCurrency,
    setStep,
    resetTransfer,
    loading,
    error,
  } = useTransfer();

  const navigate = useNavigate();

  const handleNewTransfer = () => {
    setStep(TRANSFER_STEPS.FORM);
    resetTransfer();
  };

  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 3 }}>
        {error}
      </Alert>
    );
  }


  return (
    <>
      <Box display="flex" flexDirection="column" alignItems="center" mb={3} textAlign="center">
        <CheckCircleIcon color="success" sx={{ fontSize: 60, mb: 2 }} />
        <Typography variant="h4" fontWeight="bold" color="primary">
          Transfer Successful
        </Typography>
        <Typography variant="body1" color="textSecondary" mt={1}>
          Your transaction has been processed successfully
        </Typography>
      </Box>

      <Divider sx={{ mb: 3 }} />

      <Card variant="outlined" sx={{ mb: 4, borderRadius: 2 }}>
        <CardContent>
          <Box mb={2}>
            <Typography color="textSecondary">Transaction ID</Typography>
            <Typography variant="h6" fontWeight="bold">{result?.transactionId || 'N/A'}</Typography>
          </Box>

          <Box mb={2}>
            <Typography color="textSecondary">Amount</Typography>
            <Typography variant="h6" fontWeight="bold">{formatCurrency(result?.amount || transferInfo?.amount)}</Typography>
          </Box>

          <Box mb={2}>
            <Typography color="textSecondary">Fee</Typography>
            <Typography variant="h6" fontWeight="bold">{formatCurrency(result?.fee || '0')}</Typography>
          </Box>

          <Box mb={2}>
            <Typography color="textSecondary">Recipient</Typography>
            <Typography variant="h6" fontWeight="bold">{transferInfo?.recipientName}</Typography>
          </Box>

          <Box mb={2}>
            <Typography color="textSecondary">Account Number</Typography>
            <Typography variant="h6" fontWeight="bold">{transferInfo?.accountNumberReceiver}</Typography>
          </Box>

          {transferInfo?.transferType === TRANSFER_TYPES.EXTERNAL && (
            <Box mb={2}>
              <Typography color="textSecondary">Bank Code</Typography>
              <Typography variant="h6" fontWeight="bold">{transferInfo?.bankId}</Typography>
            </Box>
          )}

          <Box mb={2}>
            <Typography color="textSecondary">Message</Typography>
            <Typography variant="body1">{result?.message || transferInfo?.message || 'No message'}</Typography>
          </Box>

          <Box>
            <Typography color="textSecondary">Status</Typography>
            <Chip label="Completed" color="success" size="small" icon={<CheckCircleIcon />} sx={{ mt: 1 }} />
          </Box>
        </CardContent>
      </Card>



      <Box display="flex" justifyContent="space-between" flexWrap="wrap" gap={2}>
        <Button variant="outlined" onClick={() => navigate('/customer/dashboard')} startIcon={<HomeWorkIcon />}>
          Go to Dashboard
        </Button>

        <Box display="flex" gap={1} flexWrap="wrap">
          <Button
            variant="outlined"
            color="primary"
            onClick={handleNewTransfer}
            startIcon={<SaveIcon />}
          >
            New Transfer
          </Button>

          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate('/customer/transactions')}
            startIcon={<ReceiptIcon />}
          >
            View Transactions
          </Button>
        </Box>
      </Box>
    </>
  );
};

export default ResultStep;
