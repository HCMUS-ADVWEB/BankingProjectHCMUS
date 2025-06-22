import { useEffect, useState } from 'react';
import CustomerLayout from '../../layouts/CustomerLayout';
import api from '../../utils/api';
import { useAuth } from '../../contexts/AuthContext';
import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, IconButton, CircularProgress, Alert } from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon, Add as AddIcon } from '@mui/icons-material';

const initialForm = { accountNumber: '', bankName: '', recipientName: '', recipientNickname: '' };

export default function RecipientsPage() {
  const { state } = useAuth();
  const [recipients, setRecipients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState(initialForm);
  const [success, setSuccess] = useState(null);

  const fetchRecipients = () => {
    setLoading(true);
    api.get('/api/recipients', { params: { limit: 20, page: 1 } })
      .then(res => setRecipients(res.data.data || []))
      .catch(err => setError(err.response?.data?.message || err.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchRecipients(); }, []);

  const handleOpen = (recipient = null) => {
    setEditId(recipient?.recipientId || null);
    setForm(recipient ? {
      accountNumber: recipient.accountNumber || '',
      bankName: recipient.bankName || '',
      recipientName: recipient.recipientName || '',
      recipientNickname: recipient.recipientNickname || '',
    } : initialForm);
    setOpen(true);
  };
  const handleClose = () => { setOpen(false); setForm(initialForm); setEditId(null); };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async () => {
    setLoading(true); setError(null);
    try {
      if (editId) {
        await api.put(`/api/recipients/${editId}`, form);
        setSuccess('Recipient updated successfully!');
      } else {
        await api.post('/api/recipients', form);
        setSuccess('Recipient added successfully!');
      }
      fetchRecipients();
      handleClose();
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    setLoading(true); setError(null);
    try {
      await api.delete('/api/recipients', { data: { recipientId: id } });
      setSuccess('Recipient deleted successfully!');
      fetchRecipients();
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <CustomerLayout>
      <Box p={3}>
        <Typography variant="h4" gutterBottom>Recipients</Typography>
        {error && <Alert severity="error">{error}</Alert>}
        {success && <Alert severity="success">{success}</Alert>}
        <Button variant="contained" startIcon={<AddIcon />} style={{ marginBottom: 16 }} onClick={() => handleOpen()}>Add Recipient</Button>
        {loading && <CircularProgress />}
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Account Number</TableCell>
                <TableCell>Bank Name</TableCell>
                <TableCell>Recipient Name</TableCell>
                <TableCell>Recipient Nickname</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {recipients.map((rec) => (
                <TableRow key={rec.recipientId}>
                  <TableCell>{rec.accountNumber}</TableCell>
                  <TableCell>{rec.bankName || '-'}</TableCell>
                  <TableCell>{rec.recipientName}</TableCell>
                  <TableCell>{rec.recipientNickname}</TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleOpen(rec)}><EditIcon /></IconButton>
                    <IconButton onClick={() => handleDelete(rec.recipientId)}><DeleteIcon /></IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>{editId ? 'Edit Recipient' : 'Add Recipient'}</DialogTitle>
          <DialogContent>
            <TextField label="Account Number" name="accountNumber" fullWidth style={{ marginBottom: 16 }} value={form.accountNumber} onChange={handleChange} required />
            <TextField label="Bank Name" name="bankName" fullWidth style={{ marginBottom: 16 }} value={form.bankName} onChange={handleChange} />
            <TextField label="Recipient Name" name="recipientName" fullWidth style={{ marginBottom: 16 }} value={form.recipientName} onChange={handleChange} required />
            <TextField label="Recipient Nickname" name="recipientNickname" fullWidth style={{ marginBottom: 16 }} value={form.recipientNickname} onChange={handleChange} />
            {/* TODO: Add verify recipient */}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button onClick={handleSubmit} variant="contained">{editId ? 'Update' : 'Add'}</Button>
          </DialogActions>
        </Dialog>
      </Box>
    </CustomerLayout>
  );
}
