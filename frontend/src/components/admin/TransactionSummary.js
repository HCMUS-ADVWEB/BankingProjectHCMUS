import { Typography } from '@mui/material';

function TransactionSummary({ statistics }) {
  return (
    <Typography variant="h6" sx={{ color: 'text.primary', mb: 2 }}>
      Total Transaction Amount: {statistics ? statistics.toLocaleString() : '0'} VNĐ
    </Typography>
  );
}

export default TransactionSummary;
