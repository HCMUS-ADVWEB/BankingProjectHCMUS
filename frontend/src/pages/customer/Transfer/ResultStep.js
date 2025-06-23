import React from 'react';
import {
  Box,
  Typography,
  Button,
  Divider,
  Grid,
  Card,
  CardContent,
  Chip,
} from '@mui/material';
import {
  CheckCircle as CheckCircleIcon,
  HomeWork as HomeWorkIcon,
  SaveAlt as SaveIcon,
  Receipt as ReceiptIcon,
} from '@mui/icons-material';
import { useTransfer } from '../../../contexts/TransferContext';
import { TRANSFER_STEPS } from '../../../utils/transferConstants';
import { useNavigate } from 'react-router-dom';

const ResultStep = () => {
  const {
    result,
    form,
    formatCurrency,
    setStep,
    resetTransfer,
  } = useTransfer();
  const navigate = useNavigate();

  return (
    <>
      <Box 
        display="flex" 
        flexDirection="column" 
        alignItems="center" 
        mb={3}
        textAlign="center"
      >
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
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography color="textSecondary" gutterBottom>
                Transaction ID
              </Typography>
              <Typography variant="h6" fontWeight="bold">
                {result?.transactionId || 'N/A'}
              </Typography>
            </Grid>
            
            <Grid item xs={12}>
              <Divider />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Typography color="textSecondary" gutterBottom>
                Amount
              </Typography>
              <Typography variant="h6" fontWeight="bold">
                {formatCurrency(result?.amount || form.amount)}
              </Typography>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <Typography color="textSecondary" gutterBottom>
                Fee
              </Typography>
              <Typography variant="h6" fontWeight="bold">
                {formatCurrency(result?.fee || '0')}
              </Typography>
            </Grid>
            
            <Grid item xs={12}>
              <Divider />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <Typography color="textSecondary" gutterBottom>
                Recipient
              </Typography>
              <Typography variant="h6" fontWeight="bold">
                {result?.recipientName || form.recipientName}
              </Typography>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <Typography color="textSecondary" gutterBottom>
                Account Number
              </Typography>
              <Typography variant="h6" fontWeight="bold">
                {result?.accountNumberReceiver || form.accountNumberReceiver}
              </Typography>
            </Grid>
            
            <Grid item xs={12}>
              <Typography color="textSecondary" gutterBottom>
                Message
              </Typography>
              <Typography variant="body1">
                {result?.message || form.message || 'No message'}
              </Typography>
            </Grid>
            
            <Grid item xs={12}>
              <Typography color="textSecondary" gutterBottom>
                Status
              </Typography>
              <Chip 
                label="Completed" 
                color="success" 
                size="small" 
                icon={<CheckCircleIcon />} 
              />
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <Box display="flex" justifyContent="space-between">
        <Button
          variant="outlined"
          onClick={() => navigate('/customer/dashboard')}
          startIcon={<HomeWorkIcon />}
        >
          Go to Dashboard
        </Button>
        
        <Box>
          <Button
            variant="outlined"
            color="primary"
            onClick={() => setStep(TRANSFER_STEPS.FORM)}
            startIcon={<SaveIcon />}
            sx={{ mr: 1 }}
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
