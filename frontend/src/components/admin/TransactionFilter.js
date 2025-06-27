import { Grid, FormControl, Select, MenuItem, Typography, Paper } from '@mui/material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

function TransactionFilter({
  selectedBank,
  selectedDate,
  banks,
  onBankChange,
  onDateChange,
}) {
  return (
    <Paper
      sx={{
        p: 3,
        mb: 4,
        borderRadius: 'shape.borderRadius',
        bgcolor: 'background.paper',
        backdropFilter: 'blur(8px)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        animation: 'fadeIn 0.5s ease-in-out',
        '@keyframes fadeIn': {
          '0%': { opacity: 0, transform: 'translateY(-10px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
        '&:hover': {
          boxShadow: '0 12px 30px rgba(0, 0, 0, 0.2)',
          transform: 'translateY(-4px)',
          transition: 'all 0.3s ease',
        },
      }}
    >
      <Typography
        variant="h6"
        sx={{
          fontWeight: 600,
          background: 'linear-gradient(to right, #10b981, #06b6d4)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          mb: 2,
        }}
      >
        Filter Transactions
      </Typography>
      <Grid container spacing={2}>
        <Grid item size={{ xs: 12, md: 6 }}>
          <FormControl fullWidth>
            <Typography
              variant="subtitle1"
              sx={{
                color: 'text.primary',
                fontWeight: 600,
                mb: 0.5,
              }}
            >
              Select Bank
            </Typography>
            <Select
              value={selectedBank}
              onChange={(e) => onBankChange(e.target.value)}
              variant="outlined"
              sx={{
                borderRadius: 'shape.borderRadius',
                '&:hover': {
                  bgcolor: 'action.hover',
                  transform: 'translateY(-2px)',
                  transition: 'all 0.3s ease',
                },
              }}
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

        <Grid item size={{ xs: 12, md: 6 }}>
          <Typography
            variant="subtitle1"
            sx={{
              color: 'text.primary',
              fontWeight: 600,
              mb: 0.5,
            }}
          >
            Select Month
          </Typography>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              views={['year', 'month']}
              value={selectedDate}
              onChange={(newValue) => onDateChange(newValue)}
              slotProps={{
                textField: {
                  variant: 'outlined',
                  fullWidth: true,
                  sx: {
                    borderRadius: 'shape.borderRadius',
                    '&:hover': {
                      bgcolor: 'action.hover',
                      transform: 'translateY(-2px)',
                      transition: 'all 0.3s ease',
                    },
                  },
                },
              }}
            />
          </LocalizationProvider>
        </Grid>
      </Grid>
    </Paper>
  );
}

export default TransactionFilter;
