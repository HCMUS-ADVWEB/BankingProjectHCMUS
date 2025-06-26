import EmployeeLayout from '../../layouts/EmployeeLayout';
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
  Home,
  PersonAdd,
  AddCard,
  History,
} from '@mui/icons-material';
import { Link } from 'react-router-dom';

export default function EmployeeDashboard() {
  const { state } = useAuth();

  const quickActions = [
    {
      title: 'Create Account',
      icon: <PersonAdd />,
      description:
        'Create new customer accounts by entering required details. Ensure secure account setup with verification steps.',
      link: '/employee/accounts',
      tooltip: 'Add new customer accounts',
    },
    {
      title: 'Deposit',
      icon: <AddCard />,
      description:
        'Process deposits into customer accounts. Verify account details and amount before confirming transactions.',
      link: '/employee/deposit',
      tooltip: 'Deposit funds to accounts',
    },
    {
      title: 'Transactions',
      icon: <History />,
      description:
        'Review transaction history for all customer accounts, sorted by date, with details on transfers and deposits.',
      link: '/employee/transactions',
      tooltip: 'View transaction history',
    },
  ];

  return (
    <EmployeeLayout>
      <Container
        maxWidth="xl"
        sx={{ py: 4, bgcolor: 'background.default', minHeight: '100vh' }}
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
            Welcome, {state.user?.fullName || 'Employee'}! 👋
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Your dashboard provides quick access to banking operations for efficient management.
          </Typography>
        </Box>

        {/* Quick Actions Section */}
        <Box sx={{ mb: 4 }}>
          <Box sx={{ mb: 3 }}>
            <Typography variant="h5" color="text.primary">
              Banking Operations
            </Typography>
            <Divider sx={{ mt: 1, mb: 2 }} />
          </Box>
          <Grid container spacing={3}>
            {quickActions.map((action, index) => (
              <Grid item size={{ xs: 12, sm: 6, md: 4 }} key={index}>
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
                            bgcolor: 'linear-gradient(to right, #10b981, #06b6d4)',
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
    </EmployeeLayout>
  );
}
