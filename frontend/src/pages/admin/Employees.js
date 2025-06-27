import { Box, Container, Typography, Button, Paper, Avatar, Backdrop, CircularProgress } from '@mui/material';
import { Group as GroupIcon, Add as AddIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../../layouts/AdminLayout';
import { useEffect } from 'react';
import {
  useEmployeeManagement,
  EmployeeManagementProvider,
} from '../../contexts/admin/EmployeeManagementContext';
import AddEmployeeDialog from '../../components/admin/AddEmployeeDialog';
import DeleteConfirmationDialog from '../../components/admin/DeleteConfirmationDialog';
import ErrorSuccessMessage from '../../components/ErrorSuccessMessage';
import EmployeeTable from '../../components/admin/EmployeeTable';

function EmployeesContent() {
  const navigate = useNavigate();

  const {
    // State
    employees,
    selectedEmployee,
    newEmployee,
    loading,
    error,
    success,
    formErrors,
    pagination,
    dialogs,

    // Employee operations
    fetchEmployees,
    createEmployee,
    deleteEmployee,

    // Form operations
    validateNewEmployee,
    updateNewEmployeeField,
    updateNewEmployee,

    // Pagination operations
    handleChangePage,
    getPaginatedEmployees,

    // Dialog operations
    openAddDialog,
    closeAddDialog,
    openDeleteDialog,
    closeDeleteDialog,
    togglePasswordVisibility,
  } = useEmployeeManagement();

  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  const handleAddEmployee = async () => {
    const result = await createEmployee();
    if (result) {
      fetchEmployees();
    }
  };

  const handleSubmit = () => {
    const validation = validateNewEmployee();
    if (validation.isValid) {
      handleAddEmployee();
    }
  };

  const handleEdit = (e, emp) => {
    e.stopPropagation();
    console.log('Move to employee:', emp.id);
    navigate(`/admin/employees/${emp.id}`, { state: { employee: emp } });
  };

  const handleDeleteClick = (e, employee) => {
    e.stopPropagation();
    openDeleteDialog(employee);
  };

  const handleConfirmDelete = async () => {
    if (selectedEmployee) {
      const result = await deleteEmployee(selectedEmployee.id);
      if (result) {
        fetchEmployees();
      }
    }
  };

  return (
    <AdminLayout>
      <Container
        maxWidth="2xl"
        sx={{ py: 4, bgcolor: 'background.default', minHeight: '100vh' }}
      >
        {/* Loading Backdrop */}
        <Backdrop
          sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={loading && !employees.length}
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
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <Box>
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
                  <GroupIcon />
                </Avatar>
                Employee List
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
                Manage your team members and their details.
              </Typography>
            </Box>
            <Button
              variant="contained"
              onClick={openAddDialog}
              startIcon={<AddIcon />}
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
              Add Employee
            </Button>
          </Box>
        </Paper>

        <ErrorSuccessMessage error={error} success={success} />

        {/* Content Section */}
        <Paper
          sx={{
            p: 3,
            borderRadius: 'shape.borderRadius',
            bgcolor: 'background.paper',
            backdropFilter: 'blur(8px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            mb: 4,
          }}
        >
          <EmployeeTable
            employees={getPaginatedEmployees()}
            onRowClick={(emp) =>
              navigate(`/admin/employees/${emp.id}`, { state: { employee: emp } })
            }
            onEdit={handleEdit}
            onDelete={handleDeleteClick}
            pagination={{
              ...pagination,
              totalCount: employees.length,
            }}
            onPageChange={handleChangePage}
          />
        </Paper>

        <AddEmployeeDialog
          open={dialogs.openAddDialog}
          onClose={closeAddDialog}
          onSubmit={handleSubmit}
          newEmployee={newEmployee}
          onFieldChange={updateNewEmployeeField}
          onEmployeeUpdate={updateNewEmployee}
          formErrors={formErrors}
          showPassword={dialogs.showPassword}
          onTogglePasswordVisibility={togglePasswordVisibility}
        />

        <DeleteConfirmationDialog
          open={dialogs.openDeleteDialog}
          onClose={closeDeleteDialog}
          onConfirm={handleConfirmDelete}
          employeeName={selectedEmployee?.fullName}
        />
      </Container>
    </AdminLayout>
  );
}

export default function EmployeesPage() {
  return (
    <EmployeeManagementProvider>
      <EmployeesContent />
    </EmployeeManagementProvider>
  );
}
