import { useParams, useNavigate, useLocation } from "react-router-dom";
import {
    Box,
    Typography,
    Button,
} from "@mui/material";
import AdminLayout from "../../layouts/AdminLayout";
import { useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useEmployeeDetail, EmployeeDetailProvider } from "../../contexts/EmployeeDetailContext";
import EmployeeDetailCard from "../../components/EmployeeDetailCard";
import DeleteConfirmationDialog from "../../components/DeleteConfirmationDialog";
import Loading from "../../components/Loading";
import NotFound from "../../components/NotFound";
import ErrorSuccessMessage from "../../components/ErrorSuccessMessage";


function EmployeeDetailContent() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { state } = useLocation();
    const { updateProfile, state: { user } } = useAuth();
    
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
        
        // Utility functions
        clearError,

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

    if (loading) {
        return <Loading />;
    }

    if (!employee && !loading) {
        return <NotFound message="Employee not found." />;
    }

    const handleConfirmDelete = async () => {
        const result = await deleteEmployee(id);
        if (result) {
            navigate("/admin/employees");
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
                role: editedEmployee.role.toLowerCase()
            };
            await updateProfile(profileUpdate);
        }
    };

    return (
        <AdminLayout>
            <Box sx={{ p: 3, bgcolor: "background.default", minHeight: "100vh" }}>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
                    <Typography variant="h3"
                        sx={{ fontWeight: 700, color: 'text.primary', mb: 2 }}>
                        Employee Details
                    </Typography>
                </Box>

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

                <Button
                    variant="outlined"
                    onClick={() => navigate("/admin/employees")}
                >
                    Back to Employee List
                </Button>

                <DeleteConfirmationDialog
                    open={isDeleteDialogOpen}
                    onClose={hideDeleteDialog}
                    onConfirm={handleConfirmDelete}
                    employeeName={employee?.fullName}
                />
            </Box>
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