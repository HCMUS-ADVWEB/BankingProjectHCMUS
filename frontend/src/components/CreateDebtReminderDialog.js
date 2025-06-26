import { useState } from 'react';
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
} from '@mui/material';
import { useDebt } from '../contexts/customer/DebtContext';

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    let valid = true;
    const newErrors = { accountNumber: '', amount: '' };

    if (!formData.accountNumber.trim()) {
      newErrors.accountNumber = 'Account number is required';
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
    setFormData({
      accountNumber: '',
      amount: '',
      message: '',
    });
    setFormErrors({
      accountNumber: '',
      amount: '',
    });
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
          error={Boolean(formErrors.accountNumber)}
          helperText={
            formErrors.accountNumber ||
            'Enter the account number of the person who owes you money'
          }
          sx={{ mb: 2, mt: 1 }}
        />

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
            disabled={loading}
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
