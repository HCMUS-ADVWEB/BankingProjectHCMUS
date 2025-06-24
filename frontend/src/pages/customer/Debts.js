import React, { useState } from 'react';
import CustomerLayout from '../../layouts/CustomerLayout';
import { useDebt } from '../../contexts/DebtContext';
import {
  CircularProgress,
  Alert,
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TextField,
  MenuItem,
  Container,
  Chip,
  Snackbar,
  Backdrop,
  TableSortLabel,
  Tabs,
  Tab,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  IconButton,
} from '@mui/material';
import {
  MonetizationOn as DebtIcon,
  Schedule as PendingIcon,
  CheckCircle as PaidIcon,
  Cancel as CancelledIcon,
  Send as SentIcon,
  Inbox as ReceivedIcon,
  DeleteOutline as DeleteIcon,
  Payment as PaymentIcon,
} from '@mui/icons-material';

const statusOptions = [
  { value: '', label: 'All' },
  { value: 'PENDING', label: 'Pending' },
  { value: 'PAID', label: 'Paid' },
  { value: 'CANCELLED', label: 'Cancelled' },
];

// Status colors and icons mapping
const statusConfig = {
  'PENDING': { color: 'warning', icon: <PendingIcon /> },
  'PAID': { color: 'success', icon: <PaidIcon /> },
  'CANCELLED': { color: 'error', icon: <CancelledIcon /> },
};

export default function DebtsPage() {
  const { createdDebts, receivedDebts, loading, error, fetchDebtReminders, cancelDebtReminder, requestOtpForPayDebt, payDebtReminder } = useDebt();
  const [status, setStatus] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('error');
  const [orderBy, setOrderBy] = useState('createdAt');
  const [order, setOrder] = useState('desc');
  const [tabValue, setTabValue] = useState(0);
  
  // State for cancel dialog
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  const [selectedDebt, setSelectedDebt] = useState(null);
  
  // State for pay dialog
  const [payDialogOpen, setPayDialogOpen] = useState(false);
  const [otpDialogOpen, setOtpDialogOpen] = useState(false);
  const [otp, setOtp] = useState('');
  const [paymentMessage, setPaymentMessage] = useState('');

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleStatusChange = (e) => {
    setStatus(e.target.value);
    setPage(0);
    fetchDebtReminders(e.target.value, rowsPerPage, 1);
  };

  const handlePageChange = (e, newPage) => {
    setPage(newPage);
    fetchDebtReminders(status, rowsPerPage, newPage + 1);
  };

  const handleRowsPerPageChange = (e) => {
    const newRowsPerPage = parseInt(e.target.value, 10);
    setRowsPerPage(newRowsPerPage);
    setPage(0);
    fetchDebtReminders(status, newRowsPerPage, 1);
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
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

  // Sort debts
  const getSortedDebts = (debts) => {
    return [...debts].sort((a, b) => {
      const aValue = a[orderBy];
      const bValue = b[orderBy];

      if (orderBy === 'amount') {
        return order === 'asc'
          ? Number(aValue) - Number(bValue)
          : Number(bValue) - Number(aValue);
      }

      if (orderBy === 'createdAt' || orderBy === 'updatedAt') {
        return order === 'asc'
          ? new Date(aValue) - new Date(bValue)
          : new Date(bValue) - new Date(aValue);
      }

      return order === 'asc'
        ? String(aValue).localeCompare(String(bValue))
        : String(bValue).localeCompare(String(aValue));
    });
  };

  const currentDebts = tabValue === 0 ? createdDebts : receivedDebts;
  const sortedDebts = getSortedDebts(currentDebts);
  // Add useEffect to explicitly fetch data when component mounts
  React.useEffect(() => {
    console.log('DebtsPage component mounted, fetching data...');
    fetchDebtReminders(status, rowsPerPage, page + 1);
  }, []); // Empty dependency array to run only on mount
  
  // Debug information
  console.log('Debts.js state:', {
    createdDebts,
    receivedDebts,
    loading,
    error,
    tabValue,
    currentDebts,
    sortedDebts
  });

  // Add useEffect to log when component updates
  React.useEffect(() => {
    console.log('DebtsPage component updated with data:', {
      createdDebts: createdDebts.length,
      receivedDebts: receivedDebts.length,
      loading
    });
  }, [createdDebts, receivedDebts, loading]);

  // Helper function to check for token directly
  const hasToken = () => {
    return !!localStorage.getItem('accessToken');
  };

  // Add useEffect to check for token and fetch data if needed
  React.useEffect(() => {
    if (hasToken() && createdDebts.length === 0 && receivedDebts.length === 0 && !loading) {
      console.log('We have a token but no data - forcing a fetch...');
      fetchDebtReminders(status, rowsPerPage, page + 1);
    }
  }, [createdDebts, receivedDebts, loading]);

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
          open={snackbarOpen || Boolean(error)}
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
            <DebtIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
            Debt Reminders
          </Typography>
          
          <TextField
            select
            label="Status"
            value={status}
            onChange={handleStatusChange}
            size="small"
            sx={{ minWidth: 150 }}
          >
            {statusOptions.map(opt => (
              <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
            ))}
          </TextField>
        </Box>

        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
          <Tabs 
            value={tabValue} 
            onChange={handleTabChange} 
            aria-label="debt reminder tabs"
            centered
          >
            <Tab 
              icon={<SentIcon />} 
              iconPosition="start" 
              label="Created by Me" 
              id="debt-tab-0" 
              aria-controls="debt-tabpanel-0" 
            />
            <Tab 
              icon={<ReceivedIcon />} 
              iconPosition="start" 
              label="Received" 
              id="debt-tab-1" 
              aria-controls="debt-tabpanel-1" 
            />
          </Tabs>
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
                      active={orderBy === 'createdAt'}
                      direction={orderBy === 'createdAt' ? order : 'asc'}
                      onClick={() => handleRequestSort('createdAt')}
                    >
                      Created At
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>
                    {tabValue === 0 ? 'Debtor' : 'Creator'}
                  </TableCell>
                  <TableCell>Message</TableCell>
                  <TableCell>
                    <TableSortLabel
                      active={orderBy === 'amount'}
                      direction={orderBy === 'amount' ? order : 'asc'}
                      onClick={() => handleRequestSort('amount')}
                    >
                      Amount
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>
                    <TableSortLabel
                      active={orderBy === 'status'}
                      direction={orderBy === 'status' ? order : 'asc'}
                      onClick={() => handleRequestSort('status')}
                    >
                      Status
                    </TableSortLabel>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {sortedDebts.length > 0 ? (
                  sortedDebts.map((debt) => (
                    <TableRow key={debt.id} hover>
                      <TableCell>
                        {new Date(debt.createdAt).toLocaleString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </TableCell>
                      <TableCell>
                        {/* This would need to be updated with actual user info */}
                        {tabValue === 0 ? debt.debtorId : debt.creatorId}
                      </TableCell>
                      <TableCell>{debt.message}</TableCell>
                      <TableCell>
                        <Typography
                          sx={{
                            color: 'primary.main',
                            fontWeight: 600,
                          }}
                        >
                          {formatVND(debt.amount)}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          icon={statusConfig[debt.status]?.icon}
                          label={debt.status}
                          color={statusConfig[debt.status]?.color || 'default'}
                          size="small"
                        />
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} align="center">
                      <Typography variant="body1" sx={{ py: 2 }}>
                        No debt reminders found
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            component="div"
            count={currentDebts.length}
            page={page}
            onPageChange={handlePageChange}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleRowsPerPageChange}
            rowsPerPageOptions={[5, 10, 25, 50]}
          />
        </Paper>
      </Container>
    </CustomerLayout>
  );
}
