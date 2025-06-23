import { useEffect, useState } from 'react';
import CustomerLayout from '../../layouts/CustomerLayout';
import api from '../../utils/api';
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
} from '@mui/material';
import {
  MonetizationOn as DebtIcon,
  Schedule as PendingIcon,
  CheckCircle as PaidIcon,
  Cancel as CancelledIcon,
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
  const [debts, setDebts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [status, setStatus] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [total, setTotal] = useState(0);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [orderBy, setOrderBy] = useState('createdAt');
  const [order, setOrder] = useState('desc');

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
        setTotal(res.data.data?.length || 0);
        setError(null);
      })
      .catch(err => {
        const errorMsg = err.response?.data?.message || err.message;
        setError(errorMsg);
        setSnackbarOpen(true);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchDebts(); }, [status, page, rowsPerPage]);

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
  const getSortedDebts = () => {
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

  const sortedDebts = getSortedDebts();

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
            <DebtIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
            Debt Reminders
          </Typography>
          
          <TextField
            select
            label="Status"
            value={status}
            onChange={(e) => { setStatus(e.target.value); setPage(0); }}
            size="small"
            sx={{ minWidth: 150 }}
          >
            {statusOptions.map(opt => (
              <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
            ))}
          </TextField>
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
                {sortedDebts.map((debt) => (
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
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            component="div"
            count={total}
            page={page}
            onPageChange={(e, newPage) => setPage(newPage)}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={e => {
              setRowsPerPage(parseInt(e.target.value, 10));
              setPage(0);
            }}
            rowsPerPageOptions={[5, 10, 25, 50]}
          />
        </Paper>
      </Container>
    </CustomerLayout>
  );
}
