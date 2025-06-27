import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Box,
  Chip,
} from '@mui/material';
import { format } from 'date-fns';

function TransactionTable({ transactions }) {
  return (
    <Box>
      <TableContainer
        component={Paper}
        sx={{
          borderRadius: 'shape.borderRadius',
          bgcolor: 'background.paper',
          backdropFilter: 'blur(8px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          animation: 'fadeIn 0.5s ease-in-out',
          '@keyframes fadeIn': {
            '0%': { opacity: 0, transform: 'translateY(-10px)' },
            '100%': { opacity: 1, transform: 'translateY(0)' },
          },
        }}
      >
        <Table>
          <TableHead>
            <TableRow
              sx={{
                bgcolor: 'linear-gradient(to right, #10b981, #06b6d4)',
              }}
            >
              <TableCell sx={{ color: 'white', fontWeight: 600, fontSize: '1rem', width: 200 }}>
                Date
              </TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 600, fontSize: '1rem', width: 150 }}>
                From Bank
              </TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 600, fontSize: '1rem', width: 150 }}>
                To Bank
              </TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 600, fontSize: '1rem', width: 180 }}>
                Amount (VNĐ)
              </TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 600, fontSize: '1rem', width: 250 }}>
                Message
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {transactions && transactions.listTransaction?.length > 0 ? (
              transactions.listTransaction.map((tx) => {
                const isOutgoing = !tx.fromBankCode; // Money leaving system (from FIN)
                const isIncoming = !tx.toBankCode; // Money entering system (to FIN)
                return (
                  <TableRow
                    key={tx.id}
                    sx={{
                      '&:hover': {
                        bgcolor: 'action.hover',
                        transition: 'background 0.3s ease',
                      },
                    }}
                  >
                    <TableCell sx={{ color: 'text.primary' }}>
                      <Typography variant="body2">
                        {tx.transactionDate
                          ? format(new Date(tx.transactionDate), 'dd/MM/yyyy HH:mm')
                          : '-'}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ color: 'text.primary' }}>
                      {isOutgoing ? (
                        <Chip
                          size="small"
                          label="FIN (System)"
                          sx={{
                            bgcolor: 'linear-gradient(to right, #10b981, #06b6d4)',
                            color: 'white',
                            fontWeight: 600,
                            borderRadius: '12px',
                          }}
                        />
                      ) : (
                        tx.fromBankCode || '-'
                      )}
                    </TableCell>
                    <TableCell sx={{ color: 'text.primary' }}>
                      {isIncoming ? (
                        <Chip
                          size="small"
                          label="FIN (System)"
                          sx={{
                            bgcolor: 'linear-gradient(to right, #10b981, #06b6d4)',
                            color: 'white',
                            fontWeight: 600,
                            borderRadius: '12px',
                          }}
                        />
                      ) : (
                        tx.toBankCode || '-'
                      )}
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{color: isOutgoing ? 'error.main' : isIncoming ? 'primary.main' : 'text.primary'}} >
                        {isOutgoing ? '🔴' : (isIncoming ? '🟢' :'⚪')} {tx.amount?.toLocaleString() || '0'}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ color: 'text.primary' }}>
                      <Typography variant="body2">{tx.message || 'N/A'}</Typography>
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell
                  colSpan={5}
                  sx={{ color: 'text.secondary', textAlign: 'center', py: 4 }}
                >
                  No transactions found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

export default TransactionTable;
