import { useAccount, AccountProvider } from '../../contexts/customer/AccountContext';
import CustomerLayout from '../../layouts/CustomerLayout';
import {
  Box, Container, Typography, Grid, Card, CardContent, Alert, Divider,
} from '@mui/material';
import { AccountBalance, CreditCard } from '@mui/icons-material';
import Loading from '../../components/Loading';
import NotFound from '../../components/NotFound';

function AccountsPage() {
  const { account, loading, error } = useAccount();

  if (loading) {
    return <Loading />;
  }

  if (!loading && !error && !account) {
    return <NotFound message="No account found. Please contact support." />;
  }

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
          <Typography variant="h3" sx={{ fontWeight: 700, color: 'text.primary', mb: 1 }}>
            Your Account 💳
          </Typography>
          <Typography variant="body1" color="text.secondary">
            View your account details, including account number and current balance.
          </Typography>
        </Box>

        {/* Error State */}
        {error && (
          <Alert severity="error" sx={{ mb: 4, borderRadius: 'shape.borderRadius' }}>
            {error}
          </Alert>
        )}

        {/* Account Section */}
        {!loading && !error && account && (
          <Box sx={{ mb: 4 }}>
            <Box sx={{ mb: 3 }}>
              <Typography variant="h5" color="text.primary">Account Overview</Typography>
              <Divider sx={{ mt: 1, mb: 3 }} />
            </Box>

            <Card sx={{ p: 3, borderRadius: 'shape.borderRadius' }}>
              <CardContent>
                <Box sx={{ mb: 4, display: 'flex', alignItems: 'center' }}>
                  <CreditCard sx={{ color: 'text.secondary', mr: 3, fontSize: 32 }} />
                  <Box>
                    <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500, textTransform: 'uppercase', mb: 1 }}>
                      Account Number
                    </Typography>
                    <Typography variant="h5" color="text.primary" sx={{ fontWeight: 600, letterSpacing: '0.05em' }}>
                      {account.accountNumber}
                    </Typography>
                  </Box>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <AccountBalance sx={{ color: 'text.secondary', mr: 3, fontSize: 32 }} />
                  <Box>
                    <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500, textTransform: 'uppercase', mb: 1 }}>
                      Current Balance
                    </Typography>
                    <Typography variant="h3" color="primary.main" sx={{ fontWeight: 800, letterSpacing: '-0.02em' }}>
                      {account.balance.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Box>
        )}
      </Container>
    </CustomerLayout>
  );
}

export default function Accounts() {
  return (
    <AccountProvider>
      <AccountsPage />
    </AccountProvider>
  );
}
