import { createContext, useContext, useReducer, useCallback } from 'react';
import { AdminService } from '../../services/AdminService';

// Reducer for transaction state management
const transactionReducer = (state, action) => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'CLEAR_ERROR':
      return { ...state, error: null };
    case 'SET_BANKS':
      return { ...state, banks: action.payload };
    case 'SET_TRANSACTIONS':
      return {
        ...state,
        transactions: action.payload.data,
        totalRecords: action.payload.totalRecords,
        currentPage: action.payload.page,
        pageSize: action.payload.limit,
      };
    case 'SET_STATISTICS':
      return { 
        ...state, 
        statistics: action.payload.statistics, 
        totalRecords: action.payload.totalRecords };
    case 'RESET_STATE':
      return { ...initialState };
    default:
      return state;
  }
};

const initialState = {
  banks: [],
  transactions: null,
  statistics: null,
  loading: true,
  error: null,

  // pagination
  currentPage: 1,
  pageSize: 5,
  totalRecords: 0,
};

const TransactionContext = createContext();

export const useTransaction = () => {
  const context = useContext(TransactionContext);
  if (!context) {
    throw new Error('useTransaction must be used within a TransactionProvider');
  }
  return context;
};

export const TransactionProvider = ({ children }) => {
  const [state, dispatch] = useReducer(transactionReducer, initialState);

  const handleApiError = useCallback((error) => {
    let errorMessage = 'An unexpected error occurred';
    if (error.response) {
      const status = error.response.status;
      const msg = error.response.data?.message;
      const timestamp = error.response.data?.timestamp || new Date().toISOString();
      console.error(`Error ${status}: ${msg} at ${timestamp}`);
      errorMessage = msg || `HTTP ${status} Error`;
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

  const fetchBanks = useCallback(async () => {
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'CLEAR_ERROR' });
    try {
      const banks = await AdminService.fetchBanks();
      dispatch({ type: 'SET_BANKS', payload: banks });
      return banks;
    } catch (error) {
      handleApiError(error);
      return [];
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, [handleApiError]);

  const fetchTransactions = useCallback(async (params) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'CLEAR_ERROR' });
    try {
      const response = await AdminService.fetchBankTransactions(params);
      dispatch({
        type: 'SET_TRANSACTIONS',
        payload: {
          data: response.data,
          page: params.page,
          limit: params.limit,
        },
      });
      return response.data;
    } catch (error) {
      handleApiError(error);
      return [];
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, [handleApiError]);

  const fetchStatistics = useCallback(async (params) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'CLEAR_ERROR' });
    try {
      const response = await AdminService.fetchTransactionStatistics(params);
      dispatch({ 
        type: 'SET_STATISTICS', 
        payload: {
            totalRecords: response.data.totalTransactions,
           statistics: response.data.totalAmount
        }      
    });
      return response.data;
    } catch (error) {
      handleApiError(error);
      return null;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, [handleApiError]);

  const resetState = useCallback(() => {
    dispatch({ type: 'RESET_STATE' });
  }, []);

  const clearError = useCallback(() => {
    dispatch({ type: 'CLEAR_ERROR' });
  }, []);

  const contextValue = {
    banks: state.banks,
    transactions: state.transactions,
    statistics: state.statistics,
    loading: state.loading,
    error: state.error,

    // pagination state
    currentPage: state.currentPage,
    pageSize: state.pageSize,
    totalRecords: state.totalRecords,

    fetchBanks,
    fetchTransactions,
    fetchStatistics,

    handleApiError,
    resetState,
    clearError,
  };

  return (
    <TransactionContext.Provider value={contextValue}>
      {children}
    </TransactionContext.Provider>
  );
};
