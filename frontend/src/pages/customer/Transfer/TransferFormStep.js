import { useState, useEffect } from 'react';
import {
  Box, TextField, Button, MenuItem, Select, InputLabel, FormControl,
  Typography, RadioGroup, FormControlLabel, Radio, IconButton, InputAdornment, Menu,
} from '@mui/material';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import MessageIcon from '@mui/icons-material/Message';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import ContactsIcon from '@mui/icons-material/Contacts';
import { useTransfer } from '../../../contexts/customer/TransferContext';

import {
  TRANSFER_STEPS,
  TRANSFER_TYPES,
  FEE_TYPES,
  DEFAULT_TRANSFER_FORM,
} from '../../../utils/transferConstants';

const TransferFormStep = () => {
  const [form, setForm] = useState(DEFAULT_TRANSFER_FORM);
  const [recipientMenuAnchor, setRecipientMenuAnchor] = useState(null);

  const {
    transferInfo,
    setTransferInfo,
    setStep,
    recipients,
    banks,
    isFetchingName,
    fetchBanksAndRecipients,
    fetchAccountInfo,
  } = useTransfer();

  useEffect(() => {
    fetchBanksAndRecipients();
  }, [fetchBanksAndRecipients]);

  useEffect(() => {
    if (transferInfo) {
      setForm(transferInfo);
    }
  }, [transferInfo]);

  useEffect(() => {
    const updateRecipientName = async () => {
      if (!form.accountNumberReceiver) {
        setForm((prev) => ({ ...prev, recipientName: '' }));
        return;
      }

      const recipientName = await fetchAccountInfo(
        form.accountNumberReceiver,
        form.bankId,
        form.transferType,
      );
      setForm((prev) => ({ ...prev, recipientName }));
    };

    updateRecipientName();
  }, [form.accountNumberReceiver, form.bankId, form.transferType, fetchAccountInfo]);

  const handleRecipientMenuOpen = (event) => {
    setRecipientMenuAnchor(event.currentTarget);
  };

  const handleRecipientSelect = (recipient) => {
    setForm((prev) => ({
      ...prev,
      accountNumberReceiver: recipient.recipientAccountNumber,
      recipientName: recipient.recipientName,
      transferType: recipient.bankName ? TRANSFER_TYPES.EXTERNAL : TRANSFER_TYPES.INTERNAL,
      bankId: recipient.bankCode || '',
    }));
    setRecipientMenuAnchor(null);
  };

  const handleChange = (field) => (e) => {
    const value = e.target.value;
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    setTransferInfo(form);
    setStep(TRANSFER_STEPS.CONFIRM);
  };

  return (
    <Box p={4} maxWidth={600} mx="auto">
      <Typography variant="h5" mb={3}>Transfer Money</Typography>

      <FormControl fullWidth margin="normal">
        <InputLabel>Transfer Type</InputLabel>
        <Select
          value={form.transferType}
          onChange={handleChange('transferType')}
          label="Transfer Type"
        >
          <MenuItem value={TRANSFER_TYPES.INTERNAL}>Internal</MenuItem>
          <MenuItem value={TRANSFER_TYPES.EXTERNAL}>External</MenuItem>
        </Select>
      </FormControl>

      <TextField
        label="Account Number"
        value={form.accountNumberReceiver}
        onChange={handleChange('accountNumberReceiver')}
        fullWidth
        margin="normal"
        InputProps={{
          startAdornment: <AccountBalanceIcon sx={{ mr: 1 }} />,
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={handleRecipientMenuOpen}>
                <ContactsIcon />
              </IconButton>
              <Menu
                anchorEl={recipientMenuAnchor}
                open={Boolean(recipientMenuAnchor)}
                onClose={() => setRecipientMenuAnchor(null)}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                fullWidth
              >
                {recipients.map((r) => (
                  <MenuItem key={r.id} onClick={() => handleRecipientSelect(r)} sx={{ flexDirection: 'column', alignItems: 'flex-start', py: 1 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>{r.nickName}</Typography>
                    <Typography variant="body2">{r.recipientName}</Typography>
                    <Typography variant="body2">{r.recipientAccountNumber}</Typography>
                    <Typography variant="body2" color="text.secondary">{r.bankName}</Typography>
                  </MenuItem>
                ))}
              </Menu>
            </InputAdornment>
          ),
        }}
      />

      <TextField
        label="Recipient Name"
        value={isFetchingName ? 'Loading...' : form.recipientName}
        disabled
        fullWidth
        margin="normal"
      />

      {form.transferType === TRANSFER_TYPES.EXTERNAL && (
        <FormControl fullWidth margin="normal">
          <InputLabel>Select Bank</InputLabel>
          <Select
            value={form.bankId}
            onChange={handleChange('bankId')}
            label="Select Bank"
          >
            {banks.map((bank) => (
              <MenuItem key={bank.bankCode} value={bank.bankCode}>
                {bank.bankName}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      )}

      <TextField
        label="Amount"
        type="number"
        value={form.amount}
        onChange={handleChange('amount')}
        fullWidth
        margin="normal"
        InputProps={{ startAdornment: <AttachMoneyIcon sx={{ mr: 1 }} /> }}
      />

      <TextField
        label="Message to Receiver"
        value={form.message}
        onChange={handleChange('message')}
        fullWidth
        margin="normal"
        InputProps={{ startAdornment: <MessageIcon sx={{ mr: 1 }} /> }}
      />

      <FormControl component="fieldset" margin="normal">
        <Typography>Transaction Fee Paid By</Typography>
        <RadioGroup
          row
          value={form.feeType}
          onChange={handleChange('feeType')}
        >
          <FormControlLabel value={FEE_TYPES.SENDER} control={<Radio />} label="Sender" />
          <FormControlLabel value={FEE_TYPES.RECEIVER} control={<Radio />} label="Receiver" />
        </RadioGroup>
      </FormControl>

      <Button
        variant="contained"
        color="primary"
        fullWidth
        size="large"
        startIcon={<MonetizationOnIcon />}
        onClick={handleSubmit}
        sx={{ mt: 2 }}
        disabled={!form.recipientName || isFetchingName}
      >
        Confirm Transfer
      </Button>
    </Box>
  );
};

export default TransferFormStep;
