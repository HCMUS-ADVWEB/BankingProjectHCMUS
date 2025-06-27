import { useState } from 'react';
import CustomerLayout from '../../layouts/CustomerLayout';
import api from '../../utils/api';
import { useAuth } from '../../contexts/AuthContext';
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
  Divider,
} from '@mui/material';

export default function ChangePasswordPage() {
  const { state } = useAuth();
  const [form, setForm] = useState({ oldPassword: '', newPassword: '' });
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleRequestOtp = async () => {
    setLoading(true);
    setError(null);
    try {
      const body = {
        userId: state.user.id,
        email: state.user.email,
        otpType: 'PASSWORD_RESET',
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
    setLoading(true);
    setError(null);
    try {
      const body = {
        oldPassword: form.oldPassword,
        newPassword: form.newPassword,
        otp,
      };
      await api.post('/api/users/change-password', body);
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
      <Container
        maxWidth="2xl"
        sx={{ py: 6, bgcolor: 'background.default', minHeight: '100vh' }}
      >
        {/* Header Section */}
        <Box
          sx={{
            mb: 6,
            p: 4,
            borderRadius: 'shape.borderRadius',
            bgcolor: 'background.paper',
            backdropFilter: 'blur(8px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            animation: 'fadeIn 1s ease-in-out',
            '@keyframes fadeIn': {
              '0%': { opacity: 0, transform: 'translateY(-20px)' },
              '100%': { opacity: 1, transform: 'translateY(0)' },
            },
          }}
        >
          <Typography
            variant="h3"
            sx={{ fontWeight: 700, color: 'text.primary', mb: 1 }}
          >
            Change Password 🔒
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Securely update your password with OTP verification sent to your
            email.
          </Typography>
        </Box>

        {/* Form Section */}
        <Box
          sx={{
            maxWidth: 400,
            mx: 'auto',
            p: 3,
            borderRadius: 'shape.borderRadius',
            bgcolor: 'background.paper',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            transition: 'all 0.3s ease',
            '&:hover': {
              transform: 'translateY(-4px)',
              boxShadow: '0 12px 30px rgba(0, 0, 0, 0.4)',
            },
            animation: 'fadeInUp 0.5s ease-in-out',
            '@keyframes fadeInUp': {
              '0%': { opacity: 0, transform: 'translateY(20px)' },
              '100%': { opacity: 1, transform: 'translateY(0)' },
            },
          }}
        >
          <Typography variant="h5" color="text.primary" sx={{ mb: 2 }}>
            Update Your Password
          </Typography>
          <Divider sx={{ mt: 1, mb: 3 }} />
          {error && (
            <Alert
              severity="error"
              sx={{ mb: 3, borderRadius: 'shape.borderRadius' }}
            >
              {error}
            </Alert>
          )}
          {success && (
            <Alert
              severity="success"
              sx={{ mb: 3, borderRadius: 'shape.borderRadius' }}
            >
              {success}
            </Alert>
          )}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleRequestOtp();
            }}
          >
            <TextField
              label="Old Password"
              name="oldPassword"
              type="password"
              fullWidth
              value={form.oldPassword}
              onChange={handleChange}
              required
              disabled={loading || step === 2}
              sx={{ mb: 2 }}
              InputLabelProps={{ sx: { fontWeight: 500 } }}
            />
            <TextField
              label="New Password"
              name="newPassword"
              type="password"
              fullWidth
              value={form.newPassword}
              onChange={handleChange}
              required
              disabled={loading || step === 2}
              sx={{ mb: 3 }}
              InputLabelProps={{ sx: { fontWeight: 500 } }}
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              disabled={loading || step === 2}
              sx={{ py: 1.5, fontWeight: 600 }}
            >
              {loading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                'Send OTP'
              )}
            </Button>
          </form>
        </Box>

        {/* OTP Dialog */}
        <Dialog
          open={step === 2}
          onClose={() => setStep(1)}
          PaperProps={{
            sx: {
              borderRadius: 'shape.borderRadius',
              p: 2,
              animation: 'fadeIn 0.5s ease-in-out',
            },
          }}
        >
          <DialogTitle sx={{ fontWeight: 700, color: 'text.primary' }}>
            Enter OTP
          </DialogTitle>
          <DialogContent>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              An OTP has been sent to your email. Please enter it below.
            </Typography>
            <TextField
              label="OTP"
              fullWidth
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              autoFocus
              sx={{ mt: 1 }}
              InputLabelProps={{ sx: { fontWeight: 500 } }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setStep(1)} disabled={loading}>
              Cancel
            </Button>
            <Button
              onClick={handleChangePassword}
              variant="contained"
              color="primary"
              disabled={loading || !otp}
            >
              Submit
            </Button>
          </DialogActions>
          {loading && (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
              <CircularProgress size={24} />
            </Box>
          )}
        </Dialog>
      </Container>
    </CustomerLayout>
  );
}
