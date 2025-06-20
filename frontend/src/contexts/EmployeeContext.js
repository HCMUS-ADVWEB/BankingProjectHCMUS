import { Password } from '@mui/icons-material';
import React, { createContext, useContext, useState } from 'react';

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
        {
            id: 'a27e-d89816b0d0a1',
            transactionType: 'INTERNAL_TRANSFER',
            fromBankId: null,
            fromAccountNumber: '5873160242223846',
            toBankId: null,
            toAccountNumber: '9704390632656',
            amount: 10000.0,
            fee: 100.0,
            status: 'PENDING',
            message: 'tra tien',
            createdAt: '2025-06-12T04:53:31.908719Z',
        },
        {
            id: 'b12f-d89816b0d0a2',
            transactionType: 'INTERBANK_TRANSFER',
            fromBankId: 'finhub0001',
            fromAccountNumber: '0246810112',
            toBankId: 'othergroup0001',
            toAccountNumber: '9704390632656',
            amount: 20000.0,
            fee: 200.0,
            status: 'COMPLETED',
            message: 'chuyen khoan',
            createdAt: '2025-06-13T08:20:00.000Z',
        },
        {
            id: 'c34g-d89816b0d0a3',
            transactionType: 'DEBT_PAYMENT',
            fromBankId: null,
            fromAccountNumber: '0246810657',
            toBankId: null,
            toAccountNumber: '5873160242223846',
            amount: 15000.0,
            fee: 150.0,
            status: 'FAILED',
            message: 'tra no ngay 01/04/2025',
            createdAt: '2025-06-14T10:15:00.000Z',
        },
        {
            id: 'd56h-d89816b0d0a4',
            transactionType: 'DEPOSIT',
            fromBankId: null,
            fromAccountNumber: null,
            toBankId: null,
            toAccountNumber: '5873160242223846',
            amount: 5000.0,
            fee: 0.0,
            status: 'COMPLETED',
            message: 'nap tien',
            createdAt: '2025-06-15T12:00:00.000Z',
        },
    ];
    // Transactions list state for transaction page
    const [transactions, setTransactions] = useState(mockTransactions);

    return (
        <EmployeeContext.Provider
            value={{
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
            }}
        >
            {children}
        </EmployeeContext.Provider>
    );
};
