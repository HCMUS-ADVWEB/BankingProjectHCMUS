import { useState, useEffect } from 'react';
import EmployeeLayout from '../../layouts/EmployeeLayout';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Button,
  ToggleButton,
  ToggleButtonGroup,
  TextField,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Box,
  InputAdornment,
  Chip,
  Divider,
  Snackbar,
  CircularProgress,
  Backdrop,
  Card,
  CardContent,
  IconButton,
  Tooltip,
  MenuItem,
  Select,
  FormControl,
  TablePagination,
  TableSortLabel,

} from '@mui/material';
import {
  Search as SearchIcon,
  FilterList as FilterIcon,
  Refresh as RefreshIcon,
  AccountCircle as AccountIcon,
  CalendarToday as CalendarIcon,
  ReceiptLong as ReceiptIcon,
  SyncAlt as TransferIcon,
  Payment as PaymentIcon,
  Send as SendIcon,
  CloudDownload as DownloadIcon,
  FilterAlt as FilterAltIcon,
  AttachMoney as MoneyIcon,
  History as HistoryIcon
} from '@mui/icons-material';
import { useEmployee } from '../../contexts/EmployeeContext';
import { TRANSACTION_TYPES } from '../../utils/constants';

// Transaction type icons mapping
const transactionTypeIcons = {
  'INTERNAL_TRANSFER': <TransferIcon />,
  'INTERBANK_TRANSFER': <SendIcon />,
  'DEBT_PAYMENT': <PaymentIcon />,
  'DEPOSIT': <MoneyIcon />
};

// Transaction status colors
const statusColors = {
  'PENDING': 'warning',
  'COMPLETED': 'success',
  'FAILED': 'error',
  'PROCESSING': 'info'
};

export default function TransactionsPage() {
  const {
    transactionAccountHistory,
    setTransactionAccountHistory,
    fetchTransactions,
    loading,
    error,
    success,
    transactions,
    formatVND
  } = useEmployee();
  
  // State
  const [localSuccess, setLocalSuccess] = useState('');
  const [localError, setLocalError] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [orderBy, setOrderBy] = useState('createdAt');
  const [order, setOrder] = useState('desc');
  const [dateRange, setDateRange] = useState({
    startDate: '',
    endDate: ''
  });
  const [advancedFilters, setAdvancedFilters] = useState(false);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [amountRange, setAmountRange] = useState({
    min: '',
    max: ''
  });

  // Handle success and error messages
  useEffect(() => {
    if (success) {
      setLocalSuccess(success);
      setSnackbarOpen(true);
    }
  }, [success]);

  useEffect(() => {
    if (error) {
      setLocalError(error);
      setSnackbarOpen(true);
    }
  }, [error]);

  const validateForm = () => {
    const errors = {};
    
    if (!transactionAccountHistory.accountId?.trim()) {
      errors.accountId = "Account ID is required";
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSearch = async () => {
    if (!validateForm()) return;
    
    try {
      await fetchTransactions(transactionAccountHistory.accountId, { 
        limit: 50, 
        pn: 1,
        startDate: dateRange.startDate || undefined,
        endDate: dateRange.endDate || undefined,
        minAmount: amountRange.min || undefined,
        maxAmount: amountRange.max || undefined
      });
      resetFilters();
    } catch (err) {
      // Error is handled by the effect
    }
  };

  const resetFilters = () => {
    setDateRange({ startDate: '', endDate: '' });
    setAmountRange({ min: '', max: '' });
    setStatusFilter('ALL');
    setAdvancedFilters(false);
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

  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  // Sort and filter transactions
  const getFilteredTransactions = () => {
    // First filter by transaction type
    let filtered = transactionAccountHistory.type === 'ALL'
      ? transactions
      : transactions.filter(tx => tx.transactionType === transactionAccountHistory.type);
    
    // Then filter by status if not ALL
    if (statusFilter !== 'ALL') {
      filtered = filtered.filter(tx => tx.status === statusFilter);
    }
    
    // Sort the filtered transactions
    return filtered.sort((a, b) => {
      const aValue = a[orderBy];
      const bValue = b[orderBy];
      
      if (orderBy === 'amount' || orderBy === 'fee') {
        return order === 'asc' 
          ? Number(aValue) - Number(bValue) 
          : Number(bValue) - Number(aValue);
      }
      
      if (orderBy === 'createdAt') {
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

  const filteredTransactions = getFilteredTransactions();

  return (
    <EmployeeLayout>
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
            severity={localError ? "error" : "success"} 
            sx={{ width: '100%' }}
          >
            {localError || localSuccess}
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
            mb: 4,
            borderRadius: 'shape.borderRadius',
            bgcolor: 'background.paper',
          }}
        >
          <Grid container spacing={3}>
            <Grid item xs={12} md={8}>
              <TextField
                label="Account ID or Username"
                variant="outlined"
                fullWidth
                value={transactionAccountHistory.accountId || ''}
                onChange={e => setTransactionAccountHistory(prev => ({ ...prev, accountId: e.target.value }))}
                error={!!formErrors.accountId}
                helperText={formErrors.accountId}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <AccountIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} md={4} sx={{ display: 'flex', alignItems: 'center' }}>
              <Button
                onClick={handleSearch}
                color="primary"
                variant="contained"
                startIcon={<SearchIcon />}
                disabled={loading}
                sx={{ mr: 1, height: 56 }}
                fullWidth
              >
                {loading ? <CircularProgress size={24} color="inherit" /> : 'Search'}
              </Button>
              
              <Tooltip title="Advanced Filters">
                <IconButton 
                  color={advancedFilters ? "primary" : "default"} 
                  onClick={() => setAdvancedFilters(!advancedFilters)}
                  sx={{ height: 56, width: 56 }}
                >
                  <FilterAltIcon />
                </IconButton>
              </Tooltip>
            </Grid>
          </Grid>

          {advancedFilters && (
            <Box sx={{ mt: 3, p: 2, bgcolor: 'background.default', borderRadius: 1 }}>
              <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600, color: 'text.secondary' }}>
                Advanced Filters
              </Typography>
              
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" gutterBottom>
                    Date Range
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <TextField
                        label="Start Date"
                        type="date"
                        fullWidth
                        InputLabelProps={{ shrink: true }}
                        value={dateRange.startDate}
                        onChange={(e) => setDateRange({ ...dateRange, startDate: e.target.value })}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <CalendarIcon fontSize="small" />
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        label="End Date"
                        type="date"
                        fullWidth
                        InputLabelProps={{ shrink: true }}
                        value={dateRange.endDate}
                        onChange={(e) => setDateRange({ ...dateRange, endDate: e.target.value })}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <CalendarIcon fontSize="small" />
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Grid>
                  </Grid>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" gutterBottom>
                    Amount Range (VND)
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <TextField
                        label="Min Amount"
                        fullWidth
                        value={amountRange.min ? formatVND(Number(amountRange.min)) : ''}
                        onChange={(e) => {
                          const raw = e.target.value.replace(/\D/g, '');
                          setAmountRange({ ...amountRange, min: raw });
                        }}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <MoneyIcon fontSize="small" />
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        label="Max Amount"
                        fullWidth
                        value={amountRange.max ? formatVND(Number(amountRange.max)) : ''}
                        onChange={(e) => {
                          const raw = e.target.value.replace(/\D/g, '');
                          setAmountRange({ ...amountRange, max: raw });
                        }}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <MoneyIcon fontSize="small" />
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Grid>
                  </Grid>
                </Grid>
                
                <Grid item xs={12}>
                  <Typography variant="subtitle2" gutterBottom>
                    Transaction Status
                  </Typography>
                  <FormControl fullWidth>
                    <Select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      size="small"
                    >
                      <MenuItem value="ALL">All Statuses</MenuItem>
                      <MenuItem value="COMPLETED">Completed</MenuItem>
                      <MenuItem value="PENDING">Pending</MenuItem>
                      <MenuItem value="FAILED">Failed</MenuItem>
                      <MenuItem value="PROCESSING">Processing</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            </Box>
          )}
          
          <Box sx={{ mt: 3, mb: 2 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
              Transaction Type
            </Typography>
            <ToggleButtonGroup
              value={transactionAccountHistory.type}
              exclusive
              onChange={(e, newValue) => {
                if (newValue) setTransactionAccountHistory(prev => ({ ...prev, type: newValue }));
              }}
              color="primary"
              sx={{ flexWrap: 'wrap' }}
            >
              <ToggleButton value="ALL" sx={{ py: 1, px: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <FilterIcon sx={{ mr: 1 }} /> All Types
                </Box>
              </ToggleButton>
              {TRANSACTION_TYPES.map(type => (
                <ToggleButton key={type.value} value={type.value} sx={{ py: 1, px: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    {transactionTypeIcons[type.value] || <ReceiptIcon />}
                    <Box sx={{ ml: 1 }}>{type.label}</Box>
                  </Box>
                </ToggleButton>
              ))}
            </ToggleButtonGroup>
          </Box>
          
          <Divider sx={{ my: 3 }} />
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Transaction Results
              {filteredTransactions.length > 0 && (
                <Chip 
                  label={`${filteredTransactions.length} transactions`} 
                  size="small" 
                  color="primary" 
                  sx={{ ml: 1 }} 
                />
              )}
            </Typography>
            
            <Box>
              <Tooltip title="Refresh">
                <IconButton onClick={handleSearch} disabled={!transactionAccountHistory.accountId}>
                  <RefreshIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Export CSV">
                <IconButton disabled={filteredTransactions.length === 0}>
                  <DownloadIcon />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>
          
          <TableContainer 
            component={Paper} 
            elevation={0} 
            sx={{ 
              borderRadius: 2,
              maxHeight: 600,
              overflow: 'auto'
            }}
          >
            <Table stickyHeader>
              <TableHead>
                <TableRow sx={{ backgroundColor: 'primary.light' }}>
                  <TableCell sx={{ fontWeight: 'bold' }}>
                    <TableSortLabel
                      active={orderBy === 'id'}
                      direction={orderBy === 'id' ? order : 'asc'}
                      onClick={() => handleRequestSort('id')}
                    >
                      ID
                    </TableSortLabel>
                  </TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Type</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>From</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>To</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>
                    <TableSortLabel
                      active={orderBy === 'amount'}
                      direction={orderBy === 'amount' ? order : 'asc'}
                      onClick={() => handleRequestSort('amount')}
                    >
                      Amount
                    </TableSortLabel>
                  </TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>
                    <TableSortLabel
                      active={orderBy === 'fee'}
                      direction={orderBy === 'fee' ? order : 'asc'}
                      onClick={() => handleRequestSort('fee')}
                    >
                      Fee
                    </TableSortLabel>
                  </TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>
                    <TableSortLabel
                      active={orderBy === 'createdAt'}
                      direction={orderBy === 'createdAt' ? order : 'asc'}
                      onClick={() => handleRequestSort('createdAt')}
                    >
                      Date
                    </TableSortLabel>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading && (
                  <TableRow>
                    <TableCell colSpan={8} align="center" sx={{ py: 3 }}>
                      <CircularProgress size={24} sx={{ mr: 1 }} />
                      Loading transactions...
                    </TableCell>
                  </TableRow>
                )}
                
                {!loading && filteredTransactions.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={8} align="center" sx={{ py: 3 }}>
                      {transactionAccountHistory.accountId ? 
                        "No transactions found with the current filters" : 
                        "Enter an account ID and click Search to view transactions"}
                    </TableCell>
                  </TableRow>
                )}
                
                {!loading && filteredTransactions
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((tx) => (
                    <TableRow 
                      key={tx.id} 
                      hover
                      sx={{ 
                        cursor: 'pointer',
                        '&:hover': { bgcolor: 'action.hover' }
                      }}
                    >
                      <TableCell>
                        <Tooltip title="Transaction ID">
                          <span>{tx.id?.substring(0, 8)}</span>
                        </Tooltip>
                      </TableCell>
                      <TableCell>
                        <Chip
                          icon={transactionTypeIcons[tx.transactionType] || <ReceiptIcon />}
                          label={tx.transactionType?.replace('_', ' ')}
                          size="small"
                          color="primary"
                          variant="outlined"
                        />
                      </TableCell>
                      <TableCell>
                        <Tooltip title={tx.fromBankId ? `Bank: ${tx.fromBankId}` : 'Internal Account'}>
                          <span>{tx.fromAccountNumber || '—'}</span>
                        </Tooltip>
                      </TableCell>
                      <TableCell>
                        <Tooltip title={tx.toBankId ? `Bank: ${tx.toBankId}` : 'Internal Account'}>
                          <span>{tx.toAccountNumber || '—'}</span>
                        </Tooltip>
                      </TableCell>
                      <TableCell sx={{ fontWeight: 'medium' }}>
                        {formatVND(tx.amount)} ₫
                      </TableCell>
                      <TableCell>
                        {formatVND(tx.fee)} ₫
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={tx.status}
                          size="small"
                          color={statusColors[tx.status] || 'default'}
                        />
                      </TableCell>
                      <TableCell>
                        {new Date(tx.createdAt).toLocaleString()}
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
          
          <TablePagination
            rowsPerPageOptions={[10, 25, 50, 100]}
            component="div"
            count={filteredTransactions.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
          
          {filteredTransactions.length > 0 && (
            <Box sx={{ mt: 2, p: 2, bgcolor: 'background.default', borderRadius: 2 }}>
              <Typography variant="subtitle2" gutterBottom>
                Transaction Summary
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={6} sm={3}>
                  <Card variant="outlined">
                    <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                      <Typography variant="caption" color="text.secondary">
                        Total Amount
                      </Typography>
                      <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                        {formatVND(filteredTransactions.reduce((sum, tx) => sum + Number(tx.amount), 0))} ₫
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Card variant="outlined">
                    <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                      <Typography variant="caption" color="text.secondary">
                        Total Fees
                      </Typography>
                      <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                        {formatVND(filteredTransactions.reduce((sum, tx) => sum + Number(tx.fee), 0))} ₫
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Card variant="outlined">
                    <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                      <Typography variant="caption" color="text.secondary">
                        Completed
                      </Typography>
                      <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'success.main' }}>
                        {filteredTransactions.filter(tx => tx.status === 'COMPLETED').length}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Card variant="outlined">
                    <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                      <Typography variant="caption" color="text.secondary">
                        Pending/Failed
                      </Typography>
                      <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'warning.main' }}>
                        {filteredTransactions.filter(tx => tx.status !== 'COMPLETED').length}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </Box>
          )}
        </Paper>
      </Container>
    </EmployeeLayout>
  );
}
