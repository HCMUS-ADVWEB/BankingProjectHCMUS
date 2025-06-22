import { useEffect, useState } from 'react';
import CustomerLayout from '../../layouts/CustomerLayout';
import api from '../../utils/api';
import { CircularProgress, Alert, Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TablePagination, TextField, MenuItem } from '@mui/material';

const statusOptions = [
  '', 'PENDING', 'PAID', 'CANCELLED',
];

export default function DebtsPage() {
  const [debts, setDebts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [status, setStatus] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [total, setTotal] = useState(0);

  const fetchDebts = () => {
    setLoading(true);
    api.get('/api/debts', {
      params: {
        status: status || undefined,
        limit: rowsPerPage,
        page: page + 1,
      },
    })
      .then(res => {
        setDebts(res.data.data || []);
        setTotal(res.data.data?.length || 0); // Adjust if backend returns total count
      })
      .catch(err => setError(err.response?.data?.message || err.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchDebts(); }, [status, page, rowsPerPage]);

  return (
    <CustomerLayout>
      <Box p={3}>
        <Typography variant="h4" gutterBottom>Debts</Typography>
        <Box display="flex" gap={2} mb={2}>
          <TextField select label="Status" value={status} onChange={e => { setStatus(e.target.value); setPage(0); }} style={{ minWidth: 120 }}>
            {statusOptions.map(opt => <MenuItem key={opt} value={opt}>{opt || 'All'}</MenuItem>)}
          </TextField>
        </Box>
        {loading && <CircularProgress />}
        {error && <Alert severity="error">{error}</Alert>}
        <TableContainer component={Paper} style={{ marginTop: 16 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Creator ID</TableCell>
                <TableCell>Debtor ID</TableCell>
                <TableCell>Amount</TableCell>
                <TableCell>Message</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Created At</TableCell>
                <TableCell>Updated At</TableCell>
                <TableCell>Cancelled Reason</TableCell>
                <TableCell>Transaction ID</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {debts.map((debt) => (
                <TableRow key={debt.id}>
                  <TableCell>{debt.id}</TableCell>
                  <TableCell>{debt.creatorId}</TableCell>
                  <TableCell>{debt.debtorId}</TableCell>
                  <TableCell>{debt.amount}</TableCell>
                  <TableCell>{debt.message}</TableCell>
                  <TableCell>{debt.status}</TableCell>
                  <TableCell>{debt.createdAt}</TableCell>
                  <TableCell>{debt.updatedAt}</TableCell>
                  <TableCell>{debt.cancelledReason}</TableCell>
                  <TableCell>{debt.transactionId}</TableCell>
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
