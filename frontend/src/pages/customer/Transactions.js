import { useEffect, useState } from 'react';
import CustomerLayout from '../../layouts/CustomerLayout';
import api from '../../utils/api';
import { CircularProgress, Alert, Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TablePagination } from '@mui/material';

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [total, setTotal] = useState(0);

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      console.log('Params:', { limit: rowsPerPage, pn: page });
      const res = await api.get('/api/accounts/customer/transactions', {
        params: {
          limit: rowsPerPage,
          pn: page,
        },
      });
      console.log(res);
      const data = res.data.data || [];
      setTransactions(data);
      // Giả sử backend trả về total count trong res.data.total hoặc tính từ data.length
      setTotal(res.data.total || data.length);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch transactions');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [page, rowsPerPage]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('en-US', {
      dateStyle: 'medium',
      timeStyle: 'short',
    });
  };

  return (
    <CustomerLayout>
      <Box p={3}>
        <Typography variant="h4" gutterBottom>
          Transactions
        </Typography>
        {loading && <CircularProgress />}
        {error && <Alert severity="error">{error}</Alert>}
        {!loading && !error && (
          <TableContainer component={Paper} sx={{ mt: 2 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Bank ID</TableCell>
                  <TableCell>Amount</TableCell>
                  <TableCell>Transaction Date</TableCell>
                  <TableCell>Message</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {transactions.length > 0 ? (
                  transactions.map((tx) => (
                    <TableRow key={tx.id}>
                      <TableCell>{tx.id}</TableCell>
                      <TableCell>{tx.bankId || 'N/A'}</TableCell>
                      <TableCell>${tx.amount.toFixed(2)}</TableCell>
                      <TableCell>{formatDate(tx.transactionDate)}</TableCell>
                      <TableCell>{tx.message}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} align="center">
                      No transactions found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}
        <TablePagination
          rowsPerPageOptions={[10, 20, 50]}
          component="div"
          count={total}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={(e, newPage) => setPage(newPage)}
          onRowsPerPageChange={(e) => {
            setRowsPerPage(parseInt(e.target.value, 10));
            setPage(0);
          }}
        />
      </Box>
    </CustomerLayout>
  );
}
