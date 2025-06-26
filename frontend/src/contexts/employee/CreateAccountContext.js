import { createContext, useContext, useReducer, useCallback } from 'react';
import { EmployeeService } from '../../services/employee/EmployeeService';

const createAccountReducer = (state, action) => {
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
    default:
      return state;
  }
};

const CreateAccountContext = createContext();

const initialState = {
  form: {
    username: '',
    password: '',
    email: '',
    phone: '',
    fullName: '',
    address: '',
    dob: '',
  },
  loading: false,
  error: null,
  success: null,
};

export const useCreateAccount = () => {
  const context = useContext(CreateAccountContext);
  if (!context) throw new Error('useCreateAccount must be used within CreateAccountProvider');
  return context;
};

export const CreateAccountProvider = ({ children }) => {
  const [state, dispatch] = useReducer(createAccountReducer, initialState);

  const handleCreateAccount = useCallback(async () => {
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'CLEAR_MESSAGES' });
    try {
      const data = { ...state.form };
      const res = await EmployeeService.createAccount(data);
      dispatch({
        type: 'SET_SUCCESS',
        payload: `Account created successfully!`,
      });
      dispatch({ type: 'RESET_FORM' });
      return res.data.accountNumber;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to create account';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      return null;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, [state.form]);

  const clearMessages = useCallback(() => {
    dispatch({ type: 'CLEAR_MESSAGES' });
  }, []);

  return (
    <CreateAccountContext.Provider
      value={{
        form: state.form,
        loading: state.loading,
        error: state.error,
        success: state.success,
        setForm: (data) => dispatch({ type: 'SET_FORM', payload: data }),
        resetForm: () => dispatch({ type: 'RESET_FORM' }),
        handleCreateAccount,
        clearMessages,
      }}
    >
      {children}
    </CreateAccountContext.Provider>
  );
};
