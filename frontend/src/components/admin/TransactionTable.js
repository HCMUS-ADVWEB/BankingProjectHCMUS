import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';

function TransactionTable({ transactions }) {
  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Date</TableCell>
            <TableCell>From Bank</TableCell>
            <TableCell>To Bank</TableCell>
            <TableCell>Amount (VNĐ)</TableCell>
            <TableCell>Message</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {transactions && transactions.listTransaction.length > 0 ? (
            transactions.listTransaction.map((tx) => (
              <TableRow key={tx.id}>
                <TableCell>
                  {new Intl.DateTimeFormat('vi-VN', {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit',
                  }).format(new Date(tx.transactionDate))}
                </TableCell>
                <TableCell>{tx.fromBankCode || 'FIN'}</TableCell>
                <TableCell>{tx.toBankCode || 'FIN'}</TableCell>
                <TableCell>{tx.amount?.toLocaleString()}</TableCell>
                <TableCell>{tx.message || 'N/A'}</TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={5}
                sx={{ color: 'text.secondary', textAlign: 'center' }}
              >
                No transactions found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default TransactionTable;
