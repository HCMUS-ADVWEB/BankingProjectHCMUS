import { useAuth } from '../../contexts/AuthContext';
import { Container, Grid, Card, Typography, Chip } from '@mui/material';
import CustomerLayout from '../../layouts/CustomerLayout';

export default function CustomerDashboard() {
  const { state } = useAuth();
  return (
    <CustomerLayout>
      <Container maxWidth="xl" sx={{ py: 4, bgcolor: 'background.default' }}>
        <Typography variant="h3" sx={{ fontWeight: 700, color: 'text.primary', mb: 2 }}>
          Welcome, {state.user?.fullName || 'User'}! 👋
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          Your dashboard provides a quick overview of your accounts and recent activity.
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ p: 2 }}>
              <Typography variant="h6" color="text.primary">Accounts</Typography>
              <Typography variant="h4" color="primary.main" sx={{ fontWeight: 700 }}>3</Typography>
              <Chip label="Active" color="success" size="small" sx={{ mt: 1 }} />
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ p: 2 }}>
              <Typography variant="h6" color="text.primary">Total Balance</Typography>
              <Typography variant="h4" color="primary.main" sx={{ fontWeight: 700 }}>$12,345</Typography>
              <Chip label="+2% this month" color="success" size="small" sx={{ mt: 1 }} />
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ p: 2 }}>
              <Typography variant="h6" color="text.primary">Recent Transactions</Typography>
              <Typography variant="h4" color="primary.main" sx={{ fontWeight: 700 }}>8</Typography>
              <Chip label="Updated" color="info" size="small" sx={{ mt: 1 }} />
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ p: 2 }}>
              <Typography variant="h6" color="text.primary">Debts</Typography>
              <Typography variant="h4" color="primary.main" sx={{ fontWeight: 700 }}>$1,200</Typography>
              <Chip label="Due soon" color="warning" size="small" sx={{ mt: 1 }} />
            </Card>
          </Grid>
        </Grid>
      </Container>
    </CustomerLayout>
  );
}
