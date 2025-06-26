import { createContext, useContext, useReducer, useCallback } from 'react';
import { AdminService } from '../../services/AdminService';

// Initial state
const initialState = {
  banks: [],
  statisticsByMonth: [],
  totalYearTransactions: 0,
  totalYearAmount: 0,
  loading: true,
  error: null,
};

// Reducer
const statisticsReducer = (state, action) => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'CLEAR_ERROR':
      return { ...state, error: null };
    case 'SET_BANKS':
      return { ...state, banks: action.payload };
    case 'SET_STATISTICS_BY_MONTH':
      return {
        ...state,
        statisticsByMonth: action.payload.list,
        totalYearTransactions: action.payload.totalTransactions,
        totalYearAmount: action.payload.totalAmount,
      };
    case 'RESET':
      return { ...initialState };
    default:
      return state;
  }
};

// Context
const BankStatisticsContext = createContext();

export const useBankStatistics = () => {
  const context = useContext(BankStatisticsContext);
  if (!context) {
    throw new Error('useBankStatistics must be used within a BankStatisticsProvider');
  }
  return context;
};

// Provider
export const BankStatisticsProvider = ({ children }) => {
  const [state, dispatch] = useReducer(statisticsReducer, initialState);

  const handleApiError = useCallback((error) => {
    let errorMessage = 'An unexpected error occurred';
    if (error.response) {
      errorMessage = error.response.data?.message || `HTTP ${error.response.status} Error`;
    } else if (error.request) {
      errorMessage = 'Network error or no response from server';
    } else {
      errorMessage = error.message;
    }
    dispatch({ type: 'SET_ERROR', payload: errorMessage });
    console.error(errorMessage);
  }, []);

  // Fetch banks list
  const fetchBanks = useCallback(async () => {
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'CLEAR_ERROR' });
    try {
      const banks = await AdminService.fetchBanks();
      dispatch({ type: 'SET_BANKS', payload: banks });
      return banks;
    } catch (error) {
      handleApiError(error);
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, [handleApiError]);

  // Fetch 12 tháng statistics
  const fetchStatisticsForYear = useCallback(async ({ year, bankCode }) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'CLEAR_ERROR' });

    function toLocalDateString(date) {
      const y = date.getFullYear();
      const m = (date.getMonth() + 1).toString().padStart(2, '0');
      const d = date.getDate().toString().padStart(2, '0');
      return `${y}-${m}-${d}`;
    }

    try {
      const months = Array.from({ length: 12 }, (_, i) => i); // 0..11

      const fetchPromises = months.map(async (month) => {
        const startDate = toLocalDateString(new Date(year, month, 1));
        const endDate = toLocalDateString(new Date(year, month + 1, 0));

        const res = await AdminService.fetchTransactionStatistics({
          startDate,
          endDate,
          bankCode: bankCode === 'All Banks' ? null : bankCode,
        });

        return {
          month: month + 1,
          totalTransactions: res.data.totalTransactions,
          totalAmount: res.data.totalAmount,
        };
      });

      const results = await Promise.all(fetchPromises);

      const totalTransactions = results.reduce((sum, item) => sum + item.totalTransactions, 0);
      const totalAmount = results.reduce((sum, item) => sum + item.totalAmount, 0);

      dispatch({
        type: 'SET_STATISTICS_BY_MONTH',
        payload: {
          list: results,
          totalTransactions,
          totalAmount,
        },
      });
    } catch (error) {
      handleApiError(error);
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, [handleApiError]);

  const resetStatistics = useCallback(() => {
    dispatch({ type: 'RESET' });
  }, []);

  const contextValue = {
    banks: state.banks,
    statisticsByMonth: state.statisticsByMonth,
    totalYearTransactions: state.totalYearTransactions,
    totalYearAmount: state.totalYearAmount,
    loading: state.loading,
    error: state.error,
    fetchBanks,
    fetchStatisticsForYear,
    resetStatistics,
  };

  return (
    <BankStatisticsContext.Provider value={contextValue}>
      {children}
    </BankStatisticsContext.Provider>
  );
};
