import React, { createContext, useReducer } from 'react';
// import axios from 'axios';

export const BankingContext = createContext();

const bankingReducer = (state, action) => {
  switch (action.type) {
    case 'SET_ACCOUNTS':
      return { ...state, accounts: action.payload };
    case 'SET_RECIPIENTS':
      return { ...state, recipients: action.payload };
    case 'SET_TRANSACTIONS':
      return { ...state, transactions: action.payload };
    case 'SET_DEBTS':
      return { ...state, debts: action.payload };
    case 'ADD_RECIPIENT':
      return { ...state, recipients: [...state.recipients, action.payload] };
    case 'UPDATE_RECIPIENT':
      return {
        ...state,
        recipients: state.recipients.map((r) =>
          r.id === action.payload.id ? action.payload : r
        ),
      };
    case 'DELETE_RECIPIENT':
      return {
        ...state,
        recipients: state.recipients.filter((r) => r.id !== action.payload),
      };
    case 'ADD_DEBT':
      return { ...state, debts: [...state.debts, action.payload] };
    case 'UPDATE_DEBT':
      return {
        ...state,
        debts: state.debts.map((d) => (d.id === action.payload.id ? action.payload : d)),
      };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    default:
      return state;
  }
};

export const BankingProvider = ({ children }) => {
  const [state, dispatch] = useReducer(bankingReducer, {
    accounts: [],
    recipients: [],
    transactions: [],
    debts: [],
    loading: false,
  });

  const fetchAccounts = async () => {
    dispatch({ type: 'SET_LOADING', payload: true });
    // Mock API call
    const response = [{ id: 1, number: '1234567890', balance: 1000000 }];
    dispatch({ type: 'SET_ACCOUNTS', payload: response });
    dispatch({ type: 'SET_LOADING', payload: false });
  };

  const fetchRecipients = async () => {
    dispatch({ type: 'SET_LOADING', payload: true });
    // Mock API call
    const response = [
      { id: 1, recipientAccountNumber: '0987654321', recipientName: 'John Doe' },
    ];
    dispatch({ type: 'SET_RECIPIENTS', payload: response });
    dispatch({ type: 'SET_LOADING', payload: false });
  };

  const addRecipient = async (recipient) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    // Mock API call
    const newRecipient = { id: Date.now(), ...recipient };
    dispatch({ type: 'ADD_RECIPIENT', payload: newRecipient });
    dispatch({ type: 'SET_LOADING', payload: false });
  };

  const updateRecipient = async (recipient) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    // Mock API call
    dispatch({ type: 'UPDATE_RECIPIENT', payload: recipient });
    dispatch({ type: 'SET_LOADING', payload: false });
  };

  const deleteRecipient = async (id) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    // Mock API call
    dispatch({ type: 'DELETE_RECIPIENT', payload: id });
    dispatch({ type: 'SET_LOADING', payload: false });
  };

  const fetchTransactions = async () => {
    dispatch({ type: 'SET_LOADING', payload: true });
    // Mock API call
    const response = [
      {
        id: 1,
        type: 'TRANSFER',
        amount: 50000,
        status: 'COMPLETED',
        fromAccountNumber: '1234567890',
        toAccountNumber: '0987654321',
        createdAt: '2025-06-01T10:00:00Z',
      },
      {
        id: 2,
        type: 'RECEIVED',
        amount: 30000,
        status: 'COMPLETED',
        fromAccountNumber: '0987654321',
        toAccountNumber: '1234567890',
        createdAt: '2025-06-02T12:00:00Z',
      },
      {
        id: 3,
        type: 'DEBT_PAYMENT',
        amount: 20000,
        status: 'COMPLETED',
        fromAccountNumber: '1234567890',
        toAccountNumber: '0987654321',
        createdAt: '2025-06-03T08:00:00Z',
      },
    ];
    dispatch({ type: 'SET_TRANSACTIONS', payload: response });
    dispatch({ type: 'SET_LOADING', payload: false });
  };

  const fetchDebts = async () => {
    dispatch({ type: 'SET_LOADING', payload: true });
    // Mock API call
    const response = [
      {
        id: 1,
        debtor: '0987654321',
        amount: 20000,
        message: 'Lunch debt',
        status: 'PENDING',
        created: '2025-06-01T09:00:00Z',
      },
      {
        id: 2,
        debtor: '1234567890',
        amount: 15000,
        message: 'Coffee debt',
        status: 'PENDING',
        created: '2025-06-02T10:00:00Z',
      },
    ];
    dispatch({ type: 'SET_DEBTS', payload: response });
    dispatch({ type: 'SET_LOADING', payload: false });
  };

  const addDebt = async (debt) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    // Mock API call
    const newDebt = { id: Date.now(), ...debt, status: 'PENDING' };
    dispatch({ type: 'ADD_DEBT', payload: newDebt });
    dispatch({ type: 'SET_LOADING', payload: false });
  };

  const updateDebt = async (debt) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    // Mock API call
    dispatch({ type: 'UPDATE_DEBT', payload: debt });
    dispatch({ type: 'SET_LOADING', payload: false });
  };

  return (
    <BankingContext.Provider
      value={{
        state,
        fetchAccounts,
        fetchRecipients,
        addRecipient,
        updateRecipient,
        deleteRecipient,
        fetchTransactions,
        fetchDebts,
        addDebt,
        updateDebt,
      }}
    >
      {children}
    </BankingContext.Provider>
  );
};