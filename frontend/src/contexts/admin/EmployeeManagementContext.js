import { createContext, useContext, useReducer, useCallback, useEffect } from 'react';
import { AdminService } from '../../services/AdminService';

// Employee Management reducer for state management
const employeeManagementReducer = (state, action) => {
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
    case 'SET_EMPLOYEES':
      return { ...state, employees: action.payload };
    case 'ADD_EMPLOYEE':
      return { ...state, employees: [action.payload, ...state.employees] };
    case 'UPDATE_EMPLOYEE':
      return {
        ...state,
        employees: state.employees.map(emp =>
          emp.id === action.payload.id ? action.payload : emp
        ),
      };
    case 'REMOVE_EMPLOYEE':
      return {
        ...state,
        employees: state.employees.filter(emp => emp.id !== action.payload),
      };
    case 'SET_PAGINATION':
      return {
        ...state,
        pagination: { ...state.pagination, ...action.payload },
      };
    case 'SET_FILTERS':
      return {
        ...state,
        filters: { ...state.filters, ...action.payload },
      };
    case 'SET_SORT':
      return {
        ...state,
        sort: { ...state.sort, ...action.payload },
      };
    case 'SET_NEW_EMPLOYEE':
      return {
        ...state,
        newEmployee: { ...state.newEmployee, ...action.payload },
      };
    case 'RESET_NEW_EMPLOYEE':
      return {
        ...state,
        newEmployee: { ...initialNewEmployeeState },
      };
    case 'SET_FORM_ERRORS':
      return { ...state, formErrors: action.payload };
    case 'CLEAR_FORM_ERRORS':
      return { ...state, formErrors: {} };
    case 'SET_DIALOGS':
      return {
        ...state,
        dialogs: { ...state.dialogs, ...action.payload },
      };
    case 'SET_SELECTED_EMPLOYEE':
      return { ...state, selectedEmployee: action.payload };
    default:
      return state;
  }
};

const initialNewEmployeeState = {
  username: '',
  password: '',
  fullName: '',
  email: '',
  phone: '',
  address: '',
  dob: null,
  role: 'EMPLOYEE',
  isActive: true,
};

const initialState = {
  employees: [],
  selectedEmployee: null,
  newEmployee: { ...initialNewEmployeeState },
  loading: false,
  error: null,
  success: null,
  formErrors: {},
  pagination: {
    page: 0,
    rowsPerPage: 5,
    total: 0,
  },
  filters: {
    search: '',
    role: 'ALL',
    isActive: 'ALL',
  },
  sort: {
    orderBy: 'createdAt',
    order: 'desc',
  },
  dialogs: {
    openAddDialog: false,
    openDeleteDialog: false,
    openEditDialog: false,
    showPassword: false,
  },
};

const EmployeeManagementContext = createContext();

export const useEmployeeManagement = () => {
  const context = useContext(EmployeeManagementContext);
  if (!context) {
    throw new Error('useEmployeeManagement must be used within an EmployeeManagementProvider');
  }
  return context;
};

export const EmployeeManagementProvider = ({ children }) => {
  const [state, dispatch] = useReducer(employeeManagementReducer, initialState);

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

  // Fetch employees with filtering and sorting
  const fetchEmployees = useCallback(async (retryCount = 0) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'CLEAR_ERROR' });
    
    try {
      const response = await AdminService.fetchEmployees();
      let employees = response.data || [];
      
      // Filter out customers (only show employees and admins)
      employees = employees.filter(emp => emp.role !== 'CUSTOMER');
      
      // Apply filters
      if (state.filters.search) {
        const searchTerm = state.filters.search.toLowerCase();
        employees = employees.filter(emp =>
          emp.fullName.toLowerCase().includes(searchTerm) ||
          emp.username.toLowerCase().includes(searchTerm) ||
          emp.email.toLowerCase().includes(searchTerm) ||
          emp.phone.includes(searchTerm)
        );
      }
      
      if (state.filters.role !== 'ALL') {
        employees = employees.filter(emp => emp.role === state.filters.role);
      }
      
      if (state.filters.isActive !== 'ALL') {
        const isActiveFilter = state.filters.isActive === 'ACTIVE';
        employees = employees.filter(emp => emp.isActive === isActiveFilter);
      }
      
      // Apply sorting
      employees.sort((a, b) => {
        const { orderBy, order } = state.sort;
        let aValue = a[orderBy];
        let bValue = b[orderBy];
        
        // Handle different data types
        if (orderBy === 'createdAt' || orderBy === 'updatedAt') {
          aValue = new Date(aValue);
          bValue = new Date(bValue);
        } else if (typeof aValue === 'string') {
          aValue = aValue.toLowerCase();
          bValue = bValue.toLowerCase();
        }
        
        if (order === 'asc') {
          return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
        } else {
          return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
        }
      });
      
      dispatch({ type: 'SET_EMPLOYEES', payload: employees });
      dispatch({ 
        type: 'SET_PAGINATION', 
        payload: { total: employees.length } 
      });
      
      setSuccessWithTimeout('Employees loaded successfully!');
    } catch (error) {
      handleApiError(error);
      // Retry logic for network errors
      if (retryCount < 2 && error.request) {
        setTimeout(() => fetchEmployees(retryCount + 1), 1000);
        return;
      }
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, [state.filters, state.sort, handleApiError, setSuccessWithTimeout]);

  // Create new employee
  const createEmployee = useCallback(async () => {
    const validation = validateNewEmployee();
    if (!validation.isValid) {
      dispatch({ type: 'SET_FORM_ERRORS', payload: validation.errors });
      return false;
    }

    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'CLEAR_ERROR' });
    dispatch({ type: 'CLEAR_FORM_ERRORS' });
    
    try {
      const payload = {
        ...state.newEmployee,
        dob: state.newEmployee.dob ? new Date(state.newEmployee.dob).toISOString() : null,
      };
      
      const response = await AdminService.createEmployee(payload);
      const newEmployee = response.data || {
        ...payload,
        id: Date.now(), // Fallback ID
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      dispatch({ type: 'ADD_EMPLOYEE', payload: newEmployee });
      dispatch({ type: 'RESET_NEW_EMPLOYEE' });
      dispatch({ type: 'SET_DIALOGS', payload: { openAddDialog: false } });
      
      setSuccessWithTimeout('Employee created successfully!');
      return true;
    } catch (error) {
      handleApiError(error);
      return false;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, [state.newEmployee, handleApiError, setSuccessWithTimeout]);

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
        updatedAt: new Date().toISOString(),
      };
      
      dispatch({ type: 'UPDATE_EMPLOYEE', payload: updatedEmployee });
      setSuccessWithTimeout('Employee updated successfully!');
      return true;
    } catch (error) {
      handleApiError(error);
      return false;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, [handleApiError, setSuccessWithTimeout]);

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
      dispatch({ type: 'REMOVE_EMPLOYEE', payload: employeeId });
      dispatch({ type: 'SET_DIALOGS', payload: { openDeleteDialog: false } });
      dispatch({ type: 'SET_SELECTED_EMPLOYEE', payload: null });
      
      setSuccessWithTimeout('Employee deleted successfully!');
      return true;
    } catch (error) {
      handleApiError(error);
      return false;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, [handleApiError, setSuccessWithTimeout]);

  // Form validation
  const validateNewEmployee = useCallback(() => {
    const errors = {};
    const { newEmployee } = state;

    if (!newEmployee.fullName?.trim()) {
      errors.fullName = 'Full name is required';
    }

    if (!newEmployee.email?.trim()) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(newEmployee.email)) {
      errors.email = 'Email is invalid';
    }

    if (!newEmployee.phone?.trim()) {
      errors.phone = 'Phone is required';
    } else if (!/^\d{10,11}$/.test(newEmployee.phone.replace(/\D/g, ''))) {
      errors.phone = 'Phone must be 10-11 digits';
    }

    if (!newEmployee.address?.trim()) {
      errors.address = 'Address is required';
    }

    if (!newEmployee.dob) {
      errors.dob = 'Date of birth is required';
    }

    if (!newEmployee.username?.trim()) {
      errors.username = 'Username is required';
    } else if (newEmployee.username.length < 5) {
      errors.username = 'Username must be at least 5 characters';
    }

    if (!newEmployee.password?.trim()) {
      errors.password = 'Password is required';
    } else if (newEmployee.password.length < 8) {
      errors.password = 'Password must be at least 8 characters';
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors,
    };
  }, [state.newEmployee]);

  // Pagination handlers
  const handleChangePage = useCallback((event, newPage) => {
    dispatch({ type: 'SET_PAGINATION', payload: { page: newPage } });
  }, []);

  const handleChangeRowsPerPage = useCallback((event) => {
    const newRowsPerPage = parseInt(event.target.value, 10);
    dispatch({
      type: 'SET_PAGINATION',
      payload: {
        rowsPerPage: newRowsPerPage,
        page: 0,
      },
    });
  }, []);

  // Sorting handlers
  const handleRequestSort = useCallback((property) => {
    const isAsc = state.sort.orderBy === property && state.sort.order === 'asc';
    dispatch({
      type: 'SET_SORT',
      payload: {
        orderBy: property,
        order: isAsc ? 'desc' : 'asc',
      },
    });
  }, [state.sort]);

  // Filter handlers
  const updateFilters = useCallback((newFilters) => {
    dispatch({ type: 'SET_FILTERS', payload: newFilters });
    dispatch({ type: 'SET_PAGINATION', payload: { page: 0 } }); // Reset page when filtering
  }, []);

  // Dialog handlers
  const openAddDialog = useCallback(() => {
    dispatch({ type: 'SET_DIALOGS', payload: { openAddDialog: true } });
    dispatch({ type: 'CLEAR_FORM_ERRORS' });
  }, []);

  const closeAddDialog = useCallback(() => {
    dispatch({ type: 'SET_DIALOGS', payload: { openAddDialog: false } });
    dispatch({ type: 'RESET_NEW_EMPLOYEE' });
    dispatch({ type: 'CLEAR_FORM_ERRORS' });
  }, []);

  const openDeleteDialog = useCallback((employee) => {
    dispatch({ type: 'SET_SELECTED_EMPLOYEE', payload: employee });
    dispatch({ type: 'SET_DIALOGS', payload: { openDeleteDialog: true } });
  }, []);

  const closeDeleteDialog = useCallback(() => {
    dispatch({ type: 'SET_DIALOGS', payload: { openDeleteDialog: false } });
    dispatch({ type: 'SET_SELECTED_EMPLOYEE', payload: null });
  }, []);

  const togglePasswordVisibility = useCallback(() => {
    dispatch({
      type: 'SET_DIALOGS',
      payload: { showPassword: !state.dialogs.showPassword },
    });
  }, [state.dialogs.showPassword]);

  // Form field handlers
  const updateNewEmployeeField = useCallback((field, value) => {
    dispatch({ type: 'SET_NEW_EMPLOYEE', payload: { [field]: value } });
    // Clear field-specific error
    if (state.formErrors[field]) {
      const newErrors = { ...state.formErrors };
      delete newErrors[field];
      dispatch({ type: 'SET_FORM_ERRORS', payload: newErrors });
    }
  }, [state.formErrors]);

  const updateNewEmployee = useCallback((updates) => {
    dispatch({ type: 'SET_NEW_EMPLOYEE', payload: updates });
  }, []);

  // Get paginated employees for display
  const getPaginatedEmployees = useCallback(() => {
    const { page, rowsPerPage } = state.pagination;
    const startIndex = page * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    return state.employees.slice(startIndex, endIndex);
  }, [state.employees, state.pagination]);

  // Clear functions
  const clearError = useCallback(() => {
    dispatch({ type: 'CLEAR_ERROR' });
  }, []);

  const clearSuccess = useCallback(() => {
    dispatch({ type: 'CLEAR_SUCCESS' });
  }, []);

  const clearFormErrors = useCallback(() => {
    dispatch({ type: 'CLEAR_FORM_ERRORS' });
  }, []);

  // Auto-fetch employees on filter/sort changes
  useEffect(() => {
    fetchEmployees();
  }, [state.filters, state.sort, fetchEmployees]); // Note: fetchEmployees is not included to avoid infinite loop

  const contextValue = {
    // State
    employees: state.employees,
    selectedEmployee: state.selectedEmployee,
    newEmployee: state.newEmployee,
    loading: state.loading,
    error: state.error,
    success: state.success,
    formErrors: state.formErrors,
    pagination: state.pagination,
    filters: state.filters,
    sort: state.sort,
    dialogs: state.dialogs,

    // Employee operations
    fetchEmployees,
    createEmployee,
    updateEmployee,
    deleteEmployee,

    // Form operations
    validateNewEmployee,
    updateNewEmployeeField,
    updateNewEmployee,

    // Pagination operations
    handleChangePage,
    handleChangeRowsPerPage,
    getPaginatedEmployees,

    // Sorting operations
    handleRequestSort,

    // Filter operations
    updateFilters,

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
    handleApiError,
  };

  return (
    <EmployeeManagementContext.Provider value={contextValue}>
      {children}
    </EmployeeManagementContext.Provider>
  );
};