import { useEffect, useState } from 'react';
import CustomerLayout from '../../layouts/CustomerLayout';
import api from '../../utils/api';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Skeleton,
  Alert,
  Divider,
} from '@mui/material';
import { AccountBalance, CreditCard } from '@mui/icons-material';

export default function AccountsPage() {
  const [account, setAccount] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    api
      .get('/api/accounts/my-account')
      .then((res) => {
        setAccount(res.data.data);
      })
      .catch((err) => setError(err.response?.data?.message || err.message))
      .finally(() => setLoading(false));
  }, []);

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
            Your Account 💳
          </Typography>
          <Typography variant="body1" color="text.secondary">
            View your account details, including account number and current
            balance.
          </Typography>
        </Box>

        {/* Loading State */}
        {loading && (
          <Box sx={{ mb: 4 }}>
            <Box sx={{ mb: 3 }}>
              <Typography variant="h5" color="text.primary">
                Account Overview
              </Typography>
              <Divider sx={{ mt: 1, mb: 3 }} />
            </Box>
            <Grid container spacing={3}>
              <Grid item size={12}>
                <Card
                  sx={{
                    borderRadius: 'shape.borderRadius',
                    p: 4,
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                >
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Box sx={{ mb: 4, display: 'flex', alignItems: 'center' }}>
                      <Skeleton
                        variant="circular"
                        width={28}
                        height={28}
                        sx={{ mr: 2 }}
                      />
                      <Box>
                        <Skeleton variant="text" width="30%" height={20} />
                        <Skeleton variant="text" width="50%" height={32} />
                      </Box>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Skeleton
                        variant="circular"
                        width={28}
                        height={28}
                        sx={{ mr: 2 }}
                      />
                      <Box>
                        <Skeleton variant="text" width="30%" height={20} />
                        <Skeleton variant="text" width="70%" height={48} />
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Box>
        )}

        {/* Error State */}
        {error && (
          <Alert
            severity="error"
            sx={{ mb: 4, borderRadius: 'shape.borderRadius' }}
          >
            {error}
          </Alert>
        )}

        {/* Account Section */}
        {!loading && !error && account && (
          <Box sx={{ mb: 4 }}>
            <Box sx={{ mb: 3 }}>
              <Typography variant="h5" color="text.primary">
                Account Overview
              </Typography>
              <Divider sx={{ mt: 1, mb: 3 }} />
            </Box>
            <Grid container spacing={3}>
              <Grid item size={12}>
                <Card
                  sx={{
                    borderRadius: 'shape.borderRadius',
                    p: 4,
                    display: 'flex',
                    flexDirection: 'column',
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
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Box sx={{ mb: 4, display: 'flex', alignItems: 'center' }}>
                      <CreditCard
                        sx={{ color: 'text.secondary', mr: 3, fontSize: 32 }}
                      />
                      <Box>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{
                            fontWeight: 500,
                            textTransform: 'uppercase',
                            mb: 1,
                          }}
                        >
                          Account Number
                        </Typography>
                        <Typography
                          variant="h5"
                          color="text.primary"
                          sx={{ fontWeight: 600, letterSpacing: '0.05em' }}
                        >
                          {account.accountNumber}
                        </Typography>
                      </Box>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <AccountBalance
                        sx={{ color: 'text.secondary', mr: 3, fontSize: 32 }}
                      />
                      <Box>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{
                            fontWeight: 500,
                            textTransform: 'uppercase',
                            mb: 1,
                          }}
                        >
                          Current Balance
                        </Typography>
                        <Typography
                          variant="h3"
                          color="primary.main"
                          sx={{ fontWeight: 800, letterSpacing: '-0.02em' }}
                        >
                          {account.balance.toLocaleString('en-US', {
                            style: 'currency',
                            currency: 'VND',
                          })}
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Box>
        )}

        {/* No Account State */}
        {!loading && !error && !account && (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="h6" color="text.primary" gutterBottom>
              No Account Found
            </Typography>
            <Typography variant="body1" color="text.secondary">
              You currently have no accounts. Contact support to open a new
              account.
            </Typography>
          </Box>
        )}
      </Container>
    </CustomerLayout>
  );
}
