import React, { useContext, useEffect, useState } from 'react';
import { BankingContext } from '../../context/BankingContext';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import {
  Button,
  TextField,
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import Loading from '../../components/Loading';
import styles from '../../styles/Debt.module.css';

const Debt = () => {
  const { state, fetchDebts, addDebt, updateDebt } = useContext(BankingContext);
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [selectedDebtId, setSelectedDebtId] = useState(null);
  const [openCancelDialog, setOpenCancelDialog] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  const [cancelDebtId, setCancelDebtId] = useState(null);

  useEffect(() => {
    fetchDebts();
  }, [fetchDebts]);

  const handleCreateDebt = async (values, { resetForm }) => {
    // Mock API to fetch debtor name
    const debtorName = 'Auto Fetched Name';
    await addDebt({ ...values, debtorName });
    resetForm();
  };

  const handleCancelDebt = async () => {
    if (!cancelReason) {
      alert('Please enter a cancellation reason');
      return;
    }
    // Mock API to notify debtor or creditor
    await updateDebt({ id: cancelDebtId, status: 'CANCELLED', cancelledReason: cancelReason });
    alert('Debt cancelled and notification sent');
    setOpenCancelDialog(false);
    setCancelReason('');
    setCancelDebtId(null);
  };

  const handlePayDebt = async (debtId) => {
    if (!otpSent) {
      // Mock OTP sending
      alert('OTP sent to your email');
      setOtpSent(true);
      setSelectedDebtId(debtId);
      return;
    }
    if (!otp) {
      alert('Please enter OTP');
      return;
    }
    // Mock transfer and update debt
    await updateDebt({ id: debtId, status: 'PAID', transactionId: Date.now() });
    alert('Debt paid and creditor notified');
    setOtpSent(false);
    setOtp('');
    setSelectedDebtId(null);
  };

  return (
    <Box className={styles.debt}>
      <Typography variant="h4" className={styles.title}>
        Debt Management
      </Typography>
      {state.loading ? (
        <Loading />
      ) : (
        <>
          <Typography variant="h6">Create Debt Reminder</Typography>
          <Formik
            initialValues={{
              debtor: '',
              amount: '',
              message: '',
            }}
            validate={(values) => {
              const errors = {};
              if (!values.debtor) errors.debtor = 'Required';
              if (!values.amount || values.amount <= 0) errors.amount = 'Invalid amount';
              return errors;
            }}
            onSubmit={handleCreateDebt}
          >
            {({ values }) => (
              <Form className={styles.form}>
                <FormControl fullWidth margin="normal">
                  <InputLabel>Debtor</InputLabel>
                  <Field as={Select} name="debtor">
                    {state.recipients.map((recipient) => (
                      <MenuItem
                        key={recipient.id}
                        value={recipient.recipientAccountNumber}
                      >
                        {recipient.recipientName} ({recipient.recipientAccountNumber})
                      </MenuItem>
                    ))}
                    <MenuItem value="new">New Debtor</MenuItem>
                  </Field>
                </FormControl>
                {values.debtor === 'new' && (
                  <Field
                    as={TextField}
                    name="newDebtorAccount"
                    label="Debtor Account Number"
                    fullWidth
                    margin="normal"
                  />
                )}
                <Field
                  as={TextField}
                  name="amount"
                  label="Amount"
                  type="number"
                  fullWidth
                  margin="normal"
                />
                <ErrorMessage name="amount" component="div" className={styles.error} />
                <Field
                  as={TextField}
                  name="message"
                  label="Message"
                  fullWidth
                  margin="normal"
                />
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  className={styles.submitButton}
                >
                  Create Debt
                </Button>
              </Form>
            )}
          </Formik>
          <Typography variant="h6" style={{ marginTop: '20px' }}>
            Debt List
          </Typography>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Debtor</TableCell>
                <TableCell>Amount</TableCell>
                <TableCell>Message</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {state.debts.map((debt) => (
                <TableRow key={debt.id}>
                  <TableCell>{debt.debtor}</TableCell>
                  <TableCell>{debt.amount.toLocaleString()} VND</TableCell>
                  <TableCell>{debt.message}</TableCell>
                  <TableCell>{debt.status}</TableCell>
                  <TableCell>
                    {debt.status === 'PENDING' && (
                      <>
                        <Button
                          onClick={() => {
                            setCancelDebtId(debt.id);
                            setOpenCancelDialog(true);
                          }}
                          color="error"
                        >
                          Cancel
                        </Button>
                        {debt.debtor === '1234567890' && (
                          <>
                            <Button
                              onClick={() => handlePayDebt(debt.id)}
                              color="primary"
                            >
                              {otpSent && selectedDebtId === debt.id
                                ? 'Confirm Payment'
                                : 'Pay Debt'}
                            </Button>
                            {otpSent && selectedDebtId === debt.id && (
                              <TextField
                                label="OTP"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                fullWidth
                                margin="normal"
                              />
                            )}
                          </>
                        )}
                      </>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <Dialog open={openCancelDialog} onClose={() => setOpenCancelDialog(false)}>
            <DialogTitle>Cancel Debt</DialogTitle>
            <DialogContent>
              <TextField
                label="Cancellation Reason"
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                fullWidth
                margin="normal"
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setOpenCancelDialog(false)} color="secondary">
                Close
              </Button>
              <Button onClick={handleCancelDebt} color="primary">
                Confirm
              </Button>
            </DialogActions>
          </Dialog>
        </>
      )}
    </Box>
  );
};

export default Debt;