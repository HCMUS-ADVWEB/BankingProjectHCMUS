import React, { useContext, useState } from 'react';
import { BankingContext } from '../../context/BankingContext';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import {
  Button,
  TextField,
  Box,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import styles from '../../styles/Transfer.module.css';

const Transfer = () => {
  const { state, addRecipient } = useContext(BankingContext);
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [newRecipient, setNewRecipient] = useState(null);

  const handleSendOtp = async (values) => {
    // Mock OTP sending
    alert('OTP sent to your email');
    setOtpSent(true);
  };

  const handleSaveRecipient = async () => {
    if (newRecipient) {
      // Mock API to fetch recipient name if not provided
      const recipientName = newRecipient.recipientName || 'Auto Fetched Name';
      await addRecipient({
        recipientAccountNumber: newRecipient.recipientAccountNumber,
        recipientName,
      });
    }
    setOpenDialog(false);
    setNewRecipient(null);
  };

  return (
    <Box className={styles.transfer}>
      <Typography variant="h4" className={styles.title}>
        Transfer Money
      </Typography>
      <Formik
        initialValues={{
          sourceAccount: '',
          recipient: '',
          amount: '',
          message: '',
          feeType: 'SENDER',
          bank: 'internal',
          newRecipientAccount: '',
          newRecipientName: '',
        }}
        validate={(values) => {
          const errors = {};
          if (!values.sourceAccount) errors.sourceAccount = 'Required';
          if (!values.recipient) errors.recipient = 'Required';
          if (!values.amount || values.amount <= 0) errors.amount = 'Invalid amount';
          if (values.recipient === 'new' && !values.newRecipientAccount)
            errors.newRecipientAccount = 'Required';
          return errors;
        }}
        onSubmit={(values, { resetForm }) => {
          if (!otpSent) {
            handleSendOtp(values);
            return;
          }
          if (!otp) {
            alert('Please enter OTP');
            return;
          }
          // Mock transfer
          alert(`Transfer successful: ${values.amount} VND to ${values.recipient}`);
          if (values.recipient === 'new') {
            setNewRecipient({
              recipientAccountNumber: values.newRecipientAccount,
              recipientName: values.newRecipientName,
            });
            setOpenDialog(true);
          }
          setOtpSent(false);
          setOtp('');
          resetForm();
        }}
      >
        {({ values }) => (
          <Form className={styles.form}>
            <FormControl fullWidth margin="normal">
              <InputLabel>Source Account</InputLabel>
              <Field as={Select} name="sourceAccount">
                {state.accounts.map((account) => (
                  <MenuItem key={account.id} value={account.number}>
                    {account.number}
                  </MenuItem>
                ))}
              </Field>
            </FormControl>
            <FormControl fullWidth margin="normal">
              <InputLabel>Recipient</InputLabel>
              <Field as={Select} name="recipient">
                {state.recipients.map((recipient) => (
                  <MenuItem key={recipient.id} value={recipient.recipientAccountNumber}>
                    {recipient.recipientName} ({recipient.recipientAccountNumber})
                  </MenuItem>
                ))}
                <MenuItem value="new">New Recipient</MenuItem>
              </Field>
            </FormControl>
            {values.recipient === 'new' && (
              <>
                <Field
                  as={TextField}
                  name="newRecipientAccount"
                  label="Recipient Account Number"
                  fullWidth
                  margin="normal"
                />
                <ErrorMessage
                  name="newRecipientAccount"
                  component="div"
                  className={styles.error}
                />
                <Field
                  as={TextField}
                  name="newRecipientName"
                  label="Recipient Name (Optional)"
                  fullWidth
                  margin="normal"
                />
                <FormControl fullWidth margin="normal">
                  <InputLabel>Bank</InputLabel>
                  <Field as={Select} name="bank">
                    <MenuItem value="internal">Our Bank</MenuItem>
                    <MenuItem value="external">Other Bank</MenuItem>
                  </Field>
                </FormControl>
              </>
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
            <FormControl fullWidth margin="normal">
              <InputLabel>Fee Type</InputLabel>
              <Field as={Select} name="feeType">
                <MenuItem value="SENDER">Sender Pays Fee</MenuItem>
                <MenuItem value="RECEIVER">Receiver Pays Fee</MenuItem>
              </Field>
            </FormControl>
            {otpSent && (
              <Field
                as={TextField}
                name="otp"
                label="OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                fullWidth
                margin="normal"
              />
            )}
            <Button
              type="submit"
              variant="contained"
              color="primary"
              className={styles.submitButton}
            >
              {otpSent ? 'Confirm Transfer' : 'Send OTP'}
            </Button>
          </Form>
        )}
      </Formik>
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Save Recipient</DialogTitle>
        <DialogContent>
          <Typography>Would you like to save this recipient for future transactions?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleSaveRecipient} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Transfer;