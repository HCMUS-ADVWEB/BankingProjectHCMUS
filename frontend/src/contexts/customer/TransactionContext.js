import React, {
  createContext,
  useContext,
  useReducer,
  useCallback,
  useEffect,
} from 'react';
import { useAuth } from '../AuthContext';
import TransactionService from '../../services/customer/TransactionService';

const transactionReducer = (state, action) => {
  switch (action.type) {
    case 'SET_TRANSACTIONS':
      return {
        ...state,
        transactions: {
          transactionsAsSender: action.payload.transactionsAsSender || [],
          transactionsAsReceiver: action.payload.transactionsAsReceiver || [],
        },
      };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'CLEAR_ERROR':
      return { ...state, error: null };
    case 'SET_SUCCESS':
      return { ...state, success: action.payload };
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
    case 'SET_TRANSACTION_DETAILS':
      return { ...state, transactionDetails: action.payload };
    default:
      return state;
  }
};

// Create context
const TransactionContext = createContext();

// Custom hook to use the transaction context
export const useTransaction = () => {
  const context = useContext(TransactionContext);
  if (!context) {
    throw new Error('useTransaction must be used within a TransactionProvider');
  }
  return context;
};

// Transaction provider component
export const TransactionProvider = ({ children }) => {
  const { state: authState } = useAuth();

  // Initial state
  const initialState = {
    transactions: {
      transactionsAsSender: [],
      transactionsAsReceiver: [],
    },
    transactionDetails: null,
    loading: false,
    error: null,
    success: null,
    pagination: {
      page: 0,
      rowsPerPage: 10,
      total: 0,
    },
    sort: {
      orderBy: 'createdAt',
      order: 'desc',
    },
  };

  // Set up reducer
  const [state, dispatch] = useReducer(transactionReducer, initialState);

  // Format currency helper
  const formatVND = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount);
  };

  // Fetch transactions
  const fetchTransactions = useCallback(async () => {
    if (!authState.isAuthenticated) return;

    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'CLEAR_ERROR' });

    try {
      const { page, rowsPerPage } = state.pagination;
      const { orderBy, order } = state.sort;

      const response = await TransactionService.getTransactions(
        rowsPerPage,
        page + 1,
        orderBy,
        order,
      );

      dispatch({
        type: 'SET_TRANSACTIONS',
        payload: response.data || {
          transactionsAsSender: [],
          transactionsAsReceiver: [],
        },
      });

      dispatch({
        type: 'SET_PAGINATION',
        payload: {
          total:
            response.total ||
            (response.data?.transactionsAsSender?.length || 0) +
              (response.data?.transactionsAsReceiver?.length || 0),
        },
      });
    } catch (err) {
      dispatch({
        type: 'SET_ERROR',
        payload: err.response?.data?.message || 'Failed to fetch transactions',
      });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, [
    authState.isAuthenticated,
    state.pagination.page,
    state.pagination.rowsPerPage,
    state.sort.orderBy,
    state.sort.order,
  ]);

  // Fetch transaction details
  const fetchTransactionDetails = useCallback(async (transactionId) => {
    if (!transactionId) return;

    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'CLEAR_ERROR' });

    try {
      const response =
        await TransactionService.getTransactionDetails(transactionId);
      dispatch({ type: 'SET_TRANSACTION_DETAILS', payload: response.data });
    } catch (err) {
      dispatch({
        type: 'SET_ERROR',
        payload:
          err.response?.data?.message || 'Failed to fetch transaction details',
      });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, []);

  // Handle pagination changes
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

  // Handle sorting
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

  // Fetch transactions when auth state, pagination, or sorting changes
  useEffect(() => {
    if (authState.isAuthenticated) {
      fetchTransactions();
    }
  }, [fetchTransactions, authState.isAuthenticated]);

  // Combine all transactions for UI display
  const getAllTransactions = useCallback(() => {
    const { transactionsAsSender = [], transactionsAsReceiver = [] } =
      state.transactions;

    // Combine and format transactions for display
    const allTransactions = [
      ...transactionsAsSender.map((tx) => ({
        ...tx,
        direction: 'outgoing',
        displayAmount: -tx.amount,
      })),
      ...transactionsAsReceiver.map((tx) => ({
        ...tx,
        direction: 'incoming',
        displayAmount: tx.amount,
      })),
    ];

    // Sort by created date (descending by default)
    return allTransactions.sort((a, b) => {
      const dateA = new Date(a.createdAt);
      const dateB = new Date(b.createdAt);
      return state.sort.order === 'asc' ? dateA - dateB : dateB - dateA;
    });
  }, [state.transactions, state.sort.order]);

  // Context value
  const value = {
    // State
    transactions: state.transactions,
    allTransactions: getAllTransactions(),
    transactionDetails: state.transactionDetails,
    loading: state.loading,
    error: state.error,
    success: state.success,
    pagination: state.pagination,
    sort: state.sort,

    // Methods
    fetchTransactions,
    fetchTransactionDetails,
    handleChangePage,
    handleChangeRowsPerPage,
    handleRequestSort,
    formatVND,
  };

  return (
    <TransactionContext.Provider value={value}>
      {children}
    </TransactionContext.Provider>
  );
};
