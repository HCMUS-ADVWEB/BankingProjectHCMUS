import { useParams, useNavigate, useLocation } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Button,
  Paper,
  Avatar,
  Backdrop,
  CircularProgress,
} from '@mui/material';
import { ArrowBack as ArrowBackIcon, Person as PersonIcon } from '@mui/icons-material';
import AdminLayout from '../../layouts/AdminLayout';
import { useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import {
  useEmployeeDetail,
  EmployeeDetailProvider,
} from '../../contexts/admin/EmployeeDetailContext';
import EmployeeDetailCard from '../../components/admin/EmployeeDetailCard';
import DeleteConfirmationDialog from '../../components/admin/DeleteConfirmationDialog';
import NotFound from '../../components/NotFound';
import ErrorSuccessMessage from '../../components/ErrorSuccessMessage';
import Loading from '../../components/Loading';

function EmployeeDetailContent() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { state } = useLocation();
  const {
    updateProfile,
    state: { user },
  } = useAuth();

  const {
    // State
    employee,
    editedEmployee,
    editMode,
    isDeleteDialogOpen,
    loading,
    error,
    success,

    // Employee operations
    fetchEmployee,
    initializeEmployee,
    deleteEmployee,

    // Edit operations
    enableEditMode,
    cancelEdit,
    saveEdit,
    updateEditedEmployeeField,

    // Dialog operations
    showDeleteDialog,
    hideDeleteDialog,

    resetState,
  } = useEmployeeDetail();

  useEffect(() => {
    resetState();
  }, [resetState]);

  // Initialize employee data
  useEffect(() => {
    if (state?.employee) {
      initializeEmployee(state?.employee);
    } else {
      fetchEmployee(id);
    }
  }, [id, state?.employee, initializeEmployee, fetchEmployee]);

  const handleConfirmDelete = async () => {
    const result = await deleteEmployee(id);
    if (result) {
      navigate('/admin/employees');
    }
  };

  const handleEdit = () => {
    enableEditMode();
  };

  const handleCancel = () => {
    cancelEdit();
  };

  const handleSave = async () => {
    const result = await saveEdit();
    if (result && user.id === editedEmployee.id) {
      const profileUpdate = {
        ...editedEmployee,
        role: editedEmployee.role.toLowerCase(),
      };
      await updateProfile(profileUpdate);
    }
  };

  if (!employee && !loading) {
    return <NotFound message="Employee not found." />;
  }

  // Only render content when employee is available
  if (!employee) {
    return <Loading />;
  }

  return (
    <AdminLayout>
      <Container
        maxWidth="2xl"
        sx={{ py: 4, bgcolor: 'background.default', minHeight: '100vh' }}
      >
        {/* Loading Backdrop */}
        <Backdrop
          sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={loading}
        >
          <CircularProgress color="inherit" />
        </Backdrop>

        {/* Header Section */}
        <Paper
          sx={{
            mb: 4,
            p: 3,
            borderRadius: 'shape.borderRadius',
            bgcolor: 'background.paper',
            backdropFilter: 'blur(8px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            animation: 'fadeIn 1s ease-in-out',
            '@keyframes fadeIn': {
              '0%': { opacity: 0, transform: 'translateY(-20px)' },
              '100%': { opacity: 1, transform: 'translateY(0)' },
            },
            '&:hover': {
              boxShadow: '0 12px 30px rgba(0, 0, 0, 0.2)',
              transform: 'translateY(-4px)',
              transition: 'all 0.3s ease',
            },
          }}
        >
          <Typography
            variant="h3"
            sx={{
              fontWeight: 700,
              background: 'linear-gradient(to right, #10b981, #06b6d4)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <Avatar
              sx={{
                bgcolor: 'linear-gradient(to right, #10b981, #06b6d4)',
                color: 'white',
                mr: 2,
                width: 40,
                height: 40,
              }}
            >
              <PersonIcon />
            </Avatar>
            Employee Details
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
            View and manage employee information.
          </Typography>
        </Paper>

        {/* Content Section */}
        <Box sx={{ mb: 4 }}>
          <ErrorSuccessMessage error={error} success={success} />

          <EmployeeDetailCard
            employee={employee}
            editedEmployee={editedEmployee}
            editMode={editMode}
            onEdit={handleEdit}
            onCancel={handleCancel}
            onSave={handleSave}
            onDelete={showDeleteDialog}
            onFieldUpdate={updateEditedEmployeeField}
          />
        </Box>

        {/* Back Button */}
        <Button
          variant="contained"
          onClick={() => navigate('/admin/employees')}
          startIcon={<ArrowBackIcon />}
          sx={{
            bgcolor: 'linear-gradient(to right, #10b981, #06b6d4)',
            color: 'white',
            textTransform: 'none',
            borderRadius: 'shape.borderRadius',
            px: 3,
            py: 1,
            '&:hover': {
              bgcolor: 'linear-gradient(to right, #059669, #0284c7)',
              transform: 'translateY(-2px)',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
            },
          }}
        >
          Back to Employee List
        </Button>

        <DeleteConfirmationDialog
          open={isDeleteDialogOpen}
          onClose={hideDeleteDialog}
          onConfirm={handleConfirmDelete}
          employeeName={employee?.fullName}
        />
      </Container>
    </AdminLayout>
  );
}

export default function EmployeeDetailPage() {
  return (
    <EmployeeDetailProvider>
      <EmployeeDetailContent />
    </EmployeeDetailProvider>
  );
}
