import React, { useContext, useEffect } from 'react';
import { BankingContext } from '../../context/BankingContext';
import { Typography, Box, Paper, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import Loading from '../../components/Loading';
import styles from '../../styles/Dashboard.module.css';

const Dashboard = () => {
  const { state, fetchAccounts } = useContext(BankingContext);

  useEffect(() => {
    fetchAccounts();
  }, [fetchAccounts]);

  return (
    <Box className={styles.dashboard}>
      <Typography variant="h4" className={styles.title}>
        Account Dashboard
      </Typography>
      {state.loading ? (
        <Loading />
      ) : (
        <Paper className={styles.paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Account Number</TableCell>
                <TableCell>Balance</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {state.accounts.map((account) => (
                <TableRow key={account.id}>
                  <TableCell>{account.number}</TableCell>
                  <TableCell>{account.balance.toLocaleString()} VND</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      )}
    </Box>
  );
};

export default Dashboard;