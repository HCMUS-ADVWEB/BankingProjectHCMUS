import { useEffect, useState } from 'react';
import CustomerLayout from '../../layouts/CustomerLayout';
import api from '../../utils/api';
import { CircularProgress, Alert, Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TablePagination } from '@mui/material';

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [total, setTotal] = useState(0);

  const fetchTransactions = () => {
    setLoading(true);
    api.get('/api/transactions', {
      params: {
        limit: rowsPerPage,
        page: page + 1,
      },
    })
      .then(res => {
        setTransactions(res.data.data || []);
        setTotal(res.data.data?.length || 0); // Adjust if backend returns total count
      })
      .catch(err => setError(err.response?.data?.message || err.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchTransactions(); }, [page, rowsPerPage]);

  return (
    <CustomerLayout>
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>Transactions</Typography>
        {loading && <CircularProgress />}
        {error && <Alert severity="error">{error}</Alert>}
        <TableContainer component={Paper} sx={{ mt: 2 }}>
          <Table>
            <TableHead>
              <TableRow>
                {transactions[0] && Object.keys(transactions[0]).map((key) => (
                  <TableCell key={key}>{key}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {transactions.map((tx, idx) => (
                <TableRow key={tx.id || idx}>
                  {Object.values(tx).map((val, i) => (
                    <TableCell key={i}>{String(val)}</TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[10, 20, 50]}
          component="div"
          count={total}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={(e, newPage) => setPage(newPage)}
          onRowsPerPageChange={e => { setRowsPerPage(parseInt(e.target.value, 10)); setPage(0); }}
        />
      </Box>
    </CustomerLayout>
  );
}
