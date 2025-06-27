import { useState, useEffect, useCallback, useMemo } from 'react';
import CustomerLayout from '../../layouts/CustomerLayout';
import {
  Divider,
  Container,
  Grid,
  Typography,
  Box,
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
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { useTransaction } from '../../contexts/customer/TransactionContext';
import { formatVND } from '../../utils/constants';

const transactionTypes = [
  { value: 'ALL', label: 'All' },
  { value: 'INTERNAL_TRANSFER', label: 'Internal Transfer' },
  { value: 'INTERBANK_TRANSFER', label: 'Interbank Transfer' },
  { value: 'DEBT_PAYMENT', label: 'Debt Payment' },
  { value: 'DEPOSIT', label: 'Deposit' },
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

  const initFilters = {
    type: 'ALL',
    status: 'ALL',
    dateFrom: dayjs().subtract(1, 'month').toDate(),
    dateTo: dayjs().toDate(),
  };

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [filters, setFilters] = useState({ ...initFilters });
  const [sortOrder, setSortOrder] = useState('desc');
  const [filterOpen, setFilterOpen] = useState(false);
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

  const handleResetFilters = () => {
    setFilters({ ...initFilters });
    setSortOrder('desc');
    setFilterOpen(false);
    setSnackbarOpen(false);
  };

  const toggleSortOrder = () => {
    setSortOrder((prev) => (prev === 'desc' ? 'asc' : 'desc'));
  };

  const handleFilterChange = (filterType, value) => {
    setFilters((prev) => ({ ...prev, [filterType]: value }));
  };

  const filteredTransactions = useMemo(() => {
    if (!allTransactions || allTransactions.length === 0) return [];

    let result = [...allTransactions];

    if (filters.type !== 'ALL') {
      result = result.filter((tx) => tx.transactionType === filters.type);
    }

    if (filters.status !== 'ALL') {
      result = result.filter((tx) => tx.status === filters.status);
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
      const dateA = dayjs(a.updatedAt || a.createdAt);
      const dateB = dayjs(b.updatedAt || b.createdAt);
      return sortOrder === 'desc' ? dateB.diff(dateA) : dateA.diff(dateB);
    });

    return result;
  }, [allTransactions, filters, sortOrder]);

  const paginatedTransactions = useMemo(() => {
    const start = pagination.page * pagination.rowsPerPage;
    return filteredTransactions.slice(start, start + pagination.rowsPerPage);
  }, [filteredTransactions, pagination.page, pagination.rowsPerPage]);

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

  const formatAccountNumber = (accountNumber) => {
    if (!accountNumber) return 'N/A';
    return accountNumber.length > 8
      ? `${accountNumber.slice(0, 4)}...${accountNumber.slice(-4)}`
      : accountNumber;
  };

  const isFilterActive = () => {
    return filters.type !== 'ALL' || filters.status !== 'ALL';
  };

  const onChangePage = (event, newPage) => {
    contextChangePage(event, newPage);
  };

  const onChangeRowsPerPage = (event) => {
    contextChangeRowsPerPage(event);
  };

  return (
    <CustomerLayout>
      <Container
        maxWidth="xl"
        sx={{ py: 4, bgcolor: 'background.default', minHeight: '100vh' }}
      >
        <Backdrop
          sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={loading}
        >
          <CircularProgress color="inherit" />
        </Backdrop>

        {error && (
          <Snackbar
            open={snackbarOpen}
            autoHideDuration={5000}
            onClose={handleCloseSnackbar}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          >
            <Alert
              onClose={handleCloseSnackbar}
              severity="error"
              sx={{ width: '100%' }}
            >
              {error}
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
            Transaction History 📊
          </Typography>
          <Typography variant="body1" color="text.secondary">
            View and track all of your account transactions in one place.
          </Typography>
        </Box>

        {/* Filter Section */}
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
              Filter Transactions
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
                <IconButton onClick={handleResetFilters} color="secondary">
                  <ClearIcon />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>

          <Grid container spacing={2} justifyContent="flex-end">
            <Grid item size={{ xs: 12, sm: 4 }}>
              <FormControl fullWidth variant="outlined">
                <InputLabel>Transaction Type</InputLabel>
                <Select
                  value={filters.type}
                  onChange={(e) => handleFilterChange('type', e.target.value)}
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
                <Grid item xs={12} sm={6}>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      label="Date From"
                      format="DD/MM/YYYY"
                      value={filters.dateFrom ? dayjs(filters.dateFrom) : null}
                      onChange={(newValue) =>
                        handleFilterChange(
                          'dateFrom',
                          newValue ? newValue.toDate() : null,
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
                <Grid item xs={12} sm={6}>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      label="Date To"
                      format="DD/MM/YYYY"
                      value={filters.dateTo ? dayjs(filters.dateTo) : null}
                      onChange={(newValue) =>
                        handleFilterChange(
                          'dateTo',
                          newValue ? newValue.toDate() : null,
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
        </Paper>

        {/* Results Section */}
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
                Try adjusting your filters or check back later
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
                        Direction
                      </TableCell>
                      <TableCell
                        sx={{ fontWeight: 600, bgcolor: 'background.paper' }}
                      >
                        Account
                      </TableCell>
                      <TableCell
                        sx={{ fontWeight: 600, bgcolor: 'background.paper' }}
                      >
                        Message
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
                              {tx.id.slice(0, 8)}...
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
                            label={
                              tx.direction === 'outgoing' ? 'Sent' : 'Received'
                            }
                            size="small"
                            sx={{
                              background:
                                tx.direction === 'outgoing'
                                  ? '#ef4444'
                                  : '#10b981',
                              color: 'white',
                              fontWeight: 600,
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          <Typography
                            variant="body2"
                            sx={{ fontFamily: 'monospace' }}
                          >
                            {tx.direction === 'outgoing'
                              ? formatAccountNumber(tx.toAccountNumber)
                              : formatAccountNumber(tx.fromAccountNumber)}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {tx.message || 'No message'}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography
                            variant="body2"
                            sx={{
                              fontWeight: 600,
                              color:
                                tx.direction === 'outgoing'
                                  ? 'error.main'
                                  : 'success.main',
                            }}
                          >
                            {tx.direction === 'outgoing' ? (
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
                              {dayjs(tx.createdAt).format('DD/MM/YYYY')}
                            </Typography>
                            <Typography
                              variant="caption"
                              color="text.secondary"
                            >
                              {dayjs(tx.createdAt).format('HH:mm:ss')}
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
                rowsPerPage={pagination.rowsPerPage}
                page={pagination.page}
                onPageChange={onChangePage}
                onRowsPerPageChange={onChangeRowsPerPage}
                rowsPerPageOptions={[5, 10, 25, 50]}
                sx={{ borderTop: 1, borderColor: 'divider' }}
              />
            </>
          )}
        </Paper>
      </Container>
    </CustomerLayout>
  );
}
