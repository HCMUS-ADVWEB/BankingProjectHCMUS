import { useState, useEffect, useCallback } from 'react';
import EmployeeLayout from '../../layouts/EmployeeLayout';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  Button,
  TextField,
  InputAdornment,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Divider,
  Snackbar,
  Chip,
  Switch,
  FormControlLabel,
  CircularProgress,
  Backdrop,
  Card,
  CardContent,
  Tooltip
} from '@mui/material';

import {
  AttachMoney as MoneyIcon,
  CreditCard as CardIcon,
  ContactMail as UsernameIcon,
  History as HistoryIcon,
  Receipt as ReceiptIcon,
  Info as InfoIcon,
  DoneAll as SuccessIcon,
  Clear as ClearIcon,
  Check as CheckIcon
} from '@mui/icons-material';

import { useEmployee } from '../../contexts/EmployeeContext';

// Sample history data
const depositHistoryData = [
  { 
    id: 'DEP001',
    accountId: '0901234567',
    accountType: 'username',
    amount: 1000000,
    status: 'Success',
    date: '2025-06-21T10:30:00Z',
    note: 'Initial deposit'
  },
  { 
    id: 'DEP002',
    accountId: '9704390632656',
    accountType: 'account_number',
    amount: 500000,
    status: 'Success',
    date: '2025-06-20T14:15:00Z',
    note: 'Savings account'
  },
  { 
    id: 'DEP003',
    accountId: 'alice123',
    accountType: 'username',
    amount: 2000000,
    status: 'Success',
    date: '2025-06-19T09:45:00Z',
    note: 'Monthly deposit'
  },
];

export default function DepositPage() {
  const { 
    depositAccount, 
    setDepositAccount, 
    handleDepositAccount, 
    loading, 
    error, 
    success,
    formatVND, 
    handleDepositAmountChange
  } = useEmployee();

  // State
  const [isUsingUsername, setIsUsingUsername] = useState(true);
  const [localSuccess, setLocalSuccess] = useState('');
  const [localError, setLocalError] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [depositHistory, setDepositHistory] = useState(depositHistoryData);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const resetForm = useCallback(() => {
    setDepositAccount({
      accountId: '',
      amount: '',
      note: ''
    });
    setFormErrors({});
  }, [setDepositAccount]);

  // Handle success and error messages
  useEffect(() => {
    if (success) {
      setLocalSuccess(success);
      setSnackbarOpen(true);
      // Reset form after successful deposit
      resetForm();
    }
  }, [success, resetForm]);

  useEffect(() => {
    if (error) {
      setLocalError(error);
      setSnackbarOpen(true);
    }
  }, [error]);

  const validateForm = () => {
    const errors = {};
    
    if (!depositAccount.accountId?.trim()) {
      errors.accountId = isUsingUsername ? "Username is required" : "Account number is required";
    }
    
    if (!depositAccount.amount || parseInt(depositAccount.amount) <= 0) {
      errors.amount = "Amount must be greater than 0";
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleConfirm = async () => {
    if (!validateForm()) return;
    
    try {
      await handleDepositAccount();
      // Add to history
      const newDeposit = {
        id: `DEP${Math.floor(Math.random() * 10000)}`,
        accountId: depositAccount.accountId,
        accountType: isUsingUsername ? 'username' : 'account_number',
        amount: parseInt(depositAccount.amount),
        status: 'Success',
        date: new Date().toISOString(),
        note: depositAccount.note || 'Deposit'
      };
      setDepositHistory([newDeposit, ...depositHistory]);
      
    } catch (err) {
      // Error handled by useEffect
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
    setLocalSuccess('');
    setLocalError('');
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <EmployeeLayout>
      <Container maxWidth="false" sx={{ py: 4, bgcolor: 'background.default', minHeight: '100vh' }}>
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
            severity={localError ? "error" : "success"} 
            sx={{ width: '100%' }}
            icon={localError ? <ClearIcon /> : <SuccessIcon />}
          >
            {localError || localSuccess}
          </Alert>
        </Snackbar>

        <Grid container spacing={3}>
          <Grid item size={{ xs: 12, md: 12 }}>
            <Paper
              elevation={3}
              sx={{
                p: { xs: 2, sm: 3 },
                borderRadius: 'shape.borderRadius',
                bgcolor: 'background.paper',
                height: '100%',
              }}
            >
              <Typography
                variant="h5"
                gutterBottom
                sx={{ fontWeight: 700, color: 'primary.main', display: 'flex', alignItems: 'center' }}
              >
                <MoneyIcon sx={{ mr: 1 }} /> Deposit Funds
              </Typography>
              
              <Divider sx={{ my: 2 }} />
              
              <Card variant="outlined" sx={{ mb: 3, bgcolor: 'background.default' }}>
                <CardContent>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Deposit Method
                  </Typography>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={isUsingUsername}
                        onChange={() => setIsUsingUsername(!isUsingUsername)}
                        color="primary"
                      />
                    }
                    label={isUsingUsername ? "Using Username" : "Using Account Number"}
                  />
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    <InfoIcon fontSize="small" sx={{ verticalAlign: 'middle', mr: 0.5 }} />
                    {isUsingUsername 
                      ? "Deposit using customer username for easier identification"
                      : "Deposit using account number for direct account access"}
                  </Typography>
                </CardContent>
              </Card>
              
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    label={isUsingUsername ? "Username" : "Account Number"}
                    variant="outlined"
                    required
                    fullWidth
                    value={depositAccount.accountId || ''}
                    onChange={e => setDepositAccount(prev => ({ ...prev, accountId: e.target.value }))}
                    error={!!formErrors.accountId}
                    helperText={formErrors.accountId}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          {isUsingUsername ? <UsernameIcon /> : <CardIcon />}
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Amount (VND)"
                    variant="outlined"
                    required
                    fullWidth
                    value={depositAccount.amount ? formatVND(Number(depositAccount.amount)) : ''}
                    onChange={handleDepositAmountChange}
                    error={!!formErrors.amount}
                    helperText={formErrors.amount}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <MoneyIcon />
                        </InputAdornment>
                      ),
                      endAdornment: depositAccount.amount ? (
                        <InputAdornment position="end">
                          <Chip 
                            label="VND" 
                            size="small" 
                            color="primary" 
                            variant="outlined" 
                          />
                        </InputAdornment>
                      ) : null,
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Note (Optional)"
                    variant="outlined"
                    fullWidth
                    multiline
                    rows={2}
                    value={depositAccount.note || ''}
                    onChange={e => setDepositAccount(prev => ({ ...prev, note: e.target.value }))}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start" sx={{ alignSelf: 'flex-start', mt: 1.5 }}>
                          <ReceiptIcon />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
              </Grid>

              <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
                <Button 
                  variant="outlined" 
                  color="secondary" 
                  onClick={resetForm} 
                  sx={{ mr: 2 }}
                  startIcon={<ClearIcon />}
                >
                  Clear
                </Button>
                <Button
                  onClick={handleConfirm}
                  color="primary"
                  variant="contained"
                  disabled={loading}
                  startIcon={<CheckIcon />}
                >
                  {loading ? 'Processing...' : 'Deposit Funds'}
                </Button>
              </Box>
            </Paper>
          </Grid>
          
          <Grid item  size={{ xs: 12, md: 12 }}>
            <Paper
              elevation={3}
              sx={{
                p: { xs: 2, sm: 3 },
                borderRadius: 'shape.borderRadius',
                bgcolor: 'background.paper',
                height: '100%',
              }}
            >
              <Typography
                variant="h5"
                gutterBottom
                sx={{ fontWeight: 700, color: 'primary.main', display: 'flex', alignItems: 'center' }}
              >
                <HistoryIcon sx={{ mr: 1 }} /> Recent Deposits
              </Typography>
              
              <Divider sx={{ my: 2 }} />
              
              <TableContainer component={Paper} elevation={0} sx={{ mt: 2, borderRadius: 2 }}>
                <Table>
                  <TableHead>
                    <TableRow sx={{ backgroundColor: 'primary.light' }}>
                      <TableCell sx={{ fontWeight: 'bold' }}>ID</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Account</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Type</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Amount</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Date</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {depositHistory.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} align="center">
                          No deposit history found
                        </TableCell>
                      </TableRow>
                    ) : (
                      depositHistory
                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                        .map((deposit) => (
                          <TableRow key={deposit.id} hover>
                            <TableCell>{deposit.id}</TableCell>
                            <TableCell>
                              <Tooltip title={deposit.accountType === 'username' ? 'Username' : 'Account Number'}>
                                <span>{deposit.accountId}</span>
                              </Tooltip>
                            </TableCell>
                            <TableCell>
                              <Chip 
                                size="small" 
                                label={deposit.accountType === 'username' ? 'Username' : 'Account #'} 
                                color={deposit.accountType === 'username' ? 'info' : 'secondary'}
                              />
                            </TableCell>
                            <TableCell>
                              {formatVND(deposit.amount)} ₫
                            </TableCell>
                            <TableCell>
                              {new Date(deposit.date).toLocaleString()}
                            </TableCell>
                            <TableCell>
                              <Chip 
                                size="small" 
                                label={deposit.status} 
                                color={deposit.status === 'Success' ? 'success' : 'error'}
                              />
                            </TableCell>
                          </TableRow>
                        ))
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
              
              <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={depositHistory.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </EmployeeLayout>
  );
}
