import { createContext, useContext, useReducer, useCallback, useMemo } from 'react';
import { EmployeeService } from '../services/EmployeeService';

// Utility function to format VND
export const formatVND = (amount) => {
  if (!amount) return '';
  const num = typeof amount === 'string' ? Number(amount.replace(/\D/g, '')) : amount;
  if (isNaN(num)) return '';
  return num.toLocaleString('vi-VN');
};

// Employee reducer for state management
const employeeReducer = (state, action) => {
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
    case 'SET_ACCOUNT_LIST':
      return { ...state, accountList: action.payload };
    case 'SET_CREATE_ACCOUNT':
      return { ...state, createAccount: { ...state.createAccount, ...action.payload } };
    case 'SET_DEPOSIT_ACCOUNT':
      return { ...state, depositAccount: { ...state.depositAccount, ...action.payload } };
    case 'SET_TRANSACTION_ACCOUNT_HISTORY':
      return { ...state, transactionAccountHistory: { ...state.transactionAccountHistory, ...action.payload } };
    case 'SET_TRANSACTIONS':
      return { ...state, transactions: action.payload };
    default:
      return state;
  }
};

const EmployeeContext = createContext();

export const useEmployee = () => useContext(EmployeeContext);

export const EmployeeProvider = ({ children }) => {  
  // Sample accounts data for development
  const mockAccounts = useMemo(() => [
    {
      id: 1,
      username: 'johndoe',
      fullName: 'John Doe',
      email: 'john.doe@example.com',
      phone: '0901234567',
      address: '123 Main St, District 1, HCMC',
      dob: '1990-01-15',
      status: 'Active'
    },
    {
      id: 2,
      username: 'janesmith',
      fullName: 'Jane Smith',
      email: 'jane.smith@example.com',
      phone: '0909876543',
      address: '456 Oak St, District 2, HCMC',
      dob: '1992-03-22',
      status: 'Active'
    },
    {
      id: 3,
      username: 'robertlee',      fullName: 'Robert Lee',
      email: 'robert.lee@example.com',
      phone: '0912345678',
      address: '789 Pine St, District 3, HCMC',
      dob: '1985-07-10',
      status: 'Inactive'
    }
  ], []);

  // Initial state
  const initialState = {
    accountList: [],
    createAccount: {
      fullName: '',
      email: '@example.com',
      phone: '',
      address: '',
      dob: '',
      username: '',
      password: '',
      passwordConfirmation: '',
    },
    depositAccount: {
      username: '',
      accountId: '',
      amount: '',
    },
    transactionAccountHistory: {
      accountId: '',
      type: 'ALL',
    },
    transactions: [],
    loading: false,
    error: null,
    success: null,
  };

  const [state, dispatch] = useReducer(employeeReducer, initialState);

  // Helper functions for handling form changes
  const handleDepositAmountChange = useCallback((e) => {
    const raw = e.target.value.replace(/\D/g, '');
    dispatch({ 
      type: 'SET_DEPOSIT_ACCOUNT', 
      payload: { amount: raw }
    });
  }, []);

  const getFormattedDepositAmount = useCallback(() => formatVND(state.depositAccount.amount), [state.depositAccount.amount]);

  const handleTransactionAmountChange = useCallback((e) => {
    const raw = e.target.value.replace(/\D/g, '');
    dispatch({ 
      type: 'SET_TRANSACTION_ACCOUNT_HISTORY', 
      payload: { amount: raw }
    });
  }, []);

  const getFormattedTransactionAmount = useCallback(() => formatVND(state.transactionAccountHistory.amount), [state.transactionAccountHistory.amount]);

  // API: Fetch Accounts
  const fetchAccounts = useCallback(async () => {
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'CLEAR_ERROR' });
    dispatch({ type: 'CLEAR_SUCCESS' });
    
    try {
      const res = await EmployeeService.fetchAccounts();
      // If the API returns actual accounts data
      if (res && Array.isArray(res.data)) {
        dispatch({ type: 'SET_ACCOUNT_LIST', payload: res.data });
      } else if (res && res.data) {
        // Handle different API response structures
        dispatch({ type: 'SET_ACCOUNT_LIST', payload: res.data.accounts || [res.data] });
      } else {
        // Use mock data for development
        dispatch({ type: 'SET_ACCOUNT_LIST', payload: mockAccounts });
      }
      
      dispatch({ type: 'SET_SUCCESS', payload: 'Accounts loaded successfully!' });
      setTimeout(() => dispatch({ type: 'CLEAR_SUCCESS' }), 3000);
      return res;
    } catch (err) {
      dispatch({ type: 'SET_ACCOUNT_LIST', payload: mockAccounts });
      dispatch({ type: 'SET_ERROR', payload: err.message || 'Failed to fetch accounts' });
      throw err;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, [mockAccounts]);

  //Create Account
  const handleCreateAccount = useCallback(async () => {
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'CLEAR_ERROR' });
    dispatch({ type: 'CLEAR_SUCCESS' });
    
    try {
      const data = { ...state.createAccount };
      delete data.passwordConfirmation;
      const res = await EmployeeService.createAccount(data);

      // Add the new account to the list if successful
      if (res && res.data) {
        const newAccount = {
          ...data,
          id: res.data.id || Date.now(),
          status: 'Active',
        };
        dispatch({ 
          type: 'SET_ACCOUNT_LIST', 
          payload: [newAccount, ...state.accountList] 
        });
      }

      dispatch({ type: 'SET_SUCCESS', payload: 'Account created successfully!' });
      setTimeout(() => dispatch({ type: 'CLEAR_SUCCESS' }), 3000);
      return res;
    } catch (err) {
      dispatch({ type: 'SET_ERROR', payload: err.message || 'Create account failed' });
      throw err;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, [state.createAccount, state.accountList]);

  // API: Deposit Account
  const handleDepositAccount = useCallback(async () => {
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'CLEAR_ERROR' });
    dispatch({ type: 'CLEAR_SUCCESS' });
    
    try {
      const data = {
        username: state.depositAccount.username,
        accountNumber: state.depositAccount.accountId,
        rechargeAmount: state.depositAccount.amount,
        note: state.depositAccount.note || 'Deposit',
      };
      const res = await EmployeeService.depositAccount(data);
      dispatch({ type: 'SET_SUCCESS', payload: 'Deposit successful!' });
      setTimeout(() => dispatch({ type: 'CLEAR_SUCCESS' }), 3000);
      return res;
    } catch (err) {
      dispatch({ type: 'SET_ERROR', payload: err.message || 'Deposit failed' });
      throw err;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, [state.depositAccount]);

  // API: Fetch Transactions
  const fetchTransactions = useCallback(async (customerId, params = {}) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'CLEAR_ERROR' });
    dispatch({ type: 'CLEAR_SUCCESS' });
    
    try {
      const res = await EmployeeService.fetchTransactions({ customerId, ...params });
      // Handle API response structure
      let txs = [];
      if (res && res.data) {
        const sender = Array.isArray(res.data.transactionsAsSender) ? res.data.transactionsAsSender : [];
        const receiver = Array.isArray(res.data.transactionsAsReceiver) ? res.data.transactionsAsReceiver : [];
        txs = [...sender, ...receiver];
      } else if (Array.isArray(res.transactions)) {
        txs = res.transactions;
      } else if (Array.isArray(res)) {
        txs = res;
      }
      
      dispatch({ type: 'SET_TRANSACTIONS', payload: txs });
      dispatch({ type: 'SET_SUCCESS', payload: 'Transactions loaded successfully!' });
      setTimeout(() => dispatch({ type: 'CLEAR_SUCCESS' }), 3000);
      return txs;
    } catch (err) {
      dispatch({ type: 'SET_ERROR', payload: err.message || 'Fetch transactions failed' });
      throw err;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, []);

  return (
    <EmployeeContext.Provider
      value={{
        // Accounts
        accountList: state.accountList,
        setAccountList: (accounts) => dispatch({ type: 'SET_ACCOUNT_LIST', payload: accounts }),
        fetchAccounts,
        
        // Create account
        createAccount: state.createAccount,
        setCreateAccount: (data) => dispatch({ type: 'SET_CREATE_ACCOUNT', payload: data }),
        
        // Deposit account
        depositAccount: state.depositAccount,
        setDepositAccount: (data) => dispatch({ type: 'SET_DEPOSIT_ACCOUNT', payload: data }),
        handleDepositAmountChange,
        getFormattedDepositAmount,
        
        // Transaction account
        transactionAccountHistory: state.transactionAccountHistory,
        setTransactionAccountHistory: (data) => dispatch({ 
          type: 'SET_TRANSACTION_ACCOUNT_HISTORY', payload: data 
        }),
        handleTransactionAmountChange,
        getFormattedTransactionAmount,
        
        // Transactions list
        transactions: state.transactions,
        setTransactions: (txs) => dispatch({ type: 'SET_TRANSACTIONS', payload: txs }),
        
        // Utility
        formatVND,
        loading: state.loading,
        error: state.error,
        success: state.success,
        handleCreateAccount,
        handleDepositAccount,
        fetchTransactions,
      }}
    >
      {children}
    </EmployeeContext.Provider>
  );
};
