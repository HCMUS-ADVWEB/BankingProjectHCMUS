import { useEffect, useState } from 'react';
import CustomerLayout from '../../layouts/CustomerLayout';
import api from '../../utils/api';
import { useAuth } from '../../contexts/AuthContext';
import { CircularProgress, Alert, Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';

export default function AccountsPage() {
  const { state } = useAuth();
  const [accounts, setAccounts] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    api.get('/api/accounts')
      .then(res => setAccounts(res.data.data))
      .catch(err => setError(err.response?.data?.message || err.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <CustomerLayout>
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>Accounts</Typography>
        {loading && <CircularProgress />}
        {error && <Alert severity="error">{error}</Alert>}
        {accounts && Array.isArray(accounts) && (
          <TableContainer component={Paper} sx={{ mt: 2 }}>
            <Table>
              <TableHead>
                <TableRow>
                  {Object.keys(accounts[0] || {}).map((key) => (
                    <TableCell key={key}>{key}</TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {accounts.map((acc, idx) => (
                  <TableRow key={idx}>
                    {Object.values(acc).map((val, i) => (
                      <TableCell key={i}>{String(val)}</TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
        {accounts && !Array.isArray(accounts) && (
          <Alert severity="info">No account data found.</Alert>
        )}
      </Box>
    </CustomerLayout>
  );
}
