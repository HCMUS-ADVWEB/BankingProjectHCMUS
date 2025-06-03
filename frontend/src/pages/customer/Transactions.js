import React, { useContext, useEffect } from 'react';
import { BankingContext } from '../../context/BankingContext';
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from '@mui/material';
import Loading from '../../components/Loading';
import styles from '../../styles/Transactions.module.css';

const Transactions = () => {
  const { state, fetchTransactions } = useContext(BankingContext);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  const getTransactionStyle = (type) => {
    switch (type) {
      case 'TRANSFER':
        return styles.transfer;
      case 'RECEIVED':
        return styles.received;
      case 'DEBT_PAYMENT':
        return styles.debtPayment;
      default:
        return '';
    }
  };

  return (
    <Box className={styles.transactions}>
      <Typography variant="h4" className={styles.title}>
        Transaction History
      </Typography>
      {state.loading ? (
        <Loading />
      ) : (
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Type</TableCell>
              <TableCell>From</TableCell>
              <TableCell>To</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {state.transactions
              .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
              .map((transaction) => (
                <TableRow key={transaction.id} className={getTransactionStyle(transaction.type)}>
                  <TableCell>{transaction.type}</TableCell>
                  <TableCell>{transaction.fromAccountNumber}</TableCell>
                  <TableCell>{transaction.toAccountNumber}</TableCell>
                  <TableCell>{transaction.amount.toLocaleString()} VND</TableCell>
                  <TableCell>{new Date(transaction.createdAt).toLocaleString()}</TableCell>
                  <TableCell>{transaction.status}</TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      )}
    </Box>
  );
};

export default Transactions;