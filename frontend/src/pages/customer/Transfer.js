import { useState } from 'react';
import CustomerLayout from '../../layouts/CustomerLayout';
import api from '../../utils/api';
import { useAuth } from '../../contexts/AuthContext';
import { Box, Typography, TextField, Button, Dialog, DialogTitle, DialogContent, DialogActions, CircularProgress, Alert, MenuItem } from '@mui/material';

export default function TransferPage() {
  const { state } = useAuth();
  const [form, setForm] = useState({ accountNumberReceiver: '', amount: '', message: '', feeType: 'SENDER' });
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState(1); // 1: form, 2: otp
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [result, setResult] = useState(null);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleRequestOtp = async () => {
    setLoading(true); setError(null);
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
    setLoading(true); setError(null);
    try {
      const { data } = await api.post('/api/transactions/internal', {
        ...form,
        amount: parseFloat(form.amount),
        otp,
      });
      setResult(data.data);
      setSuccess('Transfer successful!');
      setStep(1);
      setForm({ accountNumberReceiver: '', amount: '', message: '', feeType: 'SENDER' });
      setOtp('');
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <CustomerLayout>
      <Box p={3} maxWidth={500} mx="auto">
        <Typography variant="h4" gutterBottom>Transfer</Typography>
        {error && <Alert severity="error">{error}</Alert>}
        {success && <Alert severity="success">{success}</Alert>}
        <form onSubmit={e => { e.preventDefault(); handleRequestOtp(); }}>
          {/* TODO: Add recipient selection */}
          <TextField label="Account Number Receiver" name="accountNumberReceiver" fullWidth style={{ marginBottom: 16 }} value={form.accountNumberReceiver} onChange={handleChange} required disabled={loading || step === 2} />
          <TextField label="Amount" name="amount" type="number" fullWidth style={{ marginBottom: 16 }} value={form.amount} onChange={handleChange} required disabled={loading || step === 2} />
          <TextField label="Message" name="message" fullWidth style={{ marginBottom: 16 }} value={form.message} onChange={handleChange} disabled={loading || step === 2} />
          <TextField select label="Fee Type" name="feeType" fullWidth style={{ marginBottom: 16 }} value={form.feeType} onChange={handleChange} disabled={loading || step === 2}>
            <MenuItem value="SENDER">Sender</MenuItem>
            <MenuItem value="RECEIVER">Receiver</MenuItem>
          </TextField>
          <Button type="submit" variant="contained" fullWidth disabled={loading || step === 2}>Send OTP</Button>
        </form>
        <Dialog open={step === 2} onClose={() => setStep(1)}>
          <DialogTitle>Enter OTP</DialogTitle>
          <DialogContent>
            <TextField label="OTP" fullWidth value={otp} onChange={e => setOtp(e.target.value)} autoFocus style={{ marginTop: 8 }} />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setStep(1)} disabled={loading}>Cancel</Button>
            <Button onClick={handleTransfer} variant="contained" disabled={loading || !otp}>Submit</Button>
          </DialogActions>
          {loading && <CircularProgress style={{ margin: 16 }} />}
        </Dialog>
        {result && (
          <Box mt={3}>
            <Typography variant="h6">Transaction Result</Typography>
            <pre style={{ background: '#f5f5f5', padding: 12, borderRadius: 4 }}>{JSON.stringify(result, null, 2)}</pre>
          </Box>
        )}
      </Box>
    </CustomerLayout>
  );
}
