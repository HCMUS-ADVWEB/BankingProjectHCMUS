import React, { useState } from 'react';
import CustomerLayout from '../../layouts/CustomerLayout';
import { useDebt } from '../../contexts/customer/DebtContext';
import CreateDebtReminderDialog from '../../components/CreateDebtReminderDialog';
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
  Fab,
  Tooltip,
} from '@mui/material';
import {
  Schedule as PendingIcon,
  CheckCircle as PaidIcon,
  Cancel as CancelledIcon,
  Send as SentIcon,
  Inbox as ReceivedIcon,
  DeleteOutline as DeleteIcon,
  Payment as PaymentIcon,
  Add as AddIcon,
} from '@mui/icons-material';

// Status colors and icons mapping
const statusConfig = {
  PENDING: { color: 'warning', icon: <PendingIcon /> },
  PAID: { color: 'success', icon: <PaidIcon /> },
  CANCELLED: { color: 'error', icon: <CancelledIcon /> },
};

export default function DebtsPage() {
  const {
    loading,
    error,
    pagination,
    sort,
    currentTab,
    sortedDebts,
    fetchDebtReminders,
    cancelDebtReminder,
    requestOtpForPayDebt,
    payDebtReminder,
    handleChangePage: contextChangePage,
    handleChangeRowsPerPage: contextChangeRowsPerPage,
    handleRequestSort: contextRequestSort,
    handleStatusChange: contextStatusChange,
    handleTabChange: contextTabChange,
    formatVND,
  } = useDebt();
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('error');

  // State for cancel dialog
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  const [selectedDebt, setSelectedDebt] = useState(null);

  // State for pay dialog (OTP confirmation)
  const [payDialogOpen, setPayDialogOpen] = useState(false);
  const [payStep, setPayStep] = useState(1); // 1 = request OTP, 2 = confirm OTP
  const [otp, setOtp] = useState('');
  const [paymentMessage, setPaymentMessage] = useState('');

  // State for create debt reminder dialog
  const [createDialogOpen, setCreateDialogOpen] = useState(false);

  const onTabChange = (event, newValue) => {
    contextTabChange(event, newValue);
  };

  const onChangePage = (e, newPage) => {
    contextChangePage(e, newPage);
  };

  const onChangeRowsPerPage = (e) => {
    contextChangeRowsPerPage(e);
  };

  const onRequestSort = (property) => {
    contextRequestSort(property);
  };
  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const handleOpenCreateDialog = () => {
    setCreateDialogOpen(true);
  };

  const handleCloseCreateDialog = () => {
    setCreateDialogOpen(false);
  };

  // Add useEffect to fetch data when component mounts
  React.useEffect(() => {
    fetchDebtReminders();
  }, []); // Empty dependency array to run only on mount

  React.useEffect(() => {
    if (error) {
      setSnackbarOpen(true);
      setSnackbarMessage(error);
      setSnackbarSeverity('error');
    }
  }, [error]);

  return (
    <CustomerLayout>
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
            Debt Management 💰
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Send, receive, and manage your debt reminders in one place.
          </Typography>
        </Box>

        <Backdrop
          sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={loading}
        >
          <CircularProgress color="inherit" />
        </Backdrop>

        <Snackbar
          open={snackbarOpen}
          autoHideDuration={6000}
          onClose={handleSnackbarClose}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
          <Alert
            onClose={handleSnackbarClose}
            severity={snackbarSeverity}
            sx={{ width: '100%' }}
          >
            {snackbarMessage}
          </Alert>
        </Snackbar>

        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
          <Tabs
            value={currentTab}
            onChange={onTabChange}
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
              <TableHead>
                <TableRow>
                  <TableCell>
                    <TableSortLabel
                      active={sort.orderBy === 'createdAt'}
                      direction={
                        sort.orderBy === 'createdAt' ? sort.order : 'asc'
                      }
                      onClick={() => onRequestSort('createdAt')}
                    >
                      Created At
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>
                    {currentTab === 0 ? 'Debtor' : 'Creator'}
                  </TableCell>
                  <TableCell>Message</TableCell>
                  <TableCell>
                    <TableSortLabel
                      active={sort.orderBy === 'amount'}
                      direction={sort.orderBy === 'amount' ? sort.order : 'asc'}
                      onClick={() => onRequestSort('amount')}
                    >
                      Amount
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>
                    <TableSortLabel
                      active={sort.orderBy === 'status'}
                      direction={sort.orderBy === 'status' ? sort.order : 'asc'}
                      onClick={() => onRequestSort('status')}
                    >
                      Status
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {sortedDebts.length > 0 ? (
                  sortedDebts.map((debt) => (
                    <TableRow key={debt.id} hover>
                      <TableCell>
                        <Typography variant="body2">
                          {new Date(debt.createdAt).toLocaleDateString(
                            'en-US',
                            {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                            },
                          )}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {new Date(debt.createdAt).toLocaleTimeString(
                            'en-US',
                            {
                              hour: '2-digit',
                              minute: '2-digit',
                            },
                          )}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        {/* Display user full name and account number */}
                        <Typography
                          variant="body2"
                          sx={{ fontWeight: 'medium' }}
                        >
                          {currentTab === 0
                            ? debt.debtorFullName
                            : debt.creatorFullName}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {currentTab === 0
                            ? debt.debtorAccountNumber
                            : debt.creatorAccountNumber}
                        </Typography>
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
                      <TableCell>
                        {/* Show different actions based on debt status and current tab */}
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          {/* For debts created by the user */}
                          {currentTab === 0 && debt.status === 'PENDING' && (
                            <IconButton
                              size="small"
                              color="error"
                              title="Cancel"
                              onClick={() => {
                                setSelectedDebt(debt);
                                setCancelDialogOpen(true);
                              }}
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          )}

                          {/* For debts received by the user */}
                          {currentTab === 1 && debt.status === 'PENDING' && (
                            <IconButton
                              size="small"
                              color="primary"
                              title="Pay"
                              onClick={async () => {
                                setSelectedDebt(debt);
                                setPayDialogOpen(true);
                              }}
                            >
                              <PaymentIcon fontSize="small" />
                            </IconButton>
                          )}
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} align="center">
                      <Typography variant="body1" sx={{ py: 2 }}>
                        No debt reminders found
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

      {/* Cancel Debt Dialog */}
      <Dialog
        open={cancelDialogOpen}
        onClose={() => setCancelDialogOpen(false)}
      >
        <DialogTitle>Cancel Debt Reminder</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please provide a reason for cancelling this debt reminder to{' '}
            {selectedDebt?.debtorFullName}.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            label="Reason"
            type="text"
            fullWidth
            variant="outlined"
            value={cancelReason}
            onChange={(e) => setCancelReason(e.target.value)}
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCancelDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={async () => {
              if (selectedDebt && cancelReason.trim()) {
                const result = await cancelDebtReminder(
                  selectedDebt.id,
                  cancelReason.trim(),
                );
                if (result.success) {
                  setSnackbarMessage('Debt reminder cancelled successfully');
                  setSnackbarSeverity('success');
                } else {
                  setSnackbarMessage(
                    result.error || 'Failed to cancel debt reminder',
                  );
                  setSnackbarSeverity('error');
                }
                setSnackbarOpen(true);
                setCancelDialogOpen(false);
                setCancelReason('');
                setSelectedDebt(null);
              }
            }}
            color="error"
            disabled={!cancelReason.trim()}
          >
            Confirm Cancel
          </Button>
        </DialogActions>
      </Dialog>

      {/* Pay Debt Dialog with multi-step OTP */}
      <Dialog
        open={payDialogOpen}
        onClose={() => {
          setPayDialogOpen(false);
          setPayStep(1);
          setOtp('');
          setPaymentMessage('');
          setSelectedDebt(null);
        }}
      >
        <DialogTitle>{payStep === 1 ? 'Pay Debt' : 'Confirm OTP'}</DialogTitle>
        <DialogContent>
          {payStep === 1 ? (
            <>
              <DialogContentText>
                You are about to pay{' '}
                {selectedDebt ? formatVND(selectedDebt.amount) : ''} to{' '}
                {selectedDebt?.creatorFullName}.
              </DialogContentText>
              <TextField
                margin="dense"
                label="Payment Message"
                type="text"
                fullWidth
                variant="outlined"
                value={paymentMessage}
                onChange={(e) => setPaymentMessage(e.target.value)}
                sx={{ mt: 2 }}
              />
            </>
          ) : (
            <>
              <DialogContentText>
                Please enter the OTP sent to your email to confirm payment.
              </DialogContentText>
              <TextField
                autoFocus
                margin="dense"
                label="OTP Code"
                type="text"
                fullWidth
                variant="outlined"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                sx={{ mt: 2 }}
              />
            </>
          )}
        </DialogContent>
        <DialogActions>
          {payStep === 1 ? (
            <>
              <Button
                onClick={() => {
                  setPayDialogOpen(false);
                  setSelectedDebt(null);
                  setPaymentMessage('');
                }}
                disabled={loading}
                sx={{ color: 'text.secondary' }}
              >
                Cancel
              </Button>
              <Button
                onClick={async () => {
                  const result = await requestOtpForPayDebt();
                  if (result.success) {
                    setPayStep(2);
                    setSnackbarMessage('OTP sent to your email');
                    setSnackbarSeverity('info');
                    setSnackbarOpen(true);
                  } else {
                    setSnackbarMessage(result.error || 'Failed to request OTP');
                    setSnackbarSeverity('error');
                    setSnackbarOpen(true);
                  }
                }}
                variant="contained"
                color="primary"
                disabled={loading}
                sx={{ fontWeight: 600 }}
              >
                Request OTP
              </Button>
            </>
          ) : (
            <>
              <Button
                onClick={() => setPayStep(1)}
                disabled={loading}
                sx={{ color: 'text.secondary' }}
              >
                Back
              </Button>
              <Button
                onClick={async () => {
                  if (otp.trim() && selectedDebt) {
                    const result = await payDebtReminder(selectedDebt.id, {
                      otp: otp.trim(),
                      message: paymentMessage.trim(),
                    });
                    if (result.success) {
                      setSnackbarMessage('Debt paid successfully');
                      setSnackbarSeverity('success');
                    } else {
                      setSnackbarMessage(result.error || 'Failed to pay debt');
                      setSnackbarSeverity('error');
                    }
                    setSnackbarOpen(true);
                    setPayDialogOpen(false);
                    setPayStep(1);
                    setOtp('');
                    setPaymentMessage('');
                    setSelectedDebt(null);
                  }
                }}
                variant="contained"
                color="primary"
                disabled={loading || !otp.trim()}
                sx={{ fontWeight: 600 }}
              >
                Submit
              </Button>
            </>
          )}
        </DialogActions>
      </Dialog>

      {/* Create Debt Reminder Dialog */}
      <CreateDebtReminderDialog
        open={createDialogOpen}
        onClose={handleCloseCreateDialog}
        onSuccess={() => {
          setSnackbarMessage('Debt reminder created successfully');
          setSnackbarSeverity('success');
          setSnackbarOpen(true);
        }}
      />

      {/* Floating Action Button */}
      <Tooltip title="Create Debt Reminder">
        <Fab
          color="primary"
          aria-label="add"
          onClick={handleOpenCreateDialog}
          sx={{
            position: 'fixed',
            bottom: 24,
            right: 24,
            transition: 'all 0.2s ease-in-out',
            '&:hover': { transform: 'scale(1.1)' },
          }}
        >
          <AddIcon />
        </Fab>
      </Tooltip>
    </CustomerLayout>
  );
}
