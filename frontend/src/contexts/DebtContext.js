import React, {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useCallback,
} from 'react';
import DebtService from '../services/DebtService';
import { useAuth } from './AuthContext';

const debtReducer = (state, action) => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'CLEAR_ERROR':
      return { ...state, error: null };
    case 'SET_CREATED_DEBTS':
      return { ...state, createdDebts: action.payload };
    case 'SET_RECEIVED_DEBTS':
      return { ...state, receivedDebts: action.payload };
    case 'FETCH_DEBTS_START':
      return { ...state, loading: true, error: null };
    case 'FETCH_DEBTS_SUCCESS':
      return {
        ...state,
        createdDebts: action.payload.createdDebts,
        receivedDebts: action.payload.receivedDebts,
        loading: false,
        error: null,
      };
    case 'FETCH_DEBTS_FAILURE':
      return { ...state, loading: false, error: action.payload };
    case 'SET_PAGINATION':
      return {
        ...state,
        pagination: {
          ...state.pagination,
          ...action.payload,
        },
      };
    case 'SET_SORT':
      return {
        ...state,
        sort: {
          ...state.sort,
          ...action.payload,
        },
      };
    case 'SET_FILTER':
      return {
        ...state,
        filter: {
          ...state.filter,
          ...action.payload,
        },
      };
    case 'SET_TAB':
      return { ...state, currentTab: action.payload };
    default:
      return state;
  }
};

const DebtContext = createContext();

export const useDebt = () => useContext(DebtContext);

export const DebtProvider = ({ children }) => {
  const { state: authState } = useAuth();

  const [state, dispatch] = useReducer(debtReducer, {
    createdDebts: [],
    receivedDebts: [],
    loading: false,
    error: null,
    pagination: {
      page: 0,
      rowsPerPage: 10,
      total: 0,
    },
    sort: {
      orderBy: 'createdAt',
      order: 'desc',
    },
    filter: {
      status: '',
    },
    currentTab: 0,
  });
  const fetchDebtReminders = useCallback(async () => {
    if (!authState.isAuthenticated) return;

    dispatch({ type: 'FETCH_DEBTS_START' });

    try {
      const { status } = state.filter;
      const { rowsPerPage, page } = state.pagination;
      const { orderBy, order } = state.sort;

      const response = await DebtService.getDebtReminderLists(
        status,
        rowsPerPage,
        page + 1,
        orderBy,
        order,
      );

      if (response && response.status === 200) {
        const createdDebtsData = response.data.createdDebts || [];
        const receivedDebtsData = response.data.receivedDebts || [];

        dispatch({
          type: 'FETCH_DEBTS_SUCCESS',
          payload: {
            createdDebts: createdDebtsData,
            receivedDebts: receivedDebtsData,
          },
        });

        dispatch({
          type: 'SET_PAGINATION',
          payload: {
            total:
              state.currentTab === 0
                ? createdDebtsData.length
                : receivedDebtsData.length,
          },
        });
      } else {
        const errorMsg = response?.message || 'Failed to fetch debt reminders';
        dispatch({ type: 'SET_ERROR', payload: errorMsg });
      }
    } catch (err) {
      console.error('Error fetching debt reminders:', err);
      dispatch({
        type: 'FETCH_DEBTS_FAILURE',
        payload: 'Error fetching debt reminders. Please try again later.',
      });
    }
  }, [
    authState.isAuthenticated,
    state.filter.status,
    state.pagination.page,
    state.pagination.rowsPerPage,
    state.sort.orderBy,
    state.sort.order,
    state.currentTab,
  ]);

  const createDebtReminder = async (debtData) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'CLEAR_ERROR' });

    try {
      const response = await DebtService.createDebtReminder(debtData);

      if (response && response.status === 200) {
        await fetchDebtReminders();
        dispatch({ type: 'SET_LOADING', payload: false });
        return { success: true, data: response.data };
      } else {
        const errorMsg = response?.message || 'Failed to create debt reminder';
        dispatch({ type: 'SET_ERROR', payload: errorMsg });
        dispatch({ type: 'SET_LOADING', payload: false });
        return { success: false, error: errorMsg };
      }
    } catch (err) {
      console.error('Error creating debt reminder:', err);
      const errorMessage =
        err.response?.data?.message ||
        'Error creating debt reminder. Please try again later.';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      dispatch({ type: 'SET_LOADING', payload: false });
      return { success: false, error: errorMessage };
    }
  };

  const cancelDebtReminder = async (reminderId, reason) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'CLEAR_ERROR' });

    try {
      const response = await DebtService.cancelDebtReminder(reminderId, reason);

      if (response && response.status === 200) {
        await fetchDebtReminders();
        dispatch({ type: 'SET_LOADING', payload: false });
        return { success: true };
      } else {
        const errorMsg = response?.message || 'Failed to cancel debt reminder';
        dispatch({ type: 'SET_ERROR', payload: errorMsg });
        dispatch({ type: 'SET_LOADING', payload: false });
        return { success: false, error: errorMsg };
      }
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        'Error cancelling debt reminder. Please try again later.';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      dispatch({ type: 'SET_LOADING', payload: false });
      return { success: false, error: errorMessage };
    }
  };

  const requestOtpForPayDebt = async () => {
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'CLEAR_ERROR' });

    try {
      const response = await DebtService.requestOtpForPayDebt();

      if (response && response.status === 200) {
        dispatch({ type: 'SET_LOADING', payload: false });
        return { success: true, message: response.message };
      } else {
        const errorMsg = response?.message || 'Failed to request OTP';
        dispatch({ type: 'SET_ERROR', payload: errorMsg });
        dispatch({ type: 'SET_LOADING', payload: false });
        return { success: false, error: errorMsg };
      }
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        'Error requesting OTP. Please try again later.';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      dispatch({ type: 'SET_LOADING', payload: false });
      return { success: false, error: errorMessage };
    }
  };

  const payDebtReminder = async (reminderId, paymentData) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'CLEAR_ERROR' });

    try {
      const response = await DebtService.payDebtReminder(
        reminderId,
        paymentData,
      );

      if (response && response.status === 200) {
        await fetchDebtReminders();
        dispatch({ type: 'SET_LOADING', payload: false });
        return { success: true, data: response.data };
      } else {
        const errorMsg = response?.message || 'Failed to pay debt';
        dispatch({ type: 'SET_ERROR', payload: errorMsg });
        dispatch({ type: 'SET_LOADING', payload: false });
        return { success: false, error: errorMsg };
      }
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        'Error paying debt. Please try again later.';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      dispatch({ type: 'SET_LOADING', payload: false });
      return { success: false, error: errorMessage };
    }
  };
  const hasToken = () => {
    return !!localStorage.getItem('accessToken');
  };

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

  const handleRequestSort = useCallback(
    (property) => {
      const isAsc =
        state.sort.orderBy === property && state.sort.order === 'asc';
      dispatch({
        type: 'SET_SORT',
        payload: {
          orderBy: property,
          order: isAsc ? 'desc' : 'asc',
        },
      });
    },
    [state.sort.orderBy, state.sort.order],
  );

  const handleStatusChange = useCallback((event) => {
    dispatch({
      type: 'SET_FILTER',
      payload: { status: event.target.value },
    });
    dispatch({
      type: 'SET_PAGINATION',
      payload: { page: 0 },
    });
  }, []);

  const handleTabChange = useCallback((event, newValue) => {
    dispatch({ type: 'SET_TAB', payload: newValue });
  }, []);

  const getSortedDebts = useCallback(() => {
    const debts =
      state.currentTab === 0 ? state.createdDebts : state.receivedDebts;

    return [...debts].sort((a, b) => {
      const aValue = a[state.sort.orderBy];
      const bValue = b[state.sort.orderBy];

      if (state.sort.orderBy === 'amount') {
        return state.sort.order === 'asc'
          ? Number(aValue) - Number(bValue)
          : Number(bValue) - Number(aValue);
      }

      if (
        state.sort.orderBy === 'createdAt' ||
        state.sort.orderBy === 'updatedAt'
      ) {
        return state.sort.order === 'asc'
          ? new Date(aValue) - new Date(bValue)
          : new Date(bValue) - new Date(aValue);
      }

      return state.sort.order === 'asc'
        ? String(aValue).localeCompare(String(bValue))
        : String(bValue).localeCompare(String(aValue));
    });
  }, [
    state.currentTab,
    state.createdDebts,
    state.receivedDebts,
    state.sort.order,
    state.sort.orderBy,
  ]);

  useEffect(() => {
    if (authState.isAuthenticated && !authState.isLoading) {
      fetchDebtReminders();
    }
  }, [fetchDebtReminders, authState.isAuthenticated, authState.isLoading]);
  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  const formatVND = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount);
  };

  return (
    <DebtContext.Provider
      value={{
        // State
        createdDebts: state.createdDebts,
        receivedDebts: state.receivedDebts,
        loading: state.loading,
        error: state.error,
        pagination: state.pagination,
        sort: state.sort,
        filter: state.filter,
        currentTab: state.currentTab,
        sortedDebts: getSortedDebts(),

        // Methods
        fetchDebtReminders,
        createDebtReminder,
        cancelDebtReminder,
        requestOtpForPayDebt,
        payDebtReminder,
        clearError,
        handleChangePage,
        handleChangeRowsPerPage,
        handleRequestSort,
        handleStatusChange,
        handleTabChange,
        formatVND,
      }}
    >
      {children}
    </DebtContext.Provider>
  );
};

export default DebtContext;
