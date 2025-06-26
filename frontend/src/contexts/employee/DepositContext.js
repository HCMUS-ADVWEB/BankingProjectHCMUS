import { createContext, useContext, useReducer, useCallback } from 'react';
import { EmployeeService } from '../../services/employee/EmployeeService';

const depositReducer = (state, action) => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload, success: null };
    case 'SET_SUCCESS':
      return { ...state, success: action.payload, error: null };
    case 'SET_FORM':
      return { ...state, form: { ...state.form, ...action.payload } };
    case 'RESET_AMOUNT':
      return { ...state, form: { ...state.form, amount: '' } };
    case 'RESET_FORM':
      return { ...state, form: initialState.form };
    case 'CLEAR_MESSAGES':
      return { ...state, success: null, error: null };
    default:
      return state;
  }
};

const DepositContext = createContext();

const initialState = {
  form: {
    accountNumberReceiver: '',
    amount: '',
  },
  loading: false,
  error: null,
  success: null,
};

export const useDeposit = () => {
  const context = useContext(DepositContext);
  if (!context)
    throw new Error('useDeposit must be used within DepositProvider');
  return context;
};

export const DepositProvider = ({ children }) => {
  const [state, dispatch] = useReducer(depositReducer, initialState);

  const handleDepositAccount = useCallback(async () => {
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'CLEAR_MESSAGES' });
    try {
      const data = {
        accountNumberReceiver: state.form.accountNumberReceiver,
        amount: parseInt(state.form.amount),
      };
      await EmployeeService.depositAccount(data);
      dispatch({ type: 'SET_SUCCESS', payload: 'Deposit successful!' });
      dispatch({ type: 'RESET_AMOUNT' });
      return true;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to deposit';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      return false;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, [state.form]);

  const clearMessages = useCallback(() => {
    dispatch({ type: 'CLEAR_MESSAGES' });
  }, []);

  const formatVND = useCallback((value) => {
    if (!value) return '';
    return parseInt(value).toLocaleString('vi-VN');
  }, []);

  return (
    <DepositContext.Provider
      value={{
        form: state.form,
        loading: state.loading,
        error: state.error,
        success: state.success,
        setForm: (data) => dispatch({ type: 'SET_FORM', payload: data }),
        resetForm: () => dispatch({ type: 'RESET_FORM' }),
        handleDepositAccount,
        clearMessages,
        formatVND,
      }}
    >
      {children}
    </DepositContext.Provider>
  );
};
