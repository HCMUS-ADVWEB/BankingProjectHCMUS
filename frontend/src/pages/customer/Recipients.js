import { useEffect, useState } from 'react';
import CustomerLayout from '../../layouts/CustomerLayout';
import api from '../../utils/api';
import { useAuth } from '../../contexts/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  CircularProgress,
  Alert,
  Divider,
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon, Add as AddIcon, Send as SendIcon } from '@mui/icons-material';

const initialForm = { accountNumber: '', bankName: '', recipientName: '', recipientNickname: '' };

export default function RecipientsPage() {
  const { state } = useAuth();
  const navigate = useNavigate();
  const [recipients, setRecipients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState(initialForm);
  const [success, setSuccess] = useState(null);

  const fetchRecipients = () => {
    setLoading(true);
    api
      .get('/api/recipients', { params: { limit: 20, page: 1 } })
      .then((res) => setRecipients(res.data.data || []))
      .catch((err) => setError(err.response?.data?.message || err.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchRecipients();
  }, []);

  const handleOpen = (recipient = null) => {
    setEditId(recipient?.recipientId || null);
    setForm(
      recipient
        ? {
          accountNumber: recipient.accountNumber || '',
          bankName: recipient.bankName || '',
          recipientName: recipient.recipientName || '',
          recipientNickname: recipient.recipientNickname || '',
        }
        : initialForm,
    );
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setForm(initialForm);
    setEditId(null);
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
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
    setLoading(true);
    setError(null);
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

  const handleTransfer = (accountNumber) => {
    navigate('/customer/transfer', { state: { accountNumberReceiver: accountNumber } });
  };

  return (
    <CustomerLayout>
      <Container maxWidth="xl" sx={{ py: 6, bgcolor: 'background.default', minHeight: '100vh' }}>
        {/* Header Section */}
        <Box
          sx={{
            mb: 6,
            p: 4,
            borderRadius: 'shape.borderRadius',
            bgcolor: 'background.paper',
            backdropFilter: 'blur(8px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            width: '100%',
            animation: 'fadeIn 1s ease-in-out',
            '@keyframes fadeIn': {
              '0%': { opacity: 0, transform: 'translateY(-20px)' },
              '100%': { opacity: 1, transform: 'translateY(0)' },
            },
          }}
        >
          <Typography
            variant="h3"
            sx={{ fontWeight: 700, color: 'text.primary', mb: 1 }}
          >
            Your Recipients 📋
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage your list of recipients for easy and secure transfers.
          </Typography>
        </Box>

        {/* Recipients Section */}
        <Box sx={{ mb: 4, width: '100%' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
            <Typography variant="h5" color="text.primary">
              Recipient List
            </Typography>
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              onClick={() => handleOpen()}
              sx={{ py: 1.5 }}
            >
              Add Recipient
            </Button>
          </Box>
          <Divider sx={{ mt: 1, mb: 3 }} />

          {/* Error and Success Alerts */}
          {error && (
            <Alert severity="error" sx={{ mb: 4, borderRadius: 'shape.borderRadius' }}>
              {error}
            </Alert>
          )}
          {success && (
            <Alert severity="success" sx={{ mb: 4, borderRadius: 'shape.borderRadius' }}>
              {success}
            </Alert>
          )}

          {/* Loading State */}
          {loading && (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <CircularProgress />
            </Box>
          )}

          {/* Recipients Table */}
          {!loading && recipients.length > 0 && (
            <TableContainer
              component={Paper}
              sx={{
                borderRadius: 'shape.borderRadius',
                transition: 'all 0.3s ease',
                '&:hover': {
                  boxShadow: '0 12px 30px rgba(0, 0, 0, 0.4)',
                },
                animation: 'fadeInUp 0.5s ease-in-out',
                '@keyframes fadeInUp': {
                  '0%': { opacity: 0, transform: 'translateY(20px)' },
                  '100%': { opacity: 1, transform: 'translateY(0)' },
                },
              }}
            >
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 600, color: 'text.primary', textAlign: 'left' }}>
                      Account Number
                    </TableCell>
                    <TableCell sx={{ fontWeight: 600, color: 'text.primary', textAlign: 'center'}}>
                      Bank Name
                    </TableCell>
                    <TableCell sx={{ fontWeight: 600, color: 'text.primary', textAlign: 'center' }}>
                      Recipient Name
                    </TableCell>
                    <TableCell sx={{ fontWeight: 600, color: 'text.primary', textAlign: 'center' }}>
                      Recipient Nickname
                    </TableCell>
                    <TableCell sx={{ fontWeight: 600, color: 'text.primary', textAlign: 'right' }}>
                      Actions
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {recipients.map((rec) => (
                    <TableRow
                      key={rec.recipientId}
                      sx={{
                        '&:hover': {
                          bgcolor: 'action.hover',
                          cursor: 'pointer',
                        },
                      }}
                    >
                      <TableCell sx={{ textAlign: 'left' }}>{rec.accountNumber}</TableCell>
                      <TableCell sx={{ textAlign: 'center' }}>{rec.bankName || '-'}</TableCell>
                      <TableCell sx={{ textAlign: 'center' }}>{rec.recipientName}</TableCell>
                      <TableCell sx={{ textAlign: 'center' }}>{rec.recipientNickname}</TableCell>
                      <TableCell sx={{ textAlign: 'right' }}>
                        <IconButton
                          onClick={() => handleOpen(rec)}
                          sx={{ color: 'primary.main', mr: 1 }}
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          onClick={() => handleDelete(rec.recipientId)}
                          sx={{ color: 'error.main', mr: 1 }}
                        >
                          <DeleteIcon />
                        </IconButton>
                        <Button
                          variant="outlined"
                          color="primary"
                          startIcon={<SendIcon />}
                          onClick={() => handleTransfer(rec.accountNumber)}
                          sx={{ py: 0.5 }}
                        >
                          Transfer
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}

          {/* No Recipients State */}
          {!loading && recipients.length === 0 && (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Typography variant="h6" color="text.primary" gutterBottom>
                No Recipients Found
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Add a new recipient to start making transfers.
              </Typography>
            </Box>
          )}
        </Box>

        {/* Add/Edit Recipient Dialog */}
        <Dialog
          open={open}
          onClose={handleClose}
          sx={{
            '& .MuiDialog-paper': {
              borderRadius: 'shape.borderRadius',
              bgcolor: 'background.paper',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              animation: 'fadeInUp 0.5s ease-in-out',
              '@keyframes fadeInUp': {
                '0%': { opacity: 0, transform: 'translateY(20px)' },
                '100%': { opacity: 1, transform: 'translateY(0)' },
              },
            },
          }}
        >
          <DialogTitle sx={{ fontWeight: 600, color: 'text.primary' }}>
            {editId ? 'Edit Recipient' : 'Add Recipient'}
          </DialogTitle>
          <DialogContent>
            <TextField
              label="Account Number"
              name="accountNumber"
              fullWidth
              sx={{ mb: 2, mt: 1 }}
              value={form.accountNumber}
              onChange={handleChange}
              required
            />
            <TextField
              label="Bank Name"
              name="bankName"
              fullWidth
              sx={{ mb: 2 }}
              value={form.bankName}
              onChange={handleChange}
            />
            <TextField
              label="Recipient Name"
              name="recipientName"
              fullWidth
              sx={{ mb: 2 }}
              value={form.recipientName}
              onChange={handleChange}
              required
            />
            <TextField
              label="Recipient Nickname"
              name="recipientNickname"
              fullWidth
              sx={{ mb: 2 }}
              value={form.recipientNickname}
              onChange={handleChange}
            />
            {/* TODO: Add verify recipient */}
          </DialogContent>
          <DialogActions sx={{ p: 3 }}>
            <Button onClick={handleClose} sx={{ color: 'text.secondary' }}>
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              variant="contained"
              color="primary"
              disabled={loading}
            >
              {editId ? 'Update' : 'Add'}
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </CustomerLayout>
  );
}
