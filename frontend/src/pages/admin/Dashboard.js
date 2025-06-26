import { useState } from 'react';
import {
  Box,
  Grid,
  Typography,
  Card,
  CardContent,
  Select,
  MenuItem,
  FormControl,
} from '@mui/material';
import {
  DatePicker,
  LocalizationProvider,
} from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { BarChart } from '@mui/x-charts';
import AdminLayout from '../../layouts/AdminLayout';

const bankList = ['All Banks', 'Bank A', 'Bank B', 'Bank C'];

const transactionData = {
  'All Banks': [
    { month: 'Jan', amount: 300000 },
    { month: 'Feb', amount: 270000 },
    { month: 'Mar', amount: 340000 },
    { month: 'Apr', amount: 310000 },
    { month: 'May', amount: 360000 },
    { month: 'Jun', amount: 320000 },
  ],
  'Bank A': [
    { month: 'Jan', amount: 120000 },
    { month: 'Feb', amount: 95000 },
    { month: 'Mar', amount: 134000 },
    { month: 'Apr', amount: 110500 },
    { month: 'May', amount: 160200 },
    { month: 'Jun', amount: 143800 },
  ],
  'Bank B': [
    { month: 'Jan', amount: 80000 },
    { month: 'Feb', amount: 75000 },
    { month: 'Mar', amount: 90000 },
    { month: 'Apr', amount: 85000 },
    { month: 'May', amount: 95000 },
    { month: 'Jun', amount: 97000 },
  ],
  'Bank C': [
    { month: 'Jan', amount: 100000 },
    { month: 'Feb', amount: 100000 },
    { month: 'Mar', amount: 116000 },
    { month: 'Apr', amount: 114500 },
    { month: 'May', amount: 104800 },
    { month: 'Jun', amount: 112200 },
  ],
};

const transactionTypes = ['All', 'Transfer', 'Deposit', 'Withdrawal'];

export default function AdminDashboard() {
  const [selectedBank, setSelectedBank] = useState('All Banks');
  const transactionStats = transactionData[selectedBank];
  const totalTransactions = transactionStats.reduce((sum, t) => sum + t.amount, 0);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [transactionType, setTransactionType] = useState('All');

  return (
    <AdminLayout>
      <Box sx={{ p: 3, bgcolor: '#121212', minHeight: '100vh' }}>
        <Typography variant="h4" gutterBottom sx={{ color: '#fff' }}>
          Bank Transaction Statistics
        </Typography>

        <Grid container spacing={2} mb={3}>
          {/* Bank Picker */}
          <Grid item xs={12} md={3}>
            <FormControl fullWidth>
              <Typography variant="subtitle1" sx={{ color: '#90caf9', mb: 0.5 }}>
                Select Bank
              </Typography>
              <Select
                value={selectedBank}
                onChange={(e) => setSelectedBank(e.target.value)}
                sx={{
                  color: '#fff',
                  bgcolor: '#1e1e1e',
                  borderRadius: 1,
                }}
              >
                {bankList.map((bank) => (
                  <MenuItem key={bank} value={bank}>
                    {bank}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {/* Date Picker */}
          <Grid item xs={12} md={3}>
            <Typography variant="subtitle1" sx={{ color: '#90caf9', mb: 0.5 }}>
              Select Month
            </Typography>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                views={['year', 'month']}
                value={selectedDate}
                onChange={(newValue) => setSelectedDate(newValue)}
                sx={{
                  bgcolor: '#1e1e1e',
                  input: { color: '#fff' },
                  svg: { color: '#90caf9' },
                  borderRadius: 1,
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#555',
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#90caf9',
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#90caf9',
                  },
                }}
              />
            </LocalizationProvider>

          </Grid>

          {/* Transaction Type Picker */}
          <Grid item xs={12} md={3}>
            <FormControl fullWidth>
              <Typography variant="subtitle1" sx={{ color: '#90caf9', mb: 0.5 }}>
                Transaction Type
              </Typography>
              <Select
                value={transactionType}
                onChange={(e) => setTransactionType(e.target.value)}
                sx={{
                  color: '#fff',
                  bgcolor: '#1e1e1e',
                  borderRadius: 1,
                }}
              >
                {transactionTypes.map((type) => (
                  <MenuItem key={type} value={type}>
                    {type}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>

        <Grid container spacing={3} mb={4}>
          <Grid item xs={12} md={4}>
            <Card sx={{ bgcolor: '#1e1e1e', color: '#fff' }}>
              <CardContent>
                <Typography variant="h6">Total Transaction Volume</Typography>
                <Typography variant="h5" color="success.main">
                  ${totalTransactions.toLocaleString()}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card sx={{ bgcolor: '#1e1e1e', color: '#fff' }}>
              <CardContent>
                <Typography variant="h6">Best Month</Typography>
                <Typography variant="h5" color="success.main">
                  {
                    transactionStats.reduce((a, b) => (a.amount > b.amount ? a : b))
                      .month
                  }
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card sx={{ bgcolor: '#1e1e1e', color: '#fff' }}>
              <CardContent>
                <Typography variant="h6">Average Monthly Volume</Typography>
                <Typography variant="h5" color="info.main">
                  ${Math.round(totalTransactions / transactionStats.length).toLocaleString()}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Card sx={{ bgcolor: '#1e1e1e', color: '#fff' }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Transaction Volume by Month ({selectedBank})
            </Typography>
            <BarChart
              xAxis={[
                {
                  scaleType: 'band',
                  data: transactionStats.map((item) => item.month),
                  label: 'Month',
                },
              ]}
              series={[
                {
                  data: transactionStats.map((item) => item.amount),
                  label: 'Transaction Amount ($)',
                  color: '#42a5f5',
                },
              ]}
              height={300}
              margin={{ top: 20, right: 30, bottom: 30, left: 60 }}
              yAxis={[
                {
                  label: 'Amount ($)',
                  valueFormatter: (value) => `$${value.toLocaleString()}`,
                },
              ]}
            />
          </CardContent>
        </Card>
      </Box>
    </AdminLayout>
  );
}
