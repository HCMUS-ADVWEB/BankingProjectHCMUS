import { useState } from 'react';
import { Container, Typography, Paper, TextField, Button, Box } from '@mui/material';
import CustomerLayout from '../../layouts/CustomerLayout';

export default function TransferPage() {
  const [form, setForm] = useState({ to: '', amount: '' });
  const [submitted, setSubmitted] = useState(false);
  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };
  return (
    <CustomerLayout>
      <Container maxWidth="xs" sx={{ py: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 3 }}>Transfer Funds</Typography>
        <Paper sx={{ p: 3, borderRadius: 'shape.borderRadius' }}>
          <form onSubmit={handleSubmit}>
            <TextField
              label="Recipient Account"
              name="to"
              value={form.to}
              onChange={handleChange}
              fullWidth
              required
              sx={{ mb: 2 }}
            />
            <TextField
              label="Amount"
              name="amount"
              type="number"
              value={form.amount}
              onChange={handleChange}
              fullWidth
              required
              sx={{ mb: 2 }}
            />
            <Button type="submit" variant="contained" color="primary" fullWidth>
              Transfer
            </Button>
          </form>
          {submitted && (
            <Box sx={{ mt: 2 }}>
              <Typography color="success.main">Transfer submitted!</Typography>
            </Box>
          )}
        </Paper>
      </Container>
    </CustomerLayout>
  );
}
