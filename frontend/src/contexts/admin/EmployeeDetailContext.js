import { createContext, useContext, useReducer, useCallback, useEffect } from 'react';
import { AdminService } from '../services/AdminService';
import { useAuth } from './AuthContext';

// Employee Detail reducer for state management
const employeeDetailReducer = (state, action) => {
    switch (action.type) {
        case 'SET_LOADING':
            return { ...state, loading: action.payload };
        case 'SET_ERROR':
            return { ...state, error: action.payload };
        case 'CLEAR_ERROR':
            return { ...state, error: null };
        case 'SET_SUCCESS':
            return { ...state, success: action.payload };
        case 'CLEAR_SUCCESS':
            return { ...state, success: null };
        case 'SET_EMPLOYEE':
            return { ...state, employee: action.payload };
        case 'SET_EDIT_MODE':
            return { ...state, editMode: action.payload };
        case 'SET_EDITED_EMPLOYEE':
            return { ...state, editedEmployee: action.payload };
        case 'UPDATE_EDITED_EMPLOYEE':
            return {
                ...state,
                editedEmployee: { ...state.editedEmployee, ...action.payload }
            };
        case 'SET_DELETE_DIALOG':
            return { ...state, openDeleteDialog: action.payload };
        case 'RESET_STATE':
            return {
                ...initialState,
                employee: null,
                editedEmployee: null,
            };
        default:
            return state;
    }
};

const initialState = {
    employee: null,
    editedEmployee: null,
    editMode: false,
    openDeleteDialog: false,
    loading: true,
    error: null,
    success: null,
};

const EmployeeDetailContext = createContext();

export const useEmployeeDetail = () => {
    const context = useContext(EmployeeDetailContext);
    if (!context) {
        throw new Error('useEmployeeDetail must be used within an EmployeeDetailProvider');
    }
    return context;
};

export const EmployeeDetailProvider = ({ children }) => {
    const [state, dispatch] = useReducer(employeeDetailReducer, initialState);
    const { updateProfile, state: authState } = useAuth();

    // Utility function to handle API errors
    const handleApiError = useCallback((error) => {
        let errorMessage = 'An unexpected error occurred';

        if (error.response) {
            const status = error.response.status;
            const msg = error.response.data?.message;
            const timestamp = error.response.data?.timestamp || new Date().toISOString();

            console.error(`Error ${status}: ${msg} at ${timestamp}`);
            errorMessage = msg || `HTTP ${status} Error`;

            if (status === 401) {
                errorMessage = 'Unauthorized: Please log in again.';
                // Redirect to login if needed
                setTimeout(() => {
                    window.location.href = '/auth/login';
                }, 2000);
            }
        } else if (error.request) {
            console.error('Network error or no response from server.');
            errorMessage = 'Network error or no response from server';
        } else {
            console.error('Unexpected error:', error.message);
            errorMessage = error.message;
        }

        dispatch({ type: 'SET_ERROR', payload: errorMessage });
        return errorMessage;
    }, []);

    // Auto-clear success messages
    const setSuccessWithTimeout = useCallback((message, timeout = 3000) => {
        dispatch({ type: 'SET_SUCCESS', payload: message });
        setTimeout(() => dispatch({ type: 'CLEAR_SUCCESS' }), timeout);
    }, []);

    // Fetch employee by ID
    const fetchEmployee = useCallback(async (employeeId) => {
        if (!employeeId) {
            dispatch({ type: 'SET_ERROR', payload: 'Employee ID is required' });
            return null;
        }

        dispatch({ type: 'SET_LOADING', payload: true });
        dispatch({ type: 'CLEAR_ERROR' });

        try {
            const response = await AdminService.fetchEmployeeById(employeeId);
            const employee = response.data;

            dispatch({ type: 'SET_EMPLOYEE', payload: employee });
            dispatch({ type: 'SET_EDITED_EMPLOYEE', payload: { ...employee } });

            return employee;
        } catch (error) {
            handleApiError(error);
            return null;
        } finally {
            dispatch({ type: 'SET_LOADING', payload: false });
        }
    }, [handleApiError]);

    // Initialize employee data (can be from props or fetch)
    const initializeEmployee = useCallback((employee) => {
        if (employee) {
            dispatch({ type: 'SET_EMPLOYEE', payload: employee });
            dispatch({ type: 'SET_EDITED_EMPLOYEE', payload: { ...employee } });
            dispatch({ type: 'SET_LOADING', payload: false });
        }
    }, []);

    // Update employee
    const updateEmployee = useCallback(async (employeeId, updateData) => {
        if (!employeeId) {
            dispatch({ type: 'SET_ERROR', payload: 'Employee ID is required' });
            return false;
        }

        dispatch({ type: 'SET_LOADING', payload: true });
        dispatch({ type: 'CLEAR_ERROR' });

        try {
            const payload = {
                ...updateData,
                dob: updateData.dob ? new Date(updateData.dob).toISOString() : null,
            };

            await AdminService.updateEmployee(employeeId, payload);

            const updatedEmployee = {
                ...updateData,
                id: employeeId,
                updatedAt: new Date().toISOString()
            };

            dispatch({ type: 'SET_EMPLOYEE', payload: updatedEmployee });
            dispatch({ type: 'SET_EDIT_MODE', payload: false });

            // Update auth context if editing current user
            if (authState.user && authState.user.id === employeeId) {
                const profileUpdate = {
                    ...updatedEmployee,
                    role: updatedEmployee.role.toLowerCase()
                };
                await updateProfile(profileUpdate);
            }

            setSuccessWithTimeout('Employee updated successfully!');
            return true;
        } catch (error) {
            handleApiError(error);
            return false;
        } finally {
            dispatch({ type: 'SET_LOADING', payload: false });
        }
    }, [handleApiError, setSuccessWithTimeout, authState.user, updateProfile]);

    // Delete employee
    const deleteEmployee = useCallback(async (employeeId) => {
        if (!employeeId) {
            dispatch({ type: 'SET_ERROR', payload: 'Employee ID is required' });
            return false;
        }

        dispatch({ type: 'SET_LOADING', payload: true });
        dispatch({ type: 'CLEAR_ERROR' });

        try {
            await AdminService.deleteEmployee(employeeId);
            setSuccessWithTimeout('Employee deleted successfully!');
            return true;
        } catch (error) {
            handleApiError(error);
            return false;
        } finally {
            dispatch({ type: 'SET_LOADING', payload: false });
            dispatch({ type: 'SET_DELETE_DIALOG', payload: false });
        }
    }, [handleApiError, setSuccessWithTimeout]);

    // Edit mode handlers
    const enableEditMode = useCallback(() => {
        dispatch({ type: 'SET_EDIT_MODE', payload: true });
    }, []);

    const cancelEdit = useCallback(() => {
        if (state.employee) {
            dispatch({ type: 'SET_EDITED_EMPLOYEE', payload: { ...state.employee } });
        }
        dispatch({ type: 'SET_EDIT_MODE', payload: false });
        dispatch({ type: 'CLEAR_ERROR' });
    }, [state.employee]);

    const saveEdit = useCallback(async () => {
        if (!state.employee?.id || !state.editedEmployee) {
            dispatch({ type: 'SET_ERROR', payload: 'Invalid employee data' });
            return false;
        }

        return await updateEmployee(state.employee.id, state.editedEmployee);
    }, [state.employee?.id, state.editedEmployee, updateEmployee]);

    // Form field handlers
    const updateEditedEmployeeField = useCallback((field, value) => {
        dispatch({
            type: 'UPDATE_EDITED_EMPLOYEE',
            payload: { [field]: value }
        });
        // Clear field-specific error if exists
        if (state.error) {
            dispatch({ type: 'CLEAR_ERROR' });
        }
    }, [state.error]);

    const updateEditedEmployee = useCallback((updates) => {
        dispatch({ type: 'UPDATE_EDITED_EMPLOYEE', payload: updates });
    }, []);

    // Dialog handlers
    const showDeleteDialog = useCallback(() => {
        dispatch({ type: 'SET_DELETE_DIALOG', payload: true });
    }, []);

    const hideDeleteDialog = useCallback(() => {
        dispatch({ type: 'SET_DELETE_DIALOG', payload: false });
    }, []);


    // Validation helpers
    const validateEmployeeData = useCallback((employeeData) => {
        const errors = {};

        if (!employeeData.fullName?.trim()) {
            errors.fullName = 'Full name is required';
        }

        if (!employeeData.email?.trim()) {
            errors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(employeeData.email)) {
            errors.email = 'Email is invalid';
        }

        if (!employeeData.phone?.trim()) {
            errors.phone = 'Phone is required';
        } else if (!/^\d{10,11}$/.test(employeeData.phone.replace(/\D/g, ''))) {
            errors.phone = 'Phone must be 10-11 digits';
        }

        if (!employeeData.address?.trim()) {
            errors.address = 'Address is required';
        }

        if (!employeeData.dob) {
            errors.dob = 'Date of birth is required';
        }

        if (!employeeData.username?.trim()) {
            errors.username = 'Username is required';
        } else if (employeeData.username.length < 5) {
            errors.username = 'Username must be at least 5 characters';
        }

        return errors;
    }, []);

    // Clear all state
    const resetState = useCallback(() => {
        dispatch({ type: 'RESET_STATE' });
    }, []);

    // Clear error
    const clearError = useCallback(() => {
        dispatch({ type: 'CLEAR_ERROR' });
    }, []);

    // Clear success
    const clearSuccess = useCallback(() => {
        dispatch({ type: 'CLEAR_SUCCESS' });
    }, []);

    const contextValue = {
        // State
        employee: state.employee,
        editedEmployee: state.editedEmployee,
        editMode: state.editMode,
        isDeleteDialogOpen: state.openDeleteDialog, // renamed here
        loading: state.loading,
        error: state.error,
        success: state.success,

        // Employee operations
        fetchEmployee,
        initializeEmployee,
        updateEmployee,
        deleteEmployee,

        // Edit operations
        enableEditMode,
        cancelEdit,
        saveEdit,
        updateEditedEmployeeField,
        updateEditedEmployee,

        // Dialog operations
        showDeleteDialog,
        hideDeleteDialog,

        // Utility functions
        validateEmployeeData,
        resetState,
        clearError,
        clearSuccess,
        handleApiError,
    };


    return (
        <EmployeeDetailContext.Provider value={contextValue}>
            {children}
        </EmployeeDetailContext.Provider>
    );
};