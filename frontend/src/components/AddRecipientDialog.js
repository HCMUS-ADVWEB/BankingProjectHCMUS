import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Alert,
  MenuItem,
  Box,
  CircularProgress,
} from '@mui/material';
import { useRecipient } from '../contexts/customer/RecipientContext';

const AddRecipientDialog = ({ open, onClose }) => {
  const { addNewRecipient, loading, error, banks, fetchBanks, getAccountInfo } = useRecipient();

  const [formData, setFormData] = useState({
    accountNumber: '',
    bankCode: '',
    nickName: '',
  });

  const [recipientName, setRecipientName] = useState('');
  const [accountError, setAccountError] = useState(null);
  const [loadingAccount, setLoadingAccount] = useState(false);

  // Fetch banks when dialog opens
  useEffect(() => {
    if (open) {
      fetchBanks();
    }
  }, [open]);

  // Fetch account info when accountNumber or bankCode changes
  useEffect(() => {
    const fetchRecipientName = async () => {
      const { accountNumber, bankCode } = formData;
      if (!accountNumber) {
        setRecipientName('');
        setAccountError(null);
        return;
      }
      setLoadingAccount(true);
      setAccountError(null);
      try {
        const result = await getAccountInfo(accountNumber, bankCode || null);
        setRecipientName(result?.fullName || '');
      } catch (err) {
        setAccountError('Invalid account number or bank');
        setRecipientName('');
      } finally {
        setLoadingAccount(false);
      }
    };

    fetchRecipientName();
  }, [formData.accountNumber, formData.bankCode]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    const { accountNumber, bankCode, nickName } = formData;

    if (!accountNumber) return;

    const bankCodeValue = bankCode.trim() === '' ? null : bankCode;

    const success = await addNewRecipient(accountNumber, bankCodeValue, nickName);
    if (success) {
      handleClose();
    }
  };

  const handleClose = () => {
    setFormData({
      accountNumber: '',
      bankCode: '',
      nickName: '',
    });
    setRecipientName('');
    setAccountError(null);
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Add New Recipient</DialogTitle>
      <DialogContent>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        {accountError && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {accountError}
          </Alert>
        )}

        <TextField
          autoFocus
          margin="dense"
          name="accountNumber"
          label="Account Number *"
          type="text"
          fullWidth
          variant="outlined"
          value={formData.accountNumber}
          onChange={handleChange}
          required
          helperText="Account number is required"
          sx={{ mb: 2, mt: 1 }}
        />

        <TextField
          select
          margin="dense"
          name="bankCode"
          label="Select Bank (Optional)"
          fullWidth
          variant="outlined"
          value={formData.bankCode}
          onChange={handleChange}
          helperText="Leave empty for internal bank transfers"
          sx={{ mb: 2 }}
        >
          <MenuItem value="">
            <em>None (Internal Transfer)</em>
          </MenuItem>
          {banks.map((bank) => (
            <MenuItem key={bank.bankCode} value={bank.bankCode}>
              {bank.bankName}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          margin="dense"
          name="recipientName"
          label="Recipient Name"
          type="text"
          fullWidth
          variant="outlined"
          value={recipientName}
          disabled
          InputProps={{
            endAdornment: loadingAccount ? (
              <CircularProgress size={20} sx={{ mr: 1 }} />
            ) : null,
          }}
          sx={{ mb: 2 }}
        />

        <TextField
          margin="dense"
          name="nickName"
          label="Nickname (Optional)"
          type="text"
          fullWidth
          variant="outlined"
          value={formData.nickName}
          onChange={handleChange}
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
            disabled={!formData.accountNumber || loading}
          >
            Add Recipient
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

export default AddRecipientDialog;
