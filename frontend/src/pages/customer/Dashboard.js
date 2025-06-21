import CustomerLayout from '../../layouts/CustomerLayout';
import { useAuth } from '../../contexts/AuthContext';
import { Box, Typography, Paper } from '@mui/material';

export default function CustomerDashboard() {
  const { state } = useAuth();
  return (
    <CustomerLayout>
      <Box sx={{ p: 3 }}>
        <Typography variant="h3" gutterBottom>Welcome, {state.user?.fullName || 'Customer'}!</Typography>
        <Paper sx={{ p: 2, mt: 2 }}>
          <Typography variant="h5">Your Banking Dashboard</Typography>
          <Typography variant="body1" sx={{ mt: 1 }}>
            Here you can view your accounts, manage recipients, transfer money, check debts, and more.
          </Typography>
        </Paper>
      </Box>
    </CustomerLayout>
  );
}
