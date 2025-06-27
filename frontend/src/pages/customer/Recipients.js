import { useEffect, useState } from 'react';
import CustomerLayout from '../../layouts/CustomerLayout';
import { useNavigate } from 'react-router-dom';
import { useRecipient } from '../../contexts/customer/RecipientContext';
import AddRecipientDialog from '../../components/AddRecipientDialog';
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
  Fab,
  Tooltip,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  Send as SendIcon,
} from '@mui/icons-material';

export default function RecipientsPage() {
  const navigate = useNavigate();
  const {
    recipients,
    loading,
    error,
    success,
    fetchRecipients,
    deleteRecipient,
    openDialog: openEditDialog,
    dialogOpen: editDialogOpen,
    closeDialog: closeEditDialog,
    handleFormChange,
    submitForm,
    form,
  } = useRecipient();

  const [addDialogOpen, setAddDialogOpen] = useState(false);

  useEffect(() => {
    fetchRecipients();
  }, [fetchRecipients]);
  const handleOpenAddDialog = () => {
    setAddDialogOpen(true);
  };

  const handleCloseAddDialog = () => {
    setAddDialogOpen(false);
  };

  const handleTransfer = (accountNumber) => {
    navigate('/customer/transfer', {
      state: { accountNumberReceiver: accountNumber },
    });
  };

  const handleDelete = async (id) => {
    await deleteRecipient(id);
  };

  return (
    <CustomerLayout>
      <Container
        maxWidth="2xl"
        sx={{ py: 6, bgcolor: 'background.default', minHeight: '100vh' }}
      >
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
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              mb: 1,
            }}
          >
            <Typography variant="h5" color="text.primary">
              Recipient List
            </Typography>
          </Box>
          <Divider sx={{ mt: 1, mb: 3 }} />

          {/* Error and Success Alerts */}
          {error && (
            <Alert
              severity="error"
              sx={{ mb: 4, borderRadius: 'shape.borderRadius' }}
            >
              {error}
            </Alert>
          )}
          {success && (
            <Alert
              severity="success"
              sx={{ mb: 4, borderRadius: 'shape.borderRadius' }}
            >
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
                    <TableCell
                      sx={{
                        fontWeight: 600,
                        color: 'text.primary',
                        textAlign: 'left',
                      }}
                    >
                      Account Number
                    </TableCell>
                    <TableCell
                      sx={{
                        fontWeight: 600,
                        color: 'text.primary',
                        textAlign: 'center',
                      }}
                    >
                      Bank Name
                    </TableCell>
                    <TableCell
                      sx={{
                        fontWeight: 600,
                        color: 'text.primary',
                        textAlign: 'center',
                      }}
                    >
                      Recipient Name
                    </TableCell>
                    <TableCell
                      sx={{
                        fontWeight: 600,
                        color: 'text.primary',
                        textAlign: 'center',
                      }}
                    >
                      Recipient Nickname
                    </TableCell>
                    <TableCell
                      sx={{
                        fontWeight: 600,
                        color: 'text.primary',
                        textAlign: 'right',
                      }}
                    >
                      Actions
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {recipients.map((rec) => (
                    <TableRow
                      key={rec.id}
                      sx={{
                        '&:hover': {
                          bgcolor: 'action.hover',
                          cursor: 'pointer',
                        },
                      }}
                    >
                      <TableCell sx={{ textAlign: 'left' }}>
                        {rec.recipientAccountNumber}
                      </TableCell>
                      <TableCell sx={{ textAlign: 'center' }}>
                        {rec.bankName || 'Fin Tech Bank'}
                      </TableCell>
                      <TableCell sx={{ textAlign: 'center' }}>
                        {rec.recipientName}
                      </TableCell>
                      <TableCell sx={{ textAlign: 'center' }}>
                        {rec.nickName}
                      </TableCell>
                      <TableCell sx={{ textAlign: 'right' }}>
                        {' '}
                        <IconButton
                          onClick={() => openEditDialog(rec)}
                          sx={{ color: 'primary.main', mr: 1 }}
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          onClick={() => handleDelete(rec.id)}
                          sx={{ color: 'error.main', mr: 1 }}
                        >
                          <DeleteIcon />
                        </IconButton>
                        <Button
                          variant="outlined"
                          color="primary"
                          startIcon={<SendIcon />}
                          onClick={() => handleTransfer(rec.recipientAccountNumber)}
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
        </Box>{' '}
        {/* Add Recipient Dialog */}
        <AddRecipientDialog
          open={addDialogOpen}
          onClose={handleCloseAddDialog}
        />
        {/* Edit Recipient Dialog */}
        <Dialog
          open={editDialogOpen}
          onClose={closeEditDialog}
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
            Edit Recipient
          </DialogTitle>
          <DialogContent>
            <Box sx={{ mb: 2, mt: 1 }}>
              <Typography variant="caption" color="text.secondary">
                Account Number
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: 500 }}>
                {form.accountNumber}
              </Typography>
            </Box>

            <Box sx={{ mb: 2 }}>
              <Typography variant="caption" color="text.secondary">
                Bank Name
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: 500 }}>
                {form.bankName}
              </Typography>
            </Box>

            <Box sx={{ mb: 2 }}>
              <Typography variant="caption" color="text.secondary">
                Full Name
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: 500 }}>
                {form.recipientName}
              </Typography>
            </Box>

            <TextField
              label="Nickname"
              name="nickName"
              fullWidth
              sx={{ mb: 2 }}
              value={form.nickName}
              onChange={handleFormChange}
            />
          </DialogContent>
          <DialogActions sx={{ p: 3 }}>
            <Button onClick={closeEditDialog} sx={{ color: 'text.secondary' }}>
              Cancel
            </Button>
            <Button
              onClick={submitForm}
              variant="contained"
              color="primary"
              disabled={loading}
            >
              Update
            </Button>
          </DialogActions>
        </Dialog>


        {/* New AddRecipientDialog component */}
        <AddRecipientDialog
          open={addDialogOpen}
          onClose={handleCloseAddDialog}
        />
        {/* Floating Action Button for quick add */}
        <Tooltip title="Add Recipient">
          <Fab
            color="primary"
            aria-label="add"
            onClick={handleOpenAddDialog}
            sx={{
              position: 'fixed',
              bottom: 24,
              right: 24,
              transition: 'all 0.2s ease-in-out',
              '&:hover': { transform: 'scale(1.1)' },
            }}
          >
            <AddIcon />
          </Fab>
        </Tooltip>
      </Container>
    </CustomerLayout>
  );
}
