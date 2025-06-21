import { Container, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TablePagination, Card, CardContent, Box } from '@mui/material';
import { useEffect, useState } from 'react';
import CustomerLayout from '../../layouts/CustomerLayout';
import { getAccount } from '../../utils/api';

export default function AccountsPage() {
  const [account, setAccount] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAccount = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getAccount();
        setAccount(data.data);
      } catch (err) {
        setError('Failed to load account data');
      } finally {
        setLoading(false);
      }
    };
    fetchAccount();
  }, []);

  return (
    <CustomerLayout>
      <Container maxWidth="sm" sx={{ py: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 3 }}>Your Account</Typography>
        {loading ? (
          <Typography>Loading...</Typography>
        ) : error ? (
          <Typography color="error">{error}</Typography>
        ) : account ? (
          <Card sx={{ mb: 2 }}>
            <CardContent>
              <Box display="flex" flexDirection="column" gap={2}>
                <Typography variant="h6">Account Number: {account.accountNumber}</Typography>
                <Typography variant="h6">Balance: ${account.balance?.toLocaleString()}</Typography>
              </Box>
            </CardContent>
          </Card>
        ) : (
          <Typography>No account data found.</Typography>
        )}
      </Container>
    </CustomerLayout>
  );
}
