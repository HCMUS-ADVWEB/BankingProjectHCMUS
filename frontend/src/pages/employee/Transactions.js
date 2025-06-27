import { useState, useEffect, useCallback, useMemo } from 'react';
import EmployeeLayout from '../../layouts/EmployeeLayout';
import {
  Divider,
  Container,
  Grid,
  Typography,
  Box,
  Button,
  TextField,
  InputAdornment,
  Snackbar,
  Alert,
  Paper,
  CircularProgress,
  Backdrop,
  Avatar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  Tooltip,
  IconButton,
  Collapse,
} from '@mui/material';
import {
  CreditCard as CardIcon,
  FilterList as FilterIcon,
  ArrowUpward as ArrowUpwardIcon,
  ArrowDownward as ArrowDownwardIcon,
  Clear as ClearIcon,
  Search as SearchIcon,
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { useEmployeeTransaction } from '../../contexts/employee/EmployeeTransactionContext';

const transactionTypes = [
  { value: 'ALL', label: 'All' },
  { value: 'INTERNAL_TRANSFER', label: 'Internal Transfer' },
  { value: 'INTERBANK_TRANSFER', label: 'Interbank Transfer' },
  { value: 'DEBT_PAYMENT', label: 'Debt Payment' },
  { value: 'DEPOSIT', label: 'Deposit' },
];

const transactionRoles = [
  { value: 'ALL', label: 'All' },
  { value: 'SENDER', label: 'As Sender' },
  { value: 'RECEIVER', label: 'As Receiver' },
];

const transactionStatuses = [
  { value: 'ALL', label: 'All' },
  { value: 'PENDING', label: 'Pending' },
  { value: 'COMPLETED', label: 'Completed' },
  { value: 'FAILED', label: 'Failed' },
  { value: 'CANCELLED', label: 'Cancelled' },
];

export default function TransactionsPage() {
  const {
    form,
    setForm,
    loading,
    error,
    success,
    transactions,
    banks,
    fetchBanks,
    fetchTransactions,
    clearMessages,
  } = useEmployeeTransaction();

  const initFilters = {
    role: 'ALL',
    status: 'ALL',
    bank: 'ALL',
    dateFrom: dayjs().subtract(1, 'month').toDate(),
    dateTo: dayjs().toDate(),
  };

  const [formErrors, setFormErrors] = useState({});
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [filters, setFilters] = useState({ ...initFilters });
  const [sortOrder, setSortOrder] = useState('desc');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [filterOpen, setFilterOpen] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  useEffect(() => {
    fetchBanks();
    return () => clearMessages();
  }, [fetchBanks, clearMessages]);

  useEffect(() => {
    if (transactions.length > 0) {
      setHasSearched(true);
    } else {
      setHasSearched(false);
    }
  }, [transactions]);

  const validateForm = useCallback(() => {
    const errors = {};
    if (!form.accountNumber?.trim()) {
      errors.accountNumber = 'Account number is required';
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  }, [form.accountNumber]);

  const handleSearch = async () => {
    clearMessages();
    setFormErrors({});
    if (!validateForm()) {
      return;
    }
    setHasSearched(true);
    setPage(0);
    await fetchTransactions();
    setSnackbarOpen(true);
  };

  const handleResetForm = () => {
    setForm({ accountNumber: '', type: 'ALL' });
    setFormErrors({});
    setFilters({ ...initFilters });
    setPage(0);
    setSortOrder('desc');
    setFilterOpen(false);
    setHasSearched(false);
    setSnackbarOpen(false);
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  const toggleSortOrder = () => {
    setSortOrder((prev) => (prev === 'desc' ? 'asc' : 'desc'));
    setPage(0);
  };

  const handleFilterChange = (filterType, value) => {
    setFilters((prev) => ({ ...prev, [filterType]: value }));
    setPage(0);
  };

  const filteredTransactions = useMemo(() => {
    if (!hasSearched || transactions.length === 0) return [];

    let result = [...transactions];

    if (filters.role !== 'ALL') {
      result = result.filter((tx) => tx.role === filters.role);
    }

    if (filters.status !== 'ALL') {
      result = result.filter((tx) => tx.status === filters.status);
    }

    if (filters.bank !== 'ALL') {
      result = result.filter((tx) => {
        if (filters.bank === null) {
          // FIN (System) - transactions with null bank IDs
          return !tx.fromBankId || !tx.toBankId;
        }
        return tx.fromBankId === filters.bank || tx.toBankId === filters.bank;
      });
    }

    if (filters.dateFrom) {
      result = result.filter((tx) =>
        dayjs(tx.createdAt).isAfter(dayjs(filters.dateFrom).startOf('day')),
      );
    }

    if (filters.dateTo) {
      result = result.filter((tx) =>
        dayjs(tx.createdAt).isBefore(dayjs(filters.dateTo).endOf('day')),
      );
    }

    result.sort((a, b) => {
      const dateA = dayjs(a.updatedAt);
      const dateB = dayjs(b.updatedAt);
      return sortOrder === 'desc' ? dateB.diff(dateA) : dateA.diff(dateB);
    });

    return result;
  }, [transactions, filters, sortOrder, hasSearched]);

  const paginatedTransactions = useMemo(() => {
    const start = page * rowsPerPage;
    return filteredTransactions.slice(start, start + rowsPerPage);
  }, [filteredTransactions, page, rowsPerPage]);

  const getBankName = (bankId) => {
    if (!bankId) return 'Fintech Hub (FIN - System)';
    const bank = banks.find((b) => b.id === bankId);
    return bank ? bank.bankName : 'Unknown Bank';
  };

  const formatVND = (value) => {
    if (!value) return '0 VND';
    return `${new Intl.NumberFormat('vi-VN').format(value)} VND`;
  };

  const getTypeLabel = (type) => {
    const typeObj = transactionTypes.find((t) => t.value === type);
    return typeObj ? typeObj.label : type;
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'INTERNAL_TRANSFER':
        return '#10b981'; // Green
      case 'INTERBANK_TRANSFER':
        return '#06b6d4'; // Blue
      case 'DEPOSIT':
        return '#f59e0b'; // Yellow
      case 'DEBT_PAYMENT':
        return '#ef4444'; // Red
      default:
        return '#9ca3af'; // Default gray
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'PENDING':
        return '#f59e0b'; // Yellow
      case 'COMPLETED':
        return '#10b981'; // Green
      case 'FAILED':
        return '#ef4444'; // Red
      case 'CANCELLED':
        return '#8b5cf6'; // Purple
      default:
        return '#9ca3af'; // Default gray
    }
  };

  const getRoleColor = (role) => {
    return role === 'SENDER' ? '#10b981' : '#06b6d4'; // Green for sender, Blue for receiver
  };

  const formatAccountNumber = (accountNumber) => {
    if (!accountNumber) return 'N/A';
    return accountNumber.length > 8
      ? `${accountNumber.slice(0, 4)}...${accountNumber.slice(-4)}`
      : accountNumber;
  };

  const isFilterActive = () => {
    return (
      filters.role !== 'ALL' ||
      filters.status !== 'ALL' ||
      filters.bank !== 'ALL'
    );
  };

  return (
    <EmployeeLayout>
      <Container
        maxWidth="2xl"
        sx={{ py: 4, bgcolor: 'background.default', minHeight: '100vh' }}
      >
        <Backdrop
          sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={loading}
        >
          <CircularProgress color="inherit" />
        </Backdrop>

        {(error || success) && (
          <Snackbar
            open={snackbarOpen}
            autoHideDuration={5000}
            onClose={handleCloseSnackbar}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          >
            <Alert
              onClose={handleCloseSnackbar}
              severity={error ? 'error' : success ? 'success' : 'error'}
              sx={{ width: '100%' }}
            >
              {error || success}
            </Alert>
          </Snackbar>
        )}

        {/* Header Section */}
        <Box
          sx={{
            mb: 6,
            p: 3,
            borderRadius: 'shape.borderRadius',
            bgcolor: 'background.paper',
            backdropFilter: 'blur(8px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            animation: 'fadeIn 1s ease-in-out',
            '@keyframes fadeIn': {
              '0%': { opacity: 0, transform: 'translateY(-20px)' },
              '100%': { opacity: 1, transform: 'translateY(0)' },
            },
          }}
        >
          <Typography
            variant="h3"
            sx={{
              fontWeight: 700,
              color: 'text.primary',
              mb: 1,
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <Avatar
              sx={{
                bgcolor: 'linear-gradient(to right, #10b981, #06b6d4)',
                color: 'white',
                mr: 2,
                width: 40,
                height: 40,
              }}
            >
              <CardIcon />
            </Avatar>
            Transaction History
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Search and view detailed transaction history for customer accounts.
          </Typography>
        </Box>

        {/* Search Form */}
        <Paper
          elevation={3}
          sx={{
            p: { xs: 2, sm: 3 },
            borderRadius: 'shape.borderRadius',
            bgcolor: 'background.paper',
            mb: 5,
            transition: 'all 0.3s ease',
            '&:hover': {
              transform: 'translateY(-4px)',
              boxShadow: '0 16px 40px rgba(0, 0, 0, 0.2)',
            },
          }}
        >
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              mb: 3,
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Search Transactions
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Tooltip title={filterOpen ? 'Hide Filters' : 'Show Filters'}>
                <IconButton
                  onClick={() => setFilterOpen(!filterOpen)}
                  sx={{
                    bgcolor: isFilterActive() ? 'primary.main' : 'transparent',
                    color: isFilterActive() ? 'white' : 'text.primary',
                    '&:hover': {
                      bgcolor: isFilterActive()
                        ? 'primary.dark'
                        : 'action.hover',
                    },
                  }}
                >
                  <FilterIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Clear All">
                <IconButton onClick={handleResetForm} color="secondary">
                  <ClearIcon />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>

          <Grid container spacing={2}>
            <Grid item size={{ xs: 12, sm: 6 }}>
              <TextField
                label="Account Number"
                placeholder="Enter account number to search"
                variant="outlined"
                fullWidth
                value={form.accountNumber}
                onChange={(e) => setForm({ accountNumber: e.target.value })}
                error={!!formErrors.accountNumber}
                helperText={formErrors.accountNumber}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <CardIcon />
                      </InputAdornment>
                    ),
                  },
                }}
              />
            </Grid>
            <Grid item size={{ xs: 12, sm: 6 }}>
              <FormControl fullWidth variant="outlined">
                <InputLabel>Transaction Type</InputLabel>
                <Select
                  value={form.type}
                  onChange={(e) => setForm({ type: e.target.value })}
                  label="Transaction Type"
                >
                  {transactionTypes.map((type) => (
                    <MenuItem key={type.value} value={type.value}>
                      {type.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>

          {/* Advanced Filters */}
          <Collapse in={filterOpen}>
            <Box>
              <Divider sx={{ my: 4 }} />
              <Grid container spacing={2}>
                <Grid item size={{ sm: 12, md: 4 }}>
                  <FormControl fullWidth size="medium">
                    <InputLabel>Role</InputLabel>
                    <Select
                      value={filters.role}
                      onChange={(e) =>
                        handleFilterChange('role', e.target.value)
                      }
                      label="Role"
                    >
                      {transactionRoles.map((role) => (
                        <MenuItem key={role.value} value={role.value}>
                          {role.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item size={{ sm: 12, md: 4 }}>
                  <FormControl fullWidth size="medium">
                    <InputLabel>Status</InputLabel>
                    <Select
                      value={filters.status}
                      onChange={(e) =>
                        handleFilterChange('status', e.target.value)
                      }
                      label="Status"
                    >
                      {transactionStatuses.map((status) => (
                        <MenuItem key={status.value} value={status.value}>
                          {status.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item size={{ sm: 12, md: 4 }}>
                  <FormControl fullWidth size="medium">
                    <InputLabel>Bank</InputLabel>
                    <Select
                      value={filters.bank}
                      onChange={(e) =>
                        handleFilterChange('bank', e.target.value)
                      }
                      label="Bank"
                    >
                      <MenuItem value="ALL">All Banks</MenuItem>
                      <MenuItem value={null}>
                        Fintech Hub (FIN - System)
                      </MenuItem>
                      {banks.map((bank) => (
                        <MenuItem key={bank.id} value={bank.id}>
                          {bank.bankName} ({bank.bankCode})
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item size={{ xs: 12, sm: 6 }}>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      label="Date From"
                      format="DD/MM/YYYY"
                      value={filters.dateFrom ? dayjs(filters.dateFrom) : null}
                      onChange={(newValue) =>
                        handleFilterChange(
                          'dateFrom',
                          newValue ? newValue.format('YYYY-MM-DD') : null,
                        )
                      }
                      slotProps={{
                        textField: {
                          variant: 'outlined',
                          fullWidth: true,
                          size: 'medium',
                        },
                      }}
                    />
                  </LocalizationProvider>
                </Grid>
                <Grid item size={{ xs: 12, sm: 6 }}>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      label="Date To"
                      format="DD/MM/YYYY"
                      value={filters.dateTo ? dayjs(filters.dateTo) : null}
                      onChange={(newValue) =>
                        handleFilterChange(
                          'dateTo',
                          newValue ? newValue.format('YYYY-MM-DD') : null,
                        )
                      }
                      slotProps={{
                        textField: {
                          variant: 'outlined',
                          fullWidth: true,
                          size: 'medium',
                        },
                      }}
                    />
                  </LocalizationProvider>
                </Grid>
              </Grid>
            </Box>
          </Collapse>

          <Box
            sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3, gap: 2 }}
          >
            <Button
              onClick={handleSearch}
              color="primary"
              variant="contained"
              disabled={loading}
              startIcon={
                loading ? <CircularProgress size={16} /> : <SearchIcon />
              }
              sx={{
                bgcolor: 'linear-gradient(to right, #10b981, #06b6d4)',
                '&:hover': {
                  bgcolor: 'linear-gradient(to right, #0a8f63, #0590a8)',
                },
                minWidth: 140,
              }}
            >
              {loading ? 'Searching...' : 'Search'}
            </Button>
          </Box>
        </Paper>

        {/* Results Section */}
        {hasSearched && (
          <Paper
            elevation={3}
            sx={{
              borderRadius: 'shape.borderRadius',
              bgcolor: 'background.paper',
              overflow: 'hidden',
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: (theme) => theme.shadows[8],
              },
            }}
          >
            {/* Results Header */}
            <Box sx={{ p: 3, borderBottom: 1, borderColor: 'divider' }}>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Transaction Results
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Found {filteredTransactions.length} transactions
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Tooltip
                    title={`${sortOrder === 'desc' ? 'Newest First' : 'Oldest First'}`}
                  >
                    <IconButton
                      onClick={toggleSortOrder}
                      sx={{
                        bgcolor: 'primary.main',
                        color: 'white',
                        '&:hover': { bgcolor: 'primary.dark' },
                      }}
                    >
                      {sortOrder === 'desc' ? (
                        <ArrowDownwardIcon />
                      ) : (
                        <ArrowUpwardIcon />
                      )}
                    </IconButton>
                  </Tooltip>
                </Box>
              </Box>
            </Box>

            {filteredTransactions.length === 0 ? (
              <Box sx={{ p: 6, textAlign: 'center' }}>
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  No transactions found
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Try adjusting your search criteria or filters
                </Typography>
              </Box>
            ) : (
              <>
                <TableContainer sx={{ borderRadius: 0 }}>
                  <Table stickyHeader>
                    <TableHead>
                      <TableRow>
                        <TableCell
                          sx={{ fontWeight: 600, bgcolor: 'background.paper' }}
                        >
                          ID
                        </TableCell>
                        <TableCell
                          sx={{
                            fontWeight: 600,
                            bgcolor: 'background.paper',
                            textAlign: 'center',
                          }}
                        >
                          Type
                        </TableCell>
                        <TableCell
                          sx={{
                            fontWeight: 600,
                            bgcolor: 'background.paper',
                            textAlign: 'center',
                          }}
                        >
                          Role
                        </TableCell>
                        <TableCell
                          sx={{ fontWeight: 600, bgcolor: 'background.paper' }}
                        >
                          From
                        </TableCell>
                        <TableCell
                          sx={{ fontWeight: 600, bgcolor: 'background.paper' }}
                        >
                          To
                        </TableCell>
                        <TableCell
                          sx={{ fontWeight: 600, bgcolor: 'background.paper' }}
                        >
                          Amount
                        </TableCell>
                        <TableCell
                          sx={{
                            fontWeight: 600,
                            bgcolor: 'background.paper',
                            textAlign: 'center',
                          }}
                        >
                          Status
                        </TableCell>
                        <TableCell
                          sx={{
                            fontWeight: 600,
                            bgcolor: 'background.paper',
                            textAlign: 'right',
                          }}
                        >
                          Date
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {paginatedTransactions.map((tx) => (
                        <TableRow
                          key={tx.id}
                          sx={{
                            '&:hover': { opacity: 0.8, cursor: 'pointer' },
                          }}
                        >
                          <TableCell>
                            <Tooltip title={tx.id}>
                              <Typography
                                variant="body2"
                                sx={{ fontFamily: 'monospace' }}
                              >
                                {tx.id.slice(0, 5)}...
                              </Typography>
                            </Tooltip>
                          </TableCell>
                          <TableCell sx={{ textAlign: 'center' }}>
                            <Chip
                              size="small"
                              variant="outlined"
                              label={getTypeLabel(tx.transactionType)}
                              sx={{
                                borderColor: getTypeColor(tx.transactionType),
                                color: getTypeColor(tx.transactionType),
                              }}
                            />
                          </TableCell>
                          <TableCell sx={{ textAlign: 'center' }}>
                            <Chip
                              label={getTypeLabel(tx.role)}
                              size="small"
                              sx={{
                                background: getRoleColor(tx.role),
                                color: 'white',
                                fontWeight: 600,
                              }}
                            />
                          </TableCell>
                          <TableCell>
                            <Box>
                              <Typography
                                variant="body2"
                                sx={{ fontFamily: 'monospace' }}
                              >
                                {formatAccountNumber(tx.fromAccountNumber)}{' '}
                                {tx.fromAccountNumber === form.accountNumber &&
                                !tx.fromBankId
                                  ? ' (Self)'
                                  : ''}
                              </Typography>
                              <Typography
                                variant="caption"
                                color="text.secondary"
                              >
                                {getBankName(tx.fromBankId)}
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Box>
                              <Typography
                                variant="body2"
                                sx={{ fontFamily: 'monospace' }}
                              >
                                {formatAccountNumber(tx.toAccountNumber)}{' '}
                                {tx.toAccountNumber === form.accountNumber &&
                                !tx.toBankId
                                  ? ' (Self)'
                                  : ''}
                              </Typography>
                              <Typography
                                variant="caption"
                                color="text.secondary"
                              >
                                {getBankName(tx.toBankId)}
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Typography
                              variant="body2"
                              sx={{
                                fontWeight: 600,
                                color:
                                  tx.role === 'SENDER'
                                    ? 'error.main'
                                    : 'success.main',
                              }}
                            >
                              {tx.role === 'SENDER' ? (
                                <ArrowDownwardIcon fontSize="small" />
                              ) : (
                                <ArrowUpwardIcon fontSize="small" />
                              )}
                              {formatVND(tx.amount)}
                            </Typography>
                          </TableCell>
                          <TableCell sx={{ textAlign: 'center' }}>
                            <Chip
                              label={tx.status}
                              size="small"
                              sx={{
                                background: getStatusColor(tx.status),
                                color: 'white',
                                fontWeight: 600,
                              }}
                            />
                          </TableCell>
                          <TableCell sx={{ textAlign: 'right' }}>
                            <Box>
                              <Typography variant="body2">
                                {dayjs(tx.updatedAt).format('DD/MM/YYYY')}
                              </Typography>
                              <Typography
                                variant="caption"
                                color="text.secondary"
                              >
                                {dayjs(tx.updatedAt).format('HH:mm:ss')}
                              </Typography>
                            </Box>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
                <TablePagination
                  component="div"
                  count={filteredTransactions.length}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  onPageChange={(e, newPage) => setPage(newPage)}
                  onRowsPerPageChange={(e) => {
                    setRowsPerPage(parseInt(e.target.value, 10));
                    setPage(0);
                  }}
                  sx={{ borderTop: 1, borderColor: 'divider' }}
                />
              </>
            )}
          </Paper>
        )}
      </Container>
    </EmployeeLayout>
  );
}
