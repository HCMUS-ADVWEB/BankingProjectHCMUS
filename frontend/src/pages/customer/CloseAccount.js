import { useState } from 'react';
import CustomerLayout from '../../layouts/CustomerLayout';
import {
  Container,
  Typography,
  Box,
  Paper,
  Alert,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  CircularProgress,
  Backdrop,
  Avatar,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import {
  Warning as WarningIcon,
  AccountCircle as AccountIcon,
  Security as SecurityIcon,
  Money as MoneyIcon,
  History as HistoryIcon,
  ContactSupport as SupportIcon,
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../utils/api';

export default function CloseAccount() {
  const { logout } = useAuth();
  const [confirmDialog, setConfirmDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',
  });

  const handleCloseAccount = async () => {
    setLoading(true);
    try {
      await api.post('/api/accounts/close');

      setSnackbar({
        open: true,
        message: 'Account closed successfully. You will be logged out shortly.',
        severity: 'success',
      });

      // Close dialog and logout after a delay
      setConfirmDialog(false);
      setTimeout(() => {
        logout();
      }, 3000);
    } catch (error) {
      setSnackbar({
        open: true,
        message:
          error.response?.data?.message ||
          'Failed to close account. Please try again.',
        severity: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const warningItems = [
    {
      icon: <MoneyIcon color="warning" />,
      title: 'Account Balance',
      description:
        'Ensure your account balance is zero or withdraw all funds before closing.',
    },
    {
      icon: <HistoryIcon color="warning" />,
      title: 'Transaction History',
      description:
        'Download your transaction history as it will not be accessible after closure.',
    },
    {
      icon: <SupportIcon color="warning" />,
      title: 'Support Access',
      description:
        'You will lose access to online banking and customer support features.',
    },
  ];

  return (
    <CustomerLayout>
      <Container
        maxWidth="100%"
        sx={{ py: 4, bgcolor: 'background.default', minHeight: '100vh' }}
      >
        <Backdrop
          sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={loading}
        >
          <CircularProgress color="inherit" />
        </Backdrop>

        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        >
          <Alert
            onClose={handleCloseSnackbar}
            severity={snackbar.severity}
            sx={{ width: '100%' }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>

        {/* Header */}
        <Box
          sx={{
            mb: 4,
            p: 3,
            borderRadius: 2,
            bgcolor: 'background.paper',
            border: '1px solid',
            borderColor: 'error.light',
          }}
        >
          <Typography
            variant="h4"
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
                bgcolor: 'error.main',
                color: 'white',
                mr: 2,
                width: 40,
                height: 40,
              }}
            >
              <AccountIcon />
            </Avatar>
            Close Account
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Permanently close your banking account. This action cannot be
            undone.
          </Typography>
        </Box>

        {/* Important Information */}
        <Paper
          elevation={2}
          sx={{
            p: 4,
            mb: 4,
            borderRadius: 2,
            border: '1px solid',
            borderColor: 'divider',
          }}
        >
          <Typography
            variant="h5"
            sx={{ mb: 3, fontWeight: 600, color: 'text.primary' }}
          >
            Important Information
          </Typography>

          <List>
            {warningItems.map((item, index) => (
              <ListItem key={index} sx={{ px: 0, py: 2 }}>
                <ListItemIcon sx={{ minWidth: 56 }}>{item.icon}</ListItemIcon>
                <ListItemText
                  primary={
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      {item.title}
                    </Typography>
                  }
                  secondary={
                    <Typography variant="body2" color="text.secondary">
                      {item.description}
                    </Typography>
                  }
                />
              </ListItem>
            ))}
          </List>

          <Divider sx={{ my: 3 }} />

          <Alert severity="info" sx={{ mb: 3 }}>
            <Typography variant="body2">
              <strong>Need Help?</strong> If you're having issues with your
              account, consider contacting our support team before closing your
              account. We may be able to resolve your concerns.
            </Typography>
          </Alert>

          <Box sx={{ textAlign: 'center' }}>
            <Button
              variant="contained"
              color="error"
              size="large"
              onClick={() => setConfirmDialog(true)}
              sx={{
                px: 4,
                py: 1.5,
                fontSize: '1.1rem',
                fontWeight: 600,
                textTransform: 'none',
              }}
            >
              I Understand - Close My Account
            </Button>
          </Box>
        </Paper>

        {/* Confirmation Dialog */}
        <Dialog
          open={confirmDialog}
          onClose={() => setConfirmDialog(false)}
          maxWidth="sm"
          fullWidth
          PaperProps={{
            sx: {
              borderRadius: 2,
              p: 2,
            },
          }}
        >
          <DialogTitle sx={{ pb: 2 }}>
            <Typography
              variant="h5"
              sx={{ fontWeight: 600, color: 'error.main' }}
            >
              Final Confirmation
            </Typography>
          </DialogTitle>

          <DialogContent>
            <Alert severity="error" sx={{ mb: 3 }}>
              <Typography variant="body2">
                This action is <strong>permanent and cannot be undone</strong>.
                Your account and all associated data will be permanently
                deleted.
              </Typography>
            </Alert>

            <Typography variant="body1" sx={{ textAlign: 'center', py: 2 }}>
              Are you sure you want to close your account?
            </Typography>
          </DialogContent>

          <DialogActions sx={{ px: 3, pb: 2 }}>
            <Button
              onClick={() => setConfirmDialog(false)}
              variant="outlined"
              sx={{ mr: 1 }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleCloseAccount}
              variant="contained"
              color="error"
              disabled={loading}
            >
              {loading ? <CircularProgress size={20} /> : 'Close Account'}
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </CustomerLayout>
  );
}
