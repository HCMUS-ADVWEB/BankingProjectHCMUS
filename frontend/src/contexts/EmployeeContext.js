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
            ordinalNumber: "0",
            category: "RECEIPT",
            remitter: {
                reminiscent: "Bố",
                fullName: "Nguyễn Văn A",
                accountNumber: "0246810112",
                bankId: "finhub0001",
                isInternal: "true"
            },
            transactionAmount: "100000",
            transactionNote: "Cho tien",
            transactionPayer: "RECEIVER",
            transactionTime: "2025-05-02T06:35:20+00:00"
        },
        {
            ordinalNumber: "1",
            category: "TRANSFER",
            recipient: {
                reminiscent: "Bố",
                fullName: "Nguyễn Văn A",
                accountNumber: "0246810112",
                bankId: "finhub0001",
                isInternal: "true"
            },
            transactionAmount: "100000",
            transactionNote: "Tra tien",
            transactionPayer: "RECEIVER",
            transactionTime: "2025-05-03T06:35:20+00:00"
        },
        {
            ordinalNumber: "2",
            category: "DEBT_PAYMENT",
            debtor: {
                reminiscent: "Trần Văn C",
                fullName: "Trần Văn C",
                accountNumber: "0246810657",
                bankId: "othergroup0001",
                isInternal: "false"
            },
            transactionAmount: "100000",
            transactionNote: "Tra no ngay 01/04/2025",
            transactionPayer: "RECEIVER",
            transactionTime: "2025-05-04T06:35:20+00:00"
        }
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
