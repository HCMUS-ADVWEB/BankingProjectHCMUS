import { useState } from 'react';
import CustomerLayout from '../../layouts/CustomerLayout';
import api from '../../utils/api';
import { useAuth } from '../../contexts/AuthContext';
import { Box, Typography, TextField, Button, Dialog, DialogTitle, DialogContent, DialogActions, CircularProgress, Alert } from '@mui/material';

export default function ChangePasswordPage() {
  const { state } = useAuth();
  const [form, setForm] = useState({ oldPassword: '', newPassword: '' });
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState(1); // 1: form, 2: otp
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleRequestOtp = async () => {
    setLoading(true); setError(null);
    try {
      const body = {
        userId: state.user.id,
        email: state.user.email,
        otpType: 'PASSWORD_CHANGE',
      };
      await api.post('/api/otp', body);
      setStep(2);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async () => {
    setLoading(true); setError(null);
    try {
      const body = {
        oldPassword: form.oldPassword,
        newPassword: form.newPassword,
        otp,
      };
      console.log(body);

      await api.post('/api/accounts/change-password', body);
      setSuccess('Password changed successfully!');
      setStep(1);
      setForm({ oldPassword: '', newPassword: '' });
      setOtp('');
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <CustomerLayout>
      <Box p={3} maxWidth={400} mx="auto">
        <Typography variant="h4" gutterBottom>Change Password</Typography>
        {error && <Alert severity="error">{error}</Alert>}
        {success && <Alert severity="success">{success}</Alert>}
        <form onSubmit={e => { e.preventDefault(); handleRequestOtp(); }}>
          <TextField label="Old Password" name="oldPassword" type="password" fullWidth style={{ marginBottom: 16 }} value={form.oldPassword} onChange={handleChange} required disabled={loading || step === 2} />
          <TextField label="New Password" name="newPassword" type="password" fullWidth style={{ marginBottom: 16 }} value={form.newPassword} onChange={handleChange} required disabled={loading || step === 2} />
          <Button type="submit" variant="contained" fullWidth disabled={loading || step === 2}>Send OTP</Button>
        </form>
        <Dialog open={step === 2} onClose={() => setStep(1)}>
          <DialogTitle>Enter OTP</DialogTitle>
          <DialogContent>
            <TextField label="OTP" fullWidth value={otp} onChange={e => setOtp(e.target.value)} autoFocus style={{ marginTop: 8 }} />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setStep(1)} disabled={loading}>Cancel</Button>
            <Button onClick={handleChangePassword} variant="contained" disabled={loading || !otp}>Submit</Button>
          </DialogActions>
          {loading && <CircularProgress style={{ margin: 16 }} />}
        </Dialog>
      </Box>
    </CustomerLayout>
  );
}
