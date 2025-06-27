import { useState, useEffect, useMemo } from 'react';
import {
  Box, Container, Grid, Typography, Card, CardContent, FormControl, Select, MenuItem,
  Paper, Snackbar, Alert, Avatar, Backdrop, CircularProgress,
} from '@mui/material';
import {
  DatePicker, LocalizationProvider,
} from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { BarChart } from '@mui/x-charts';
import AdminLayout from '../../layouts/AdminLayout';
import {
  BankStatisticsProvider,
  useBankStatistics,
} from '../../contexts/admin/BankStatisticsContext';
import { Equalizer as StatsIcon } from '@mui/icons-material';

export function DashboardContent() {
  const {
    statisticsByMonth,
    totalYearTransactions,
    totalYearAmount,
    banks,
    loading,
    error,
    fetchBanks,
    fetchStatisticsForYear,
  } = useBankStatistics();

  const [selectedBank, setSelectedBank] = useState('All Banks');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const selectedYear = selectedDate.getFullYear();

  // Fetch banks when component mounts
  useEffect(() => {
    fetchBanks();
  }, [fetchBanks]);

  // Fetch statistics when bank or year changes
  useEffect(() => {
    fetchStatisticsForYear({
      year: selectedYear,
      bankCode: selectedBank === 'All Banks' ? null : selectedBank,
    });
  }, [selectedBank, selectedYear, fetchStatisticsForYear]);

  // Show error in snackbar
  useEffect(() => {
    if (error) {
      setSnackbarOpen(true);
    }
  }, [error]);

  const bestMonth = useMemo(() => {
    if (statisticsByMonth.length === 0) return '-';
    return statisticsByMonth.reduce((a, b) =>
      a.totalAmount > b.totalAmount ? a : b,
    ).month;
  }, [statisticsByMonth]);

  const averageAmount = useMemo(() => {
    if (statisticsByMonth.length === 0) return 0;
    return Math.round(totalYearAmount / statisticsByMonth.length);
  }, [statisticsByMonth, totalYearAmount]);

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  const formatVND = (value) => {
    if (!value) return '0 VNĐ';
    return `${new Intl.NumberFormat('vi-VN').format(value)} VNĐ`;
  };

  return (
    <AdminLayout>
      <Container
        maxWidth="2xl"
        sx={{ py: 4, bgcolor: 'background.default', minHeight: '100vh' }}
      >
        <Backdrop
          sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={loading}
        >
          <CircularProgress color="inherit" />
        </Backdrop>

        {/* Snackbar for error messages */}
        {error && (
          <Snackbar
            open={snackbarOpen}
            autoHideDuration={5000}
            onClose={handleCloseSnackbar}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          >
            <Alert
              onClose={handleCloseSnackbar}
              severity="error"
              sx={{ width: '100%' }}
            >
              {error}
            </Alert>
          </Snackbar>
        )}

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
            sx={{
              fontWeight: 700,
              color: 'text.primary',
              mb: 1,
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <Avatar
              sx={{
                bgcolor: 'linear-gradient(to right, #10b981, #06b6d4)',
                color: 'white',
                mr: 2,
                width: 40,
                height: 40,
              }}
            >
              <StatsIcon />
            </Avatar>
            Bank Transaction Statistics
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Overview of transaction volume and count by bank and year.
          </Typography>
        </Box>

        {/* Filter Section */}
        <Paper
          elevation={3}
          sx={{
            p: { xs: 2, sm: 3 },
            mb: 5,
            borderRadius: 'shape.borderRadius',
            bgcolor: 'background.paper',
            transition: 'all 0.3s ease',
            '&:hover': {
              transform: 'translateY(-4px)',
              boxShadow: '0 16px 40px rgba(0, 0, 0, 0.2)',
            },
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
            Filter Statistics
          </Typography>
          <Grid container spacing={2}>
            <Grid item size={{ sx: 12, sm: 6 }}>
              <FormControl fullWidth variant="outlined">
                <Typography variant="subtitle1" sx={{ color: 'text.secondary', mb: 0.5 }}>
                  Select Bank
                </Typography>
                <Select
                  value={selectedBank}
                  onChange={(e) => setSelectedBank(e.target.value)}
                  sx={{ borderRadius: 'shape.borderRadius' }}
                >
                  <MenuItem value="All Banks">All Banks</MenuItem>
                  {banks.map((bank) => (
                    <MenuItem key={bank.bankCode} value={bank.bankCode}>
                      {bank.bankName}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item size={{ sx: 12, sm: 6 }}>
              <Typography variant="subtitle1" sx={{ color: 'text.secondary', mb: 0.5 }}>
                Select Year
              </Typography>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  views={['year']}
                  value={selectedDate}
                  onChange={(newValue) => setSelectedDate(newValue)}
                  slotProps={{
                    textField: {
                      variant: 'outlined',
                      fullWidth: true,
                      sx: {
                        '& .MuiOutlinedInput-notchedOutline': { borderColor: 'divider' },
                        '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'primary.main' },
                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: 'primary.main' },
                      },
                    },
                  }}
                />
              </LocalizationProvider>
            </Grid>
          </Grid>
        </Paper>

        {/* Statistics Cards */}
        <Grid container spacing={3} mb={4}>
          <Grid item size={{ sx: 12, sm: 6, md: 3 }}>
            <Card
              sx={{
                bgcolor: 'background.paper',
                borderRadius: 'shape.borderRadius',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 12px 30px rgba(0, 0, 0, 0.4)',
                },
              }}
            >
              <CardContent>
                <Typography variant="h6" color="text.primary">
                  Total Transaction Volume
                </Typography>
                <Typography
                  variant="h5"
                  sx={{
                    background: 'linear-gradient(to right, #10b981, #06b6d4)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  {formatVND(totalYearAmount)}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item size={{ sx: 12, sm: 6, md: 3 }}>
            <Card
              sx={{
                bgcolor: 'background.paper',
                borderRadius: 'shape.borderRadius',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 12px 30px rgba(0, 0, 0, 0.4)',
                },
              }}
            >
              <CardContent>
                <Typography variant="h6" color="text.primary">
                  Total Transactions
                </Typography>
                <Typography
                  variant="h5"
                  sx={{
                    background: 'linear-gradient(to right, #10b981, #06b6d4)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  {totalYearTransactions.toLocaleString()}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item size={{ sx: 12, sm: 6, md: 3 }}>
            <Card
              sx={{
                bgcolor: 'background.paper',
                borderRadius: 'shape.borderRadius',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 12px 30px rgba(0, 0, 0, 0.4)',
                },
              }}
            >
              <CardContent>
                <Typography variant="h6" color="text.primary">
                  Best Month
                </Typography>
                <Typography
                  variant="h5"
                  sx={{
                    background: 'linear-gradient(to right, #10b981, #06b6d4)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  Month {bestMonth}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item size={{ sx: 12, sm: 6, md: 3 }}>
            <Card
              sx={{
                bgcolor: 'background.paper',
                borderRadius: 'shape.borderRadius',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 12px 30px rgba(0, 0, 0, 0.4)',
                },
              }}
            >
              <CardContent>
                <Typography variant="h6" color="text.primary">
                  Average Monthly Volume
                </Typography>
                <Typography
                  variant="h5"
                  sx={{
                    background: 'linear-gradient(to right, #10b981, #06b6d4)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  {formatVND(averageAmount)}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Chart Section */}
        <Paper
          elevation={3}
          sx={{
            p: { xs: 2, sm: 3 },
            borderRadius: 'shape.borderRadius',
            bgcolor: 'background.paper',
            transition: 'all 0.3s ease',
            '&:hover': {
              transform: 'translateY(-4px)',
              boxShadow: '0 16px 40px rgba(0, 0, 0, 0.2)',
            },
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
            Transaction Volume by Month ({selectedBank})
          </Typography>
          <BarChart
            xAxis={[{
              scaleType: 'band',
              data: statisticsByMonth.map((item) => `Month ${item.month}`),
              label: 'Month',
            }]}
            series={[{
              data: statisticsByMonth.map((item) => item.totalAmount),
              label: 'Transaction Amount (VNĐ)',
              color: '#10b981',
            }]}
            height={300}
            margin={{ top: 20, right: 30, bottom: 50, left: 60 }}
            yAxis={[{
              label: 'Amount (VNĐ)',
              valueFormatter: (value) => `${value.toLocaleString('vi-VN')}`,
            }]}
            sx={{
              '& .MuiChartsAxis-label': {
                fill: 'text.secondary',
              },
              '& .MuiChartsAxis-tick': {
                stroke: 'text.secondary',
              },
              '& .MuiChartsAxis-line': {
                stroke: 'text.secondary',
              },
            }}
          />
        </Paper>
      </Container>
    </AdminLayout>
  );
}

export default function AdminDashboard() {
  return (
    <BankStatisticsProvider>
      <DashboardContent />
    </BankStatisticsProvider>
  );
}
