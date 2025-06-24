import React, { useState } from 'react';
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
import { useRecipient } from '../contexts/RecipientContext';

const AddRecipientDialog = ({ open, onClose }) => {
  const { addNewRecipient, loading, error } = useRecipient();

  const [formData, setFormData] = useState({
    accountNumber: '',
    bankCode: '',
    nickName: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  const handleSubmit = async () => {
    const { accountNumber, bankCode, nickName } = formData;

    if (!accountNumber) {
      return;
    }

    const bankCodeValue = bankCode.trim() === '' ? null : bankCode;

    const success = await addNewRecipient(
      accountNumber,
      bankCodeValue,
      nickName,
    );
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
        />{' '}
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
          <MenuItem value="BANKING">Our Banking</MenuItem>
          <MenuItem value="SACOMBANK">Sacombank</MenuItem>
          <MenuItem value="VIETCOMBANK">Vietcombank</MenuItem>
          <MenuItem value="AGRIBANK">Agribank</MenuItem>
          <MenuItem value="BIDV">BIDV</MenuItem>
        </TextField>
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
          {' '}
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
