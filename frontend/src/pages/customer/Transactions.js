import { useState, useEffect } from 'react';
import CustomerLayout from '../../layouts/CustomerLayout';
import {
  Container,
  Paper,
  Typography,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Box,
  Chip,
  Snackbar,
  CircularProgress,
  Backdrop,
  TablePagination,
  TableSortLabel,
} from '@mui/material';
import {
  History as HistoryIcon,
} from '@mui/icons-material';
import api from '../../utils/api';
// Transaction type icons mapping

export default function TransactionsPage() {
  // State
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [total, setTotal] = useState(0);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [orderBy, setOrderBy] = useState('createdAt');
  const [order, setOrder] = useState('desc');

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const res = await api.get('/api/accounts/customer/transactions', {
        params: {
          limit: rowsPerPage,
          pn: page + 1, // Adding 1 because backend expects 1-based page numbers
        },
      });
      const data = res.data.data || [];
      setTransactions(data);
      setTotal(res.data.total || data.length);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch transactions');
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [page, rowsPerPage]);

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  // Format currency
  const formatVND = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  // Sort transactions
  const getSortedTransactions = () => {
    return [...transactions].sort((a, b) => {
      const aValue = a[orderBy];
      const bValue = b[orderBy];

      if (orderBy === 'amount') {
        return order === 'asc'
          ? Number(aValue) - Number(bValue)
          : Number(bValue) - Number(aValue);
      }

      if (orderBy === 'transactionDate') {
        return order === 'asc'
          ? new Date(aValue) - new Date(bValue)
          : new Date(bValue) - new Date(aValue);
      }

      // String comparison for other fields
      return order === 'asc'
        ? String(aValue).localeCompare(String(bValue))
        : String(bValue).localeCompare(String(aValue));
    });
  };

  const sortedTransactions = getSortedTransactions();

  return (
    <CustomerLayout>
      <Container maxWidth="false" sx={{ py: 4, bgcolor: 'background.default' }}>
        <Backdrop
          sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={loading}
        >
          <CircularProgress color="inherit" />
        </Backdrop>

        <Snackbar
          open={snackbarOpen}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
          <Alert
            onClose={handleCloseSnackbar}
            severity="error"
            sx={{ width: '100%' }}
          >
            {error}
          </Alert>
        </Snackbar>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" sx={{ fontWeight: 700, color: 'primary.main' }}>
            <HistoryIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
            Transaction History
          </Typography>
        </Box>

        <Paper
          elevation={3}
          sx={{
            p: { xs: 2, sm: 3 },
            borderRadius: 'shape.borderRadius',
            bgcolor: 'background.paper',
          }}
        >
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>
                    <TableSortLabel
                      active={orderBy === 'transactionDate'}
                      direction={orderBy === 'transactionDate' ? order : 'asc'}
                      onClick={() => handleRequestSort('transactionDate')}
                    >
                      Date
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>Message</TableCell>
                  <TableCell>Bank</TableCell>
                  <TableCell>
                    <TableSortLabel
                      active={orderBy === 'amount'}
                      direction={orderBy === 'amount' ? order : 'asc'}
                      onClick={() => handleRequestSort('amount')}
                    >
                      Amount
                    </TableSortLabel>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {sortedTransactions.map((transaction) => (
                  <TableRow key={transaction.id} hover>
                    <TableCell>
                      {new Date(transaction.transactionDate).toLocaleString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </TableCell>
                    <TableCell>{transaction.message}</TableCell>
                    <TableCell>{transaction.bankId || 'Internal'}</TableCell>
                    <TableCell>
                      <Typography
                        sx={{
                          color: transaction.amount < 0 ? 'error.main' : 'success.main',
                          fontWeight: 600,
                        }}
                      >
                        {formatVND(transaction.amount)}
                      </Typography>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            component="div"
            count={total}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            rowsPerPageOptions={[5, 10, 25, 50]}
          />
        </Paper>
      </Container>
    </CustomerLayout>
  );
}
