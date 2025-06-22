import CustomerLayout from '../../layouts/CustomerLayout';
import { useAuth } from '../../contexts/AuthContext';
import { Box, Typography, Paper } from '@mui/material';

export default function CustomerDashboard() {
  const { state } = useAuth();
  return (
    <CustomerLayout>
      <Box p={3}>
        <Typography variant="h3" gutterBottom>Welcome, {state.user?.fullName || 'Customer'}!</Typography>
        <Paper style={{ padding: 16, marginTop: 16 }}>
          <Typography variant="h5">Your Banking Dashboard</Typography>
          <Typography variant="body1" style={{ marginTop: 8 }}>
            Here you can view your accounts, manage recipients, transfer money, check debts, and more.
          </Typography>
        </Paper>
      </Box>
    </CustomerLayout>
  );
}
