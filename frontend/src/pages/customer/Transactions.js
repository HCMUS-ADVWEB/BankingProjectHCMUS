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
import { useTransaction } from '../../contexts/customer/TransactionContext';
import { formatVND } from '../../utils/constants';
// Transaction type icons mapping

export default function TransactionsPage() {
  const {
    transactions,
    allTransactions,
    loading,
    error,
    pagination,
    fetchTransactions,
    handleChangePage: contextChangePage,
    handleChangeRowsPerPage: contextChangeRowsPerPage,
    sort,
    handleRequestSort: contextRequestSort,
  } = useTransaction();

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  useEffect(() => {
    if (error) {
      setSnackbarOpen(true);
    }
  }, [error]);

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };
  const onChangePage = (event, newPage) => {
    contextChangePage(event, newPage);
  };

  const onChangeRowsPerPage = (event) => {
    contextChangeRowsPerPage(event);
  };

  const onRequestSort = (property) => {
    contextRequestSort(property);
  }; // Use allTransactions from context instead of local merging logic
  const sortedTransactions = allTransactions;

  return (
    <CustomerLayout>
      {' '}
      <Container
        maxWidth="xl"
        sx={{ py: 6, bgcolor: 'background.default', minHeight: '100vh' }}
      >
        {/* Header Section */}
        <Box
          sx={{
            mb: 6,
            p: 4,
            borderRadius: 'shape.borderRadius',
            bgcolor: 'background.paper',
            backdropFilter: 'blur(8px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            width: '100%',
            animation: 'fadeIn 1s ease-in-out',
            '@keyframes fadeIn': {
              '0%': { opacity: 0, transform: 'translateY(-20px)' },
              '100%': { opacity: 1, transform: 'translateY(0)' },
            },
          }}
        >
          <Typography
            variant="h3"
            sx={{ fontWeight: 700, color: 'text.primary', mb: 1 }}
          >
            Transaction History 📊
          </Typography>
          <Typography variant="body1" color="text.secondary">
            View and track all of your account transactions in one place.
          </Typography>
        </Box>
        <Backdrop
          sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={loading}
        >
          <CircularProgress color="inherit" />
        </Backdrop>{' '}
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
        <Paper
          elevation={3}
          sx={{
            p: { xs: 2, sm: 3 },
            borderRadius: 'shape.borderRadius',
            bgcolor: 'background.paper',
            transition: 'all 0.3s ease',
            '&:hover': {
              boxShadow: '0 12px 30px rgba(0, 0, 0, 0.4)',
            },
            animation: 'fadeInUp 0.5s ease-in-out',
            '@keyframes fadeInUp': {
              '0%': { opacity: 0, transform: 'translateY(20px)' },
              '100%': { opacity: 1, transform: 'translateY(0)' },
            },
          }}
        >
          <TableContainer>
            <Table>
              {' '}
              <TableHead>
                <TableRow>
                  <TableCell>
                    {' '}
                    <TableSortLabel
                      active={sort.orderBy === 'createdAt'}
                      direction={
                        sort.orderBy === 'createdAt' ? sort.order : 'asc'
                      }
                      onClick={() => onRequestSort('createdAt')}
                    >
                      Date
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>From/To</TableCell>
                  <TableCell>Message</TableCell>
                  <TableCell>
                    {' '}
                    <TableSortLabel
                      active={sort.orderBy === 'amount'}
                      direction={sort.orderBy === 'amount' ? sort.order : 'asc'}
                      onClick={() => onRequestSort('amount')}
                    >
                      Amount
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {sortedTransactions.length > 0 ? (
                  sortedTransactions.map((transaction) => (
                    <TableRow key={transaction.id} hover>
                      <TableCell>
                        {new Date(transaction.createdAt).toLocaleString(
                          'en-US',
                          {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          },
                        )}
                      </TableCell>{' '}
                      <TableCell>
                        {transaction.direction === 'outgoing'
                          ? transaction.toAccountNumber
                          : transaction.fromAccountNumber}
                      </TableCell>
                      <TableCell>{transaction.message}</TableCell>
                      <TableCell>
                        <Typography
                          sx={{
                            color:
                              transaction.direction === 'outgoing'
                                ? 'error.main'
                                : 'success.main',
                            fontWeight: 600,
                          }}
                        >
                          {formatVND(transaction.displayAmount)}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={transaction.status}
                          color={
                            transaction.status === 'COMPLETED'
                              ? 'success'
                              : transaction.status === 'PENDING'
                                ? 'warning'
                                : 'error'
                          }
                          size="small"
                        />
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} align="center">
                      <Typography variant="body1" sx={{ py: 2 }}>
                        No transactions found
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>{' '}
          <TablePagination
            component="div"
            count={pagination.total}
            page={pagination.page}
            onPageChange={onChangePage}
            rowsPerPage={pagination.rowsPerPage}
            onRowsPerPageChange={onChangeRowsPerPage}
            rowsPerPageOptions={[5, 10, 25, 50]}
          />
        </Paper>
      </Container>
    </CustomerLayout>
  );
}
