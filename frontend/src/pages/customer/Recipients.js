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
  IconButton,
} from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';
import Loading from '../../components/Loading';
import styles from '../../styles/Recipients.module.css';

const Recipients = () => {
  const { state, fetchRecipients, addRecipient, updateRecipient, deleteRecipient } =
    useContext(BankingContext);
  const [editingRecipient, setEditingRecipient] = useState(null);

  useEffect(() => {
    fetchRecipients();
  }, [fetchRecipients]);

  const handleSubmit = async (values, { resetForm }) => {
    if (editingRecipient) {
      await updateRecipient({ id: editingRecipient.id, ...values });
      setEditingRecipient(null);
    } else {
      // Mock API to fetch recipient name if not provided
      const recipientName = values.recipientName || 'Auto Fetched Name';
      await addRecipient({ ...values, recipientName });
    }
    resetForm();
  };

  return (
    <Box className={styles.recipients}>
      <Typography variant="h4" className={styles.title}>
        Manage Recipients
      </Typography>
      {state.loading ? (
        <Loading />
      ) : (
        <>
          <Formik
            initialValues={{
              recipientAccountNumber: '',
              recipientName: '',
            }}
            validate={(values) => {
              const errors = {};
              if (!values.recipientAccountNumber)
                errors.recipientAccountNumber = 'Required';
              return errors;
            }}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting }) => (
              <Form className={styles.form}>
                <Field
                  as={TextField}
                  name="recipientAccountNumber"
                  label="Recipient Account Number"
                  fullWidth
                  margin="normal"
                />
                <ErrorMessage
                  name="recipientAccountNumber"
                  component="div"
                  className={styles.error}
                />
                <Field
                  as={TextField}
                  name="recipientName"
                  label="Recipient Name (Optional)"
                  fullWidth
                  margin="normal"
                />
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  disabled={isSubmitting}
                  className={styles.submitButton}
                >
                  {editingRecipient ? 'Update Recipient' : 'Add Recipient'}
                </Button>
              </Form>
            )}
          </Formik>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Account Number</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {state.recipients.map((recipient) => (
                <TableRow key={recipient.id}>
                  <TableCell>{recipient.recipientAccountNumber}</TableCell>
                  <TableCell>{recipient.recipientName}</TableCell>
                  <TableCell>
                    <IconButton
                      onClick={() => setEditingRecipient(recipient)}
                      color="primary"
                    >
                      <Edit />
                    </IconButton>
                    <IconButton
                      onClick={() => deleteRecipient(recipient.id)}
                      color="error"
                    >
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </>
      )}
    </Box>
  );
};

export default Recipients;