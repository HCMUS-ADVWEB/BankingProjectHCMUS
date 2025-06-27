import { Box, Paper, Typography, Avatar } from '@mui/material';
import { AccountBalance as AccountBalanceIcon } from '@mui/icons-material';

function TransactionSummary({ statistics }) {
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
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <Avatar
          sx={{
            bgcolor: 'linear-gradient(to right, #10b981, #06b6d4)',
            color: 'white',
            mr: 2,
            width: 40,
            height: 40,
          }}
        >
          <AccountBalanceIcon />
        </Avatar>
        <Typography
          variant="h6"
          sx={{
            fontWeight: 600,
            background: 'linear-gradient(to right, #10b981, #06b6d4)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          Transaction Summary
        </Typography>
      </Box>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Total amount of transactions processed.
      </Typography>
      <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1 }}>
        <Typography
          variant="h5"
          sx={{
            fontWeight: 700,
            background: 'linear-gradient(to right, #10b981, #06b6d4)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          {statistics ? statistics.toLocaleString() : '0'}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          VNĐ
        </Typography>
      </Box>
    </Paper>
  );
}

export default TransactionSummary;
