import CustomerLayout from '../../layouts/CustomerLayout';
import { useAuth } from '../../contexts/AuthContext';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Avatar,
  Divider,
  Tooltip,
} from '@mui/material';
import {
  AccountBalance,
  Send,
  History,
  People,
  TextSnippet,
  Lock,
} from '@mui/icons-material';
import { Link } from 'react-router-dom';

export default function CustomerDashboard() {
  const { state } = useAuth();

  const quickActions = [
    {
      title: 'Accounts',
      icon: <AccountBalance />,
      description:
        'View all your accounts with their account numbers and current balances. Manage your primary payment account effortlessly.',
      link: '/customer/accounts',
      tooltip: 'Manage your bank accounts',
    },
    {
      title: 'Transfer',
      icon: <Send />,
      description:
        'Transfer money internally or to other banks. Select recipients from your saved list or enter new account details, with OTP verification for security.',
      link: '/customer/transfer',
      tooltip: 'Send money securely',
    },
    {
      title: 'Recipients',
      icon: <People />,
      description:
        'Manage your list of recipients. Add, edit, or remove recipient details, including account numbers and memorable names for easy transfers.',
      link: '/customer/recipients',
      tooltip: 'Organize your payees',
    },
    {
      title: 'Debts',
      icon: <TextSnippet />,
      description:
        'Create, view, or settle debt reminders. Send notifications to debtors or pay outstanding debts with secure OTP-confirmed transfers.',
      link: '/customer/debts',
      tooltip: 'Track and settle debts',
    },
    {
      title: 'Transactions',
      icon: <History />,
      description:
        'Review your transaction history, including incoming transfers, payments, and debt settlements, sorted from newest to oldest.',
      link: '/customer/transactions',
      tooltip: 'View transaction history',
    },
    {
      title: 'Change Password',
      icon: <Lock />,
      description:
        'Securely update your password using strong encryption. Reset forgotten passwords with OTP verification sent to your email.',
      link: '/customer/change-password',
      tooltip: 'Update your security',
    },
  ];

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
            p: 3,
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
            Welcome, {state.user?.fullName || 'Customer'}! 👋
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Your dashboard provides a quick overview of your banking features
            and actions.
          </Typography>
        </Box>

        {/* Quick Actions Section */}
        <Box sx={{ mb: 4 }}>
          <Box sx={{ mb: 3 }}>
            <Typography variant="h5" color="text.primary">
              Quick Actions
            </Typography>
            <Divider sx={{ mt: 1, mb: 2 }} />
          </Box>
          <Grid container spacing={3}>
            {quickActions.map((action, index) => (
              <Grid item size={{ sx: 12, sm: 6, md: 4 }} key={index}>
                <Card
                  sx={{
                    borderRadius: 'shape.borderRadius',
                    p: 2,
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: '0 12px 30px rgba(0, 0, 0, 0.4)',
                    },
                    animation: `fadeInUp 0.5s ease-in-out ${index * 0.1}s`,
                    '@keyframes fadeInUp': {
                      '0%': { opacity: 0, transform: 'translateY(20px)' },
                      '100%': { opacity: 1, transform: 'translateY(0)' },
                    },
                  }}
                >
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Tooltip title={action.tooltip}>
                        <Avatar
                          sx={{
                            bgcolor:
                              'linear-gradient(to right, #10b981, #06b6d4)',
                            color: 'white',
                            mr: 2,
                            width: 40,
                            height: 40,
                          }}
                        >
                          {action.icon}
                        </Avatar>
                      </Tooltip>
                      <Typography variant="h6" color="text.primary">
                        {action.title}
                      </Typography>
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      {action.description}
                    </Typography>
                  </CardContent>
                  <Box sx={{ p: 2 }}>
                    <Button
                      variant="contained"
                      color="primary"
                      fullWidth
                      component={Link}
                      to={action.link}
                      sx={{ py: 1.5 }}
                    >
                      Go to {action.title}
                    </Button>
                  </Box>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Container>
    </CustomerLayout>
  );
}
