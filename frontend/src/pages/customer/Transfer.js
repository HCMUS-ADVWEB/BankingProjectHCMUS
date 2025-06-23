import { useState, useEffect } from 'react';
import CustomerLayout from '../../layouts/CustomerLayout';
import api from '../../utils/api';
import { useAuth } from '../../contexts/AuthContext';
import { useLocation } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Alert,
  MenuItem,
  Divider,
  Select,
  InputLabel,
  FormControl,
} from '@mui/material';
import { Send as SendIcon } from '@mui/icons-material';

export default function TransferPage() {
  const { state } = useAuth();
  const { state: locationState } = useLocation();
  const [form, setForm] = useState({
    accountNumberReceiver: locationState?.accountNumberReceiver || '',
    amount: '',
    message: '',
    feeType: 'SENDER',
    transferType: 'internal',
    sourceAccountNumber: '',
    bankId: '',
    recipientName: '',
  });
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState(1); // 1: form, 2: otp, 3: save recipient
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [result, setResult] = useState(null);
  const [recipients, setRecipients] = useState([]);
  const [saveRecipient, setSaveRecipient] = useState({
    accountNumber: '',
    bankName: '',
    recipientName: '',
    recipientNickname: '',
  });

  // Fetch recipients for dropdown
  useEffect(() => {
    api
      .get('/api/recipients', { params: { limit: 20, page: 1 } })
      .then((res) => setRecipients(res.data.data || []))
      .catch((err) => setError(err.response?.data?.message || err.message));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'amount' && value < 0) return; // Prevent negative amount
    if (name === 'accountNumberReceiver') {
      const selectedRecipient = recipients.find(
        (rec) => rec.accountNumber === value,
      );
      setForm({
        ...form,
        accountNumberReceiver: value,
        bankId: selectedRecipient?.bankName || form.bankId,
        recipientName: selectedRecipient?.recipientName || form.recipientName,
      });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleRecipientChange = (e) => {
    const value = e.target.value;
    if (value === 'manual') {
      setForm({
        ...form,
        accountNumberReceiver: '',
        bankId: '',
        recipientName: '',
      });
    } else {
      const selectedRecipient = recipients.find(
        (rec) => rec.accountNumber === value,
      );
      setForm({
        ...form,
        accountNumberReceiver: value,
        bankId: selectedRecipient?.bankName || '',
        recipientName: selectedRecipient?.recipientName || '',
      });
    }
  };

  const handleSaveRecipientChange = (e) =>
    setSaveRecipient({ ...saveRecipient, [e.target.name]: e.target.value });

  const handleRequestOtp = async () => {
    if (!form.accountNumberReceiver || !form.amount) {
      setError('Please fill in all required fields.');
      return;
    }
    if (parseFloat(form.amount) <= 0) {
      setError('Amount must be greater than 0.');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await api.post('/api/otp', {
        userId: state.user.id,
        email: state.user.email,
        otpType: 'TRANSFER',
      });
      setStep(2);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleTransfer = async () => {
    setLoading(true);
    setError(null);
    try {
      const payload =
        form.transferType === 'internal'
          ? {
            accountNumberReceiver: form.accountNumberReceiver,
            amount: parseFloat(form.amount),
            message: form.message,
            feeType: form.feeType,
            otp,
          }
          : {
            sourceAccountNumber: form.sourceAccountNumber,
            recipient: {
              destinationAccountNumber: form.accountNumberReceiver,
              reminiscent: form.recipientName,
              fullName: form.recipientName,
              bankId: form.bankId || 'othergroup0002',
              isInternal: false,
            },
            transactionAmount: parseFloat(form.amount),
            transactionNote: form.message,
            transactionPayer: form.feeType,
          };

      const { data } = await api.post(
        form.transferType === 'internal'
          ? '/api/transactions/internal'
          : '/api/transactions/external',
        payload,
      );
      setResult(data.data);
      setSuccess('Transfer successful!');
      // Check if recipient exists
      const recipientExists = recipients.some(
        (rec) => rec.accountNumber === form.accountNumberReceiver,
      );
      if (!recipientExists) {
        setSaveRecipient({
          accountNumber: form.accountNumberReceiver,
          bankName: form.bankId,
          recipientName: form.recipientName,
          recipientNickname: '',
        });
        setStep(3);
      } else {
        setStep(1);
        setForm({
          accountNumberReceiver: '',
          amount: '',
          message: '',
          feeType: 'SENDER',
          transferType: 'internal',
          sourceAccountNumber: '',
          bankId: '',
          recipientName: '',
        });
        setOtp('');
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveRecipient = async () => {
    setLoading(true);
    setError(null);
    try {
      await api.post('/api/recipients', {
        accountNumber: saveRecipient.accountNumber,
        bankName: saveRecipient.bankName,
        recipientName: saveRecipient.recipientName,
        recipientNickname: saveRecipient.recipientNickname,
      });
      setSuccess('Recipient saved successfully!');
      setStep(1);
      setForm({
        accountNumberReceiver: '',
        amount: '',
        message: '',
        feeType: 'SENDER',
        transferType: 'internal',
        sourceAccountNumber: '',
        bankId: '',
        recipientName: '',
      });
      setOtp('');
      setSaveRecipient({
        accountNumber: '',
        bankName: '',
        recipientName: '',
        recipientNickname: '',
      });
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <CustomerLayout>
      <Container maxWidth="xl" sx={{ py: 6, bgcolor: 'background.default', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
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
            maxWidth: 600,
            animation: 'fadeIn 1s ease-in-out',
            '@keyframes fadeIn': {
              '0%': { opacity: 0, transform: 'translateY(-20px)' },
              '100%': { opacity: 1, transform: 'translateY(0)' },
            },
          }}
        >
          <Typography
            variant="h3"
            sx={{ fontWeight: 700, color: 'text.primary', mb: 1, textAlign: 'center' }}
          >
            Transfer Money 💸
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ textAlign: 'center' }}>
            Send money securely to saved recipients or new accounts.
          </Typography>
        </Box>

        {/* Transfer Form */}
        <Box
          sx={{
            mb: 4,
            width: '100%',
            maxWidth: 600,
            p: 4,
            borderRadius: 'shape.borderRadius',
            bgcolor: 'background.paper',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            animation: 'fadeInUp 0.5s ease-in-out',
            '@keyframes fadeInUp': {
              '0%': { opacity: 0, transform: 'translateY(20px)' },
              '100%': { opacity: 1, transform: 'translateY(0)' },
            },
          }}
        >
          <Typography variant="h5" color="text.primary" sx={{ mb: 3 }}>
            Transfer Details
          </Typography>
          <Divider sx={{ mb: 3 }} />

          {error && (
            <Alert severity="error" sx={{ mb: 4, borderRadius: 'shape.borderRadius' }}>
              {error}
            </Alert>
          )}
          {success && (
            <Alert severity="success" sx={{ mb: 4, borderRadius: 'shape.borderRadius' }}>
              {success}
            </Alert>
          )}

          {step === 1 && (
            <Box component="form" onSubmit={(e) => { e.preventDefault(); handleRequestOtp(); }}>
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Recipient</InputLabel>
                <Select
                  value={form.accountNumberReceiver || 'manual'}
                  onChange={handleRecipientChange}
                  disabled={loading || step === 2}
                >
                  <MenuItem value="manual">Enter manually</MenuItem>
                  {recipients.map((rec) => (
                    <MenuItem key={rec.recipientId} value={rec.accountNumber}>
                      {rec.recipientNickname || rec.recipientName} ({rec.accountNumber})
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <TextField
                label="Account Number"
                name="accountNumberReceiver"
                fullWidth
                sx={{ mb: 2 }}
                value={form.accountNumberReceiver}
                onChange={handleChange}
                required
                disabled={loading || step === 2}
              />
              {form.transferType === 'external' && (
                <>
                  <TextField
                    label="Source Account Number"
                    name="sourceAccountNumber"
                    fullWidth
                    sx={{ mb: 2 }}
                    value={form.sourceAccountNumber}
                    onChange={handleChange}
                    required
                    disabled={loading || step === 2}
                  />
                  <TextField
                    label="Bank ID"
                    name="bankId"
                    fullWidth
                    sx={{ mb: 2 }}
                    value={form.bankId}
                    onChange={handleChange}
                    disabled={loading || step === 2}
                  />
                  <TextField
                    label="Recipient Name"
                    name="recipientName"
                    fullWidth
                    sx={{ mb: 2 }}
                    value={form.recipientName}
                    onChange={handleChange}
                    disabled={loading || step === 2}
                  />
                </>
              )}
              <TextField
                label="Amount"
                name="amount"
                type="number"
                fullWidth
                sx={{ mb: 2 }}
                value={form.amount}
                onChange={handleChange}
                required
                inputProps={{ min: 0 }}
                disabled={loading || step === 2}
              />
              <TextField
                label="Message"
                name="message"
                fullWidth
                sx={{ mb: 2 }}
                value={form.message}
                onChange={handleChange}
                disabled={loading || step === 2}
              />
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Fee Type</InputLabel>
                <Select
                  name="feeType"
                  value={form.feeType}
                  onChange={handleChange}
                  disabled={loading || step === 2}
                >
                  <MenuItem value="SENDER">Sender</MenuItem>
                  <MenuItem value="RECEIVER">Receiver</MenuItem>
                </Select>
              </FormControl>
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Transfer Type</InputLabel>
                <Select
                  name="transferType"
                  value={form.transferType}
                  onChange={handleChange}
                  disabled={loading || step === 2}
                >
                  <MenuItem value="internal">Internal</MenuItem>
                  <MenuItem value="external">External</MenuItem>
                </Select>
              </FormControl>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                startIcon={<SendIcon />}
                sx={{ py: 1.5 }}
                disabled={loading || step === 2}
              >
                Send OTP
              </Button>
            </Box>
          )}

          {result && (
            <Box sx={{ mt: 3 }}>
              <Typography variant="h6" color="text.primary" sx={{ mb: 2 }}>
                Transaction Result
              </Typography>
              <Box
                sx={{
                  bgcolor: 'background.default',
                  p: 2,
                  borderRadius: 'shape.borderRadius',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                }}
              >
                <pre style={{ whiteSpace: 'pre-wrap', fontSize: '0.9rem' }}>
                  {JSON.stringify(result, null, 2)}
                </pre>
              </Box>
            </Box>
          )}
        </Box>

        {/* OTP Dialog */}
        <Dialog
          open={step === 2}
          onClose={() => setStep(1)}
          sx={{
            '& .MuiDialog-paper': {
              borderRadius: 'shape.borderRadius',
              bgcolor: 'background.paper',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              animation: 'fadeInUp 0.5s ease-in-out',
              '@keyframes fadeInUp': {
                '0%': { opacity: 0, transform: 'translateY(20px)' },
                '100%': { opacity: 1, transform: 'translateY(0)' },
              },
            },
          }}
        >
          <DialogTitle sx={{ fontWeight: 600, color: 'text.primary' }}>
            Enter OTP
          </DialogTitle>
          <DialogContent>
            <TextField
              label="OTP"
              fullWidth
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              autoFocus
              sx={{ mt: 1, mb: 2 }}
              inputProps={{ style: { textAlign: 'center', letterSpacing: '0.2em' } }}
            />
            {loading && <CircularProgress sx={{ display: 'block', mx: 'auto', mt: 2 }} />}
          </DialogContent>
          <DialogActions sx={{ p: 3 }}>
            <Button onClick={() => setStep(1)} sx={{ color: 'text.secondary' }} disabled={loading}>
              Cancel
            </Button>
            <Button
              onClick={handleTransfer}
              variant="contained"
              color="primary"
              disabled={loading || !otp}
            >
              Submit
            </Button>
          </DialogActions>
        </Dialog>

        {/* Save Recipient Dialog */}
        <Dialog
          open={step === 3}
          onClose={() => {
            setStep(1);
            setForm({
              accountNumberReceiver: '',
              amount: '',
              message: '',
              feeType: 'SENDER',
              transferType: 'internal',
              sourceAccountNumber: '',
              bankId: '',
              recipientName: '',
            });
            setOtp('');
          }}
          sx={{
            '& .MuiDialog-paper': {
              borderRadius: 'shape.borderRadius',
              bgcolor: 'background.paper',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              animation: 'fadeInUp 0.5s ease-in-out',
              '@keyframes fadeInUp': {
                '0%': { opacity: 0, transform: 'translateY(20px)' },
                '100%': { opacity: 1, transform: 'translateY(0)' },
              },
            },
          }}
        >
          <DialogTitle sx={{ fontWeight: 600, color: 'text.primary' }}>
            Save Recipient
          </DialogTitle>
          <DialogContent>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
              Would you like to save this recipient for future transfers?
            </Typography>
            <TextField
              label="Account Number"
              name="accountNumber"
              fullWidth
              sx={{ mb: 2, mt: 1 }}
              value={saveRecipient.accountNumber}
              disabled
            />
            <TextField
              label="Bank Name"
              name="bankName"
              fullWidth
              sx={{ mb: 2 }}
              value={saveRecipient.bankName}
              onChange={handleSaveRecipientChange}
            />
            <TextField
              label="Recipient Name"
              name="recipientName"
              fullWidth
              sx={{ mb: 2 }}
              value={saveRecipient.recipientName}
              onChange={handleSaveRecipientChange}
            />
            <TextField
              label="Recipient Nickname"
              name="recipientNickname"
              fullWidth
              sx={{ mb: 2 }}
              value={saveRecipient.recipientNickname}
              onChange={handleSaveRecipientChange}
            />
          </DialogContent>
          <DialogActions sx={{ p: 3 }}>
            <Button
              onClick={() => {
                setStep(1);
                setForm({
                  accountNumberReceiver: '',
                  amount: '',
                  message: '',
                  feeType: 'SENDER',
                  transferType: 'internal',
                  sourceAccountNumber: '',
                  bankId: '',
                  recipientName: '',
                });
                setOtp('');
              }}
              sx={{ color: 'text.secondary' }}
            >
              Skip
            </Button>
            <Button
              onClick={handleSaveRecipient}
              variant="contained"
              color="primary"
              disabled={loading}
            >
              Save
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </CustomerLayout>
  );
}
