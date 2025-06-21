import { useState } from 'react';
import { Container, Typography, Paper, TextField, Button, Box, Stack } from '@mui/material';
import CustomerLayout from '../../layouts/CustomerLayout';
import { resetPassword } from '../../utils/api';

export default function ChangePasswordPage() {
  const [form, setForm] = useState({ current: '', new: '', confirm: '' });
  const [step, setStep] = useState(1); // 1: password form, 2: OTP
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (form.new !== form.confirm) {
      setError('Passwords do not match');
      return;
    }
    setError('');
    setStep(2);
  };

  const handleOtpChange = (idx, value) => {
    if (!/^[0-9]?$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[idx] = value;
    setOtp(newOtp);
    // Move to next input if value entered
    if (value && idx < 5) {
      document.getElementById(`otp-${idx + 1}`).focus();
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    if (otp.some((d) => d === '')) {
      setError('Please enter the 6-digit OTP');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await resetPassword({
        currentPassword: form.current,
        newPassword: form.new,
        otp: otp.join(''),
      });
      setSuccess(true);
    } catch (err) {
      setError('Failed to reset password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <CustomerLayout>
      <Container maxWidth="xs" sx={{ py: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 3 }}>Change Password</Typography>
        <Paper sx={{ p: 3, borderRadius: 'shape.borderRadius' }}>
          {step === 1 && !success && (
            <form onSubmit={handlePasswordSubmit}>
              <TextField
                label="Current Password"
                name="current"
                type="password"
                value={form.current}
                onChange={handleChange}
                fullWidth
                required
                sx={{ mb: 2 }}
              />
              <TextField
                label="New Password"
                name="new"
                type="password"
                value={form.new}
                onChange={handleChange}
                fullWidth
                required
                sx={{ mb: 2 }}
              />
              <TextField
                label="Confirm New Password"
                name="confirm"
                type="password"
                value={form.confirm}
                onChange={handleChange}
                fullWidth
                required
                sx={{ mb: 2 }}
              />
              {error && (
                <Box sx={{ mb: 2 }}>
                  <Typography color="error.main">{error}</Typography>
                </Box>
              )}
              <Button type="submit" variant="contained" color="primary" fullWidth>
                Continue
              </Button>
            </form>
          )}
          {step === 2 && !success && (
            <form onSubmit={handleOtpSubmit}>
              <Typography sx={{ mb: 2 }}>Enter the 6-digit OTP sent to your email/phone</Typography>
              <Stack direction="row" spacing={1} justifyContent="center" sx={{ mb: 2 }}>
                {otp.map((digit, idx) => (
                  <TextField
                    key={idx}
                    id={`otp-${idx}`}
                    value={digit}
                    onChange={(e) => handleOtpChange(idx, e.target.value)}
                    inputProps={{ maxLength: 1, style: { textAlign: 'center', fontSize: 24 } }}
                    sx={{ width: 40 }}
                  />
                ))}
              </Stack>
              {error && (
                <Box sx={{ mb: 2 }}>
                  <Typography color="error.main">{error}</Typography>
                </Box>
              )}
              <Button type="submit" variant="contained" color="primary" fullWidth disabled={loading}>
                {loading ? 'Changing...' : 'Change Password'}
              </Button>
            </form>
          )}
          {success && (
            <Box sx={{ mt: 2 }}>
              <Typography color="success.main">Password changed successfully!</Typography>
            </Box>
          )}
        </Paper>
      </Container>
    </CustomerLayout>
  );
}
