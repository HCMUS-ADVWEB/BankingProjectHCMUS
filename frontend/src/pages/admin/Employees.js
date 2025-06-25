import {
  Box,
  Typography,
  Button,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import AdminLayout from "../../layouts/AdminLayout";
import { useEffect, useRef } from "react";
import { useEmployeeManagement, EmployeeManagementProvider } from '../../contexts/EmployeeManagementContext';
import AddEmployeeDialog from "../../components/AddEmployeeDialog";
import DeleteConfirmationDialog from "../../components/DeleteConfirmationDialog";
import ErrorSuccessMessage from "../../components/ErrorSuccessMessage";
import EmployeeTable from "../../components/EmployeeTable";
import Loading from "../../components/Loading";

function EmployeesContent() {
  const navigate = useNavigate();
  const usernameRef = useRef();
  const passwordRef = useRef();
  const fullNameRef = useRef();
  const emailRef = useRef();
  const phoneRef = useRef();
  const addressRef = useRef();
  const dobRef = useRef();

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

    // Utility functions
    clearError,
    clearSuccess,
    clearFormErrors,
  } = useEmployeeManagement();

  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    updateNewEmployeeField(name, value);
  };

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
    console.log("Move to employee:", emp.id);
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

  if (loading && !employees.length) {
    return <Loading />;
  }

  return (
    <AdminLayout>
      <Box sx={{ p: 3, bgcolor: "background.default", minHeight: "100vh" }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
          <Typography variant="h4">
            Employee List
          </Typography>
          <Button
            variant="contained"
            onClick={openAddDialog}
          >
            Add Employee
          </Button>
        </Box>

        <ErrorSuccessMessage error={error} success={success} />

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

        <EmployeeTable
          employees={getPaginatedEmployees()}
          onRowClick={(emp) => navigate(`/admin/employees/${emp.id}`, { state: { employee: emp } })}
          onEdit={handleEdit}
          onDelete={handleDeleteClick}
          pagination={{
            ...pagination,
            totalCount: employees.length
          }}
          onPageChange={handleChangePage}
        />
      </Box>
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