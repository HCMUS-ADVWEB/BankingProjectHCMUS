import { createContext, useContext, useReducer, useCallback } from 'react';
import { EmployeeService } from '../../services/employee/EmployeeService';

const transactionReducer = (state, action) => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload, success: null };
    case 'SET_SUCCESS':
      return { ...state, success: action.payload, error: null };
    case 'SET_FORM':
      return { ...state, form: { ...state.form, ...action.payload } };
    case 'RESET_FORM':
      return { ...state, form: initialState.form };
    case 'CLEAR_MESSAGES':
      return { ...state, success: null, error: null };
    case 'SET_TRANSACTIONS':
      return { ...state, transactions: action.payload };
    case 'SET_BANKS':
      return { ...state, banks: action.payload };
    default:
      return state;
  }
};

const EmployeeTransactionContext = createContext();

const initialState = {
  form: {
    accountNumber: '',
    type: 'ALL',
  },
  loading: false,
  error: null,
  success: null,
  transactions: [],
  banks: [],
};

export const useEmployeeTransaction = () => {
  const context = useContext(EmployeeTransactionContext);
  if (!context) throw new Error('useEmployeeTransaction must be used within EmployeeTransactionProvider');
  return context;
};

export const EmployeeTransactionProvider = ({ children }) => {
  const [state, dispatch] = useReducer(transactionReducer, initialState);

  const fetchBanks = useCallback(async () => {
    dispatch({ type: 'CLEAR_MESSAGES' });
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const res = await EmployeeService.fetchBanks();
      dispatch({ type: 'SET_BANKS', payload: res.data });
      return true;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to fetch banks';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      return false
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, []);

  const fetchTransactions = useCallback(async () => {
    if (!state.form.accountNumber) return;
    dispatch({ type: 'SET_TRANSACTIONS', payload: [] });
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'CLEAR_MESSAGES' });
    try {
      const query = {
        limit: 1000000,
        pn: 1,
        type: state.form.type === 'ALL' || state.form.type === null ? undefined : state.form.type,
      };
      const res = await EmployeeService.fetchTransactions(state.form.accountNumber, query);
      dispatch({ type: 'SET_TRANSACTIONS', payload: res.transactions });
      dispatch({
        type: 'SET_SUCCESS',
        payload: res.transactions.length > 0
          ? 'Transactions fetched successfully!'
          : 'No transactions found for this account.',
      });
      return true;
    } catch (err) {
      const errorMessage =  err.response?.data?.message || 'Failed to fetch transactions';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      dispatch({ type: 'SET_TRANSACTIONS', payload: [] });
      return false;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, [state.form.accountNumber, state.form.type]);

  const clearMessages = useCallback(() => {
    dispatch({ type: 'CLEAR_MESSAGES' });
  }, []);

  return (
    <EmployeeTransactionContext.Provider
      value={{
        form: state.form,
        setForm: (data) => dispatch({ type: 'SET_FORM', payload: data }),
        resetForm: () => dispatch({ type: 'RESET_FORM' }),
        loading: state.loading,
        error: state.error,
        success: state.success,
        transactions: state.transactions,
        banks: state.banks,
        fetchBanks,
        fetchTransactions,
        clearMessages,
      }}
    >
      {children}
    </EmployeeTransactionContext.Provider>
  );
};