
import { createContext, useContext, useState } from 'react';
import { EmployeeService } from '../services/EmployeeService';

// Utility function to format VND
export const formatVND = (amount) => {
  if (!amount) return '';
  const num = typeof amount === 'string' ? Number(amount.replace(/\D/g, '')) : amount;
  if (isNaN(num)) return '';
  return num.toLocaleString('vi-VN');
};

const EmployeeContext = createContext();

export const useEmployee = () => useContext(EmployeeContext);

export const EmployeeProvider = ({ children }) => {
  //// Dashboard
  const [accountList, setAccountList] = useState([]);
  //// Create account
  const [createAccount, setCreateAccount] = useState({
    fullName: '',
    email: '@example.com',
    phone: '',
    address: '',
    dob: '',
    username: '',
    password: '',
    passwordConfirmation: '',
  });


  //// Deposit account
  const [depositAccount, setDepositAccount] = useState({
    username: '',
    accountId: '',
    amount: '',
  });
  const handleDepositAmountChange = (e) => {
    const raw = e.target.value.replace(/\D/g, '');
    setDepositAccount((prev) => ({ ...prev, amount: raw }));
  };
  const getFormattedDepositAmount = () => formatVND(depositAccount.amount);

  //// Transaction account
  const [transactionAccountHistory, setTransactionAccountHistory] = useState({
    accountId: '',
    type: 'ALL',
  });
  const handleTransactionAmountChange = (e) => {
    const raw = e.target.value.replace(/\D/g, '');
    setTransactionAccountHistory((prev) => ({ ...prev, amount: raw }));
  };
  const getFormattedTransactionAmount = () => formatVND(transactionAccountHistory.amount);

  // Mock transactions data
  const mockTransactions = [
    // {
    //     id: 'a27e-d89816b0d0a1',
    //     transactionType: 'INTERNAL_TRANSFER',
    //     fromBankId: null,
    //     fromAccountNumber: '5873160242223846',
    //     toBankId: null,
    //     toAccountNumber: '9704390632656',
    //     amount: 10000.0,
    //     fee: 100.0,
    //     status: 'PENDING',
    //     message: 'tra tien',
    //     createdAt: '2025-06-12T04:53:31.908719Z',
    // },
    // {
    //     id: 'b12f-d89816b0d0a2',
    //     transactionType: 'INTERBANK_TRANSFER',
    //     fromBankId: 'finhub0001',
    //     fromAccountNumber: '0246810112',
    //     toBankId: 'othergroup0001',
    //     toAccountNumber: '9704390632656',
    //     amount: 20000.0,
    //     fee: 200.0,
    //     status: 'COMPLETED',
    //     message: 'chuyen khoan',
    //     createdAt: '2025-06-13T08:20:00.000Z',
    // },
    // {
    //     id: 'c34g-d89816b0d0a3',
    //     transactionType: 'DEBT_PAYMENT',
    //     fromBankId: null,
    //     fromAccountNumber: '0246810657',
    //     toBankId: null,
    //     toAccountNumber: '5873160242223846',
    //     amount: 15000.0,
    //     fee: 150.0,
    //     status: 'FAILED',
    //     message: 'tra no ngay 01/04/2025',
    //     createdAt: '2025-06-14T10:15:00.000Z',
    // },
    // {
    //     id: 'd56h-d89816b0d0a4',
    //     transactionType: 'DEPOSIT',
    //     fromBankId: null,
    //     fromAccountNumber: null,
    //     toBankId: null,
    //     toAccountNumber: '5873160242223846',
    //     amount: 5000.0,
    //     fee: 0.0,
    //     status: 'COMPLETED',
    //     message: 'nap tien',
    //     createdAt: '2025-06-15T12:00:00.000Z',
    // },
  ];

  // Sample accounts data for development
  const mockAccounts = [
    {
      id: 1,
      username: 'johndoe',
      fullName: 'John Doe',
      email: 'john.doe@example.com',
      phone: '0901234567',
      address: '123 Main St, District 1, HCMC',
      dob: '1990-01-15',
      status: 'Active',
    },
    {
      id: 2,
      username: 'janesmith',
      fullName: 'Jane Smith',
      email: 'jane.smith@example.com',
      phone: '0909876543',
      address: '456 Oak St, District 2, HCMC',
      dob: '1992-03-22',
      status: 'Active',
    },
    {
      id: 3,
      username: 'robertlee',
      fullName: 'Robert Lee',
      email: 'robert.lee@example.com',
      phone: '0912345678',
      address: '789 Pine St, District 3, HCMC',
      dob: '1985-07-10',
      status: 'Inactive',
    },
  ];

  // Transactions list state for transaction page
  const [transactions, setTransactions] = useState(mockTransactions);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // API: Fetch Accounts
  const fetchAccounts = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const res = await EmployeeService.fetchAccounts();
      // If the API returns actual accounts data
      if (res && Array.isArray(res.data)) {
        setAccountList(res.data);
      } else if (res && res.data) {
        // Handle different API response structures
        setAccountList(res.data.accounts || [res.data]);
      } else {
        // Use mock data for development
        setAccountList(mockAccounts);
      }
      setSuccess('Accounts loaded successfully!');
      setTimeout(() => setSuccess(null), 3000);
      return res;
    } catch (err) {
      console.error('Error fetching accounts:', err);
      // Use mock data on error for development
      setAccountList(mockAccounts);
      setError(err.message || 'Failed to fetch accounts');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // API: Create Account
  const handleCreateAccount = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const data = { ...createAccount };
      // Remove passwordConfirmation before sending
      delete data.passwordConfirmation;
      const res = await EmployeeService.createAccount(data);

      // Add the new account to the list if successful
      if (res && res.data) {
        const newAccount = {
          ...data,
          id: res.data.id || Date.now(),
          status: 'Active',
        };
        setAccountList(prev => [newAccount, ...prev]);
      }

      setSuccess('Account created successfully!');
      setTimeout(() => setSuccess(null), 3000);
      return res;
    } catch (err) {
      setError(err.message || 'Create account failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // API: Deposit Account
  const handleDepositAccount = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const data = {
        username: depositAccount.username,
        accountNumber: depositAccount.accountId,
        rechargeAmount: depositAccount.amount,
        note: depositAccount.note || 'Deposit',
      };
      const res = await EmployeeService.depositAccount(data);
      setSuccess('Deposit successful!');
      setTimeout(() => setSuccess(null), 3000);
      return res;
    } catch (err) {
      setError(err.message || 'Deposit failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // API: Fetch Transactions
  const fetchTransactions = async (customerId, params = {}) => {
    setLoading(true);
    setError(null);
    setSuccess(null);
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
      setTransactions(txs);
      setSuccess('Transactions loaded successfully!');
      setTimeout(() => setSuccess(null), 3000);
      return txs;
    } catch (err) {
      setError(err.message || 'Fetch transactions failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return (
    <EmployeeContext.Provider
      value={{
        // Accounts
        accountList,
        setAccountList,
        fetchAccounts,
        // Create account
        createAccount,
        setCreateAccount,
        // Deposit account
        depositAccount,
        setDepositAccount,
        handleDepositAmountChange,
        getFormattedDepositAmount,
        // Transaction account
        transactionAccountHistory,
        setTransactionAccountHistory,
        handleTransactionAmountChange,
        getFormattedTransactionAmount,
        // Transactions list
        transactions,
        setTransactions,
        // Utility
        formatVND,
        loading,
        error,
        success,
        handleCreateAccount,
        handleDepositAccount,
        fetchTransactions,
      }}
    >
      {children}
    </EmployeeContext.Provider>
  );
};
