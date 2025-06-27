import { useState, useRef } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Alert,
  Box,
  CircularProgress,
  InputAdornment,
  Typography,
} from '@mui/material';
import { useDebt } from '../contexts/customer/DebtContext';
import api from '../utils/api';

const CreateDebtReminderDialog = ({ open, onClose, onSuccess }) => {
  const { createDebtReminder, loading, error } = useDebt();
  const [formData, setFormData] = useState({
    accountNumber: '',
    amount: '',
    message: '',
  });

  const [formErrors, setFormErrors] = useState({
    accountNumber: '',
    amount: '',
  });

  // State for account lookup
  const [debtorInfo, setDebtorInfo] = useState(null);
  const [lookupLoading, setLookupLoading] = useState(false);
  const [lookupError, setLookupError] = useState('');
  const lookupTimeoutRef = useRef(null);

  // Function to lookup account info
  const lookupAccountInfo = async (accountNumber) => {
    if (!accountNumber.trim()) {
      setDebtorInfo(null);
      setLookupError('');
      return;
    }

    setLookupLoading(true);
    setLookupError('');

    try {
      const response = await api.post('/api/accounts/account-info', {
        accountNumber: accountNumber.trim(),
        bankCode: null,
      });

      if (response.data && response.data.data) {
        setDebtorInfo(response.data.data);
        setLookupError('');
      } else {
        setDebtorInfo(null);
        setLookupError('Account not found');
      }
    } catch (error) {
      console.error('Error looking up account:', error);
      setDebtorInfo(null);
      setLookupError(
        error.response?.data?.message || 'Failed to lookup account',
      );
    } finally {
      setLookupLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: '' }));
    }

    // Trigger account lookup when account number changes
    if (name === 'accountNumber') {
      // Clear previous timeout
      if (lookupTimeoutRef.current) {
        clearTimeout(lookupTimeoutRef.current);
      }

      // Reset states immediately when input changes
      setDebtorInfo(null);
      setLookupError('');

      // Set new timeout for debounced lookup
      if (value.trim()) {
        lookupTimeoutRef.current = setTimeout(() => {
          lookupAccountInfo(value.trim());
        }, 500);
      }
    }
  };

  const validateForm = () => {
    let valid = true;
    const newErrors = { accountNumber: '', amount: '' };

    if (!formData.accountNumber.trim()) {
      newErrors.accountNumber = 'Account number is required';
      valid = false;
    } else if (lookupError) {
      newErrors.accountNumber = 'Please enter a valid account number';
      valid = false;
    } else if (!debtorInfo && formData.accountNumber.trim()) {
      newErrors.accountNumber = 'Please wait for account verification';
      valid = false;
    }

    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      newErrors.amount = 'Please enter a valid amount greater than 0';
      valid = false;
    }

    setFormErrors(newErrors);
    return valid;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    const debtData = {
      accountNumber: formData.accountNumber.trim(),
      amount: parseFloat(formData.amount),
      message: formData.message.trim(),
    };

    const result = await createDebtReminder(debtData);
    if (result && result.success) {
      // Notify parent of success
      onSuccess && onSuccess();
      handleClose();
    }
  };
  const handleClose = () => {
    // Clear any pending timeout
    if (lookupTimeoutRef.current) {
      clearTimeout(lookupTimeoutRef.current);
    }

    setFormData({
      accountNumber: '',
      amount: '',
      message: '',
    });
    setFormErrors({
      accountNumber: '',
      amount: '',
    });
    // Reset lookup state
    setDebtorInfo(null);
    setLookupError('');
    setLookupLoading(false);
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Create Debt Reminder</DialogTitle>
      <DialogContent>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <TextField
          autoFocus
          margin="dense"
          name="accountNumber"
          label="Debtor Account Number *"
          type="text"
          fullWidth
          variant="outlined"
          value={formData.accountNumber}
          onChange={handleChange}
          error={Boolean(formErrors.accountNumber) || Boolean(lookupError)}
          helperText={
            formErrors.accountNumber ||
            lookupError ||
            'Enter the account number of the person who owes you money'
          }
          InputProps={{
            endAdornment: lookupLoading && (
              <InputAdornment position="end">
                <CircularProgress size={20} />
              </InputAdornment>
            ),
          }}
          sx={{ mb: 1, mt: 1 }}
        />

        {/* Display debtor information */}
        {debtorInfo && (
          <Box
            sx={{
              p: 2,
              mb: 2,
              color: 'success.contrastText',
              borderRadius: 1,
              border: '1px solid',
              borderColor: 'success.main',
            }}
          >
            <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
              ✓ Account Found
            </Typography>
            <Typography variant="body1" sx={{ mt: 0.5 }}>
              <strong>{debtorInfo.fullName}</strong>
            </Typography>
            {debtorInfo.email && (
              <Typography variant="body2" sx={{ color: 'success.dark' }}>
                {debtorInfo.email}
              </Typography>
            )}
          </Box>
        )}

        <TextField
          margin="dense"
          name="amount"
          label="Amount *"
          type="number"
          fullWidth
          variant="outlined"
          value={formData.amount}
          onChange={handleChange}
          error={Boolean(formErrors.amount)}
          helperText={formErrors.amount}
          InputProps={{
            startAdornment: <InputAdornment position="start">₫</InputAdornment>,
          }}
          sx={{ mb: 2 }}
        />

        <TextField
          margin="dense"
          name="message"
          label="Message (Optional)"
          type="text"
          fullWidth
          variant="outlined"
          value={formData.message}
          onChange={handleChange}
          multiline
          rows={3}
          placeholder="Add a message explaining what this debt is for"
          sx={{ mb: 2 }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="inherit">
          Cancel
        </Button>
        <Box sx={{ position: 'relative' }}>
          <Button
            onClick={handleSubmit}
            color="primary"
            variant="contained"
            disabled={
              loading ||
              lookupLoading ||
              (formData.accountNumber.trim() && !debtorInfo)
            }
          >
            Create Debt Reminder
          </Button>
          {loading && (
            <CircularProgress
              size={24}
              sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                marginTop: '-12px',
                marginLeft: '-12px',
              }}
            />
          )}
        </Box>
      </DialogActions>
    </Dialog>
  );
};

export default CreateDebtReminderDialog;
