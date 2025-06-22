import { useEffect, useState } from 'react';
import CustomerLayout from '../../layouts/CustomerLayout';
import api from '../../utils/api';
import { CircularProgress, Alert, Box, Typography, Paper } from '@mui/material';
import { useAuth } from '../../contexts/AuthContext';

export default function AccountsPage() {
  const { state } = useAuth();
  const [account, setAccount] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    api.get('/api/accounts/my-account')
      .then(res => setAccount(res.data.data))
      .catch(err => setError(err.response?.data?.message || err.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <CustomerLayout>
      <Box p={3}>
        <Typography variant="h4" gutterBottom>Account Information</Typography>
        {loading && <CircularProgress />}
        {error && <Alert severity="error">{error}</Alert>}
        {account && (
          <Paper style={{ padding: 24, marginTop: 16 }}>
            <Typography variant="h6">Account Number</Typography>
            <Typography variant="body1" gutterBottom>{account.accountNumber}</Typography>
            <Typography variant="h6">Balance</Typography>
            <Typography variant="body1">{account.balance.toLocaleString('en-US', { style: 'currency', currency: 'VND' })}</Typography>
          </Paper>
        )}
      </Box>
    </CustomerLayout>
  );
}
