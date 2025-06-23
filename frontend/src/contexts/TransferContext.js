import React, { createContext, useContext, useState, useCallback } from 'react';
import { useAuth } from './AuthContext';
import api from '../utils/api';

// Create Transfer Context
const TransferContext = createContext();

// Custom hook to use the Transfer context
export const useTransfer = () => {
  const context = useContext(TransferContext);
  if (!context) {
    throw new Error('useTransfer must be used within a TransferProvider');
  }
  return context;
};

// Transfer Provider component
export const TransferProvider = ({ children, initialAccountNumber }) => {
  const { state } = useAuth();
  const [form, setForm] = useState({
    accountNumberReceiver: initialAccountNumber || '',
    amount: '',
    message: '',
    feeType: 'SENDER',
    transferType: 'internal',
    sourceAccountNumber: '',
    bankId: '',
    recipientName: '',
  });
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState(1); // 1: form, 2: confirm, 3: otp, 4: save recipient
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [result, setResult] = useState(null);
  const [recipients, setRecipients] = useState([]);
  const [saveRecipient, setSaveRecipient] = useState({
    accountNumber: '',
    bankName: '',
    recipientName: '',
    recipientNickname: '',
  });

  // Format currency input
  const formatCurrency = (value) => {
    if (!value) return '';
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      maximumFractionDigits: 0,
    }).format(value);
  };

  // Remove currency formatting for processing
  const unformatCurrency = (value) => {
    if (!value) return '';
    return value.replace(/[^\d]/g, '');
  };

  // Fetch recipients
  const fetchRecipients = useCallback(async () => {
    try {
      const res = await api.get('/api/recipients', { params: { limit: 20, page: 1 } });
      setRecipients(res.data.data || []);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    }
  }, []);

  // Initialize by fetching recipients
  React.useEffect(() => {
    fetchRecipients();
  }, [fetchRecipients]);

  // Form handlers
  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    
    if (name === 'amount') {
      const unformattedValue = unformatCurrency(value);
      if (unformattedValue < 0) return; // Prevent negative amount
      setForm(prev => ({ ...prev, amount: unformattedValue }));
    } else if (name === 'accountNumberReceiver') {
      const selectedRecipient = recipients.find(
        (rec) => rec.accountNumber === value,
      );
      setForm(prev => ({
        ...prev,
        accountNumberReceiver: value,
        bankId: selectedRecipient?.bankName || prev.bankId,
        recipientName: selectedRecipient?.recipientName || prev.recipientName,
      }));
    } else {
      setForm(prev => ({ ...prev, [name]: value }));
    }
  }, [recipients]);

  const handleRecipientChange = useCallback((e) => {
    const value = e.target.value;
    if (value === 'manual') {
      setForm(prev => ({
        ...prev,
        accountNumberReceiver: '',
        bankId: '',
        recipientName: '',
      }));
    } else {
      const selectedRecipient = recipients.find(
        (rec) => rec.accountNumber === value,
      );
      setForm(prev => ({
        ...prev,
        accountNumberReceiver: value,
        bankId: selectedRecipient?.bankName || '',
        recipientName: selectedRecipient?.recipientName || '',
      }));
    }
  }, [recipients]);

  const handleSaveRecipientChange = useCallback((e) => {
    setSaveRecipient(prev => ({ ...prev, [e.target.name]: e.target.value }));
  }, []);

  // Process steps
  const handleConfirm = useCallback(() => {
    if (!form.accountNumberReceiver || !form.amount) {
      setError('Please fill in all required fields.');
      return;
    }
    if (parseFloat(form.amount) <= 0) {
      setError('Amount must be greater than 0.');
      return;
    }
    setError(null);
    setStep(2); // Move to confirmation step
  }, [form]);

  const handleRequestOtp = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      await api.post('/api/otp', {
        userId: state.user.id,
        email: state.user.email,
        otpType: 'TRANSFER',
      });
      setStep(3); // Move to OTP step
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      setStep(1); // Go back to form on error
    } finally {
      setLoading(false);
    }
  }, [state.user]);

  // Handle OTP verification and complete transfer
  const handleVerifyOtp = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const payload =
        form.transferType === 'internal'
          ? {
            accountNumberReceiver: form.accountNumberReceiver,
            amount: parseFloat(form.amount),
            message: form.message,
            feeType: form.feeType,
            otp,
          }
          : {
            sourceAccountNumber: form.sourceAccountNumber,
            recipient: {
              destinationAccountNumber: form.accountNumberReceiver,
              reminiscent: form.recipientName,
              fullName: form.recipientName,
              bankId: form.bankId || 'othergroup0002',
              isInternal: false,
            },
            transactionAmount: parseFloat(form.amount),
            transactionNote: form.message,
            transactionPayer: form.feeType,
          };      const { data } = await api.post(
        form.transferType === 'internal'
          ? '/api/transactions/internal'
          : '/api/transactions/external',
        payload,      );
      setResult(data.data);
      setSuccess('Transfer successful!');
      
      // Always move to the complete step to show transaction result
      setStep(4); // COMPLETE step
      
      // Check if recipient exists
      const recipientExists = recipients.some(
        (rec) => rec.accountNumber === form.accountNumberReceiver
      );
      
      // If recipient doesn't exist, we'll handle save recipient after showing result
      if (!recipientExists) {
        setSaveRecipient({
          accountNumber: form.accountNumberReceiver,
          bankName: form.bankId,
          recipientName: form.recipientName,
          recipientNickname: '',
        });
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'An error occurred during the transaction');
      // Stay on OTP step to let user try again
      setStep(3); // OTP step
    } finally {
      setLoading(false);
    }
  }, [form, otp, recipients]);
  const handleSaveRecipient = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      await api.post('/api/recipients', {
        accountNumber: saveRecipient.accountNumber,
        bankName: saveRecipient.bankName || 'othergroup0002',
        recipientName: saveRecipient.recipientName,
        recipientNickname: saveRecipient.recipientNickname || saveRecipient.recipientName,
      });
      setSuccess('Recipient saved successfully!');
      setSaveRecipient({
        accountNumber: '',
        bankName: '',
        recipientName: '',
        recipientNickname: '',
      });
      // Refresh recipients list
      fetchRecipients();
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to save recipient');
    } finally {
      setLoading(false);
    }
  }, [saveRecipient, fetchRecipients]);
  // Reset the transfer form and state
  const resetTransfer = useCallback(() => {
    setStep(1);
    setForm({
      accountNumberReceiver: '',
      amount: '',
      message: '',
      feeType: 'SENDER',
      transferType: 'internal',
      sourceAccountNumber: '',
      bankId: '',
      recipientName: '',
    });
    setOtp('');
    setError(null);
    setSuccess(null);
    setResult(null);
    setSaveRecipient({
      accountNumber: '',
      bankName: '',
      recipientName: '',
      recipientNickname: '',
    });
  }, []);

  // Set form from location state (if any)
  const updateFormFromLocationState = useCallback((locationState) => {
    if (locationState?.accountNumberReceiver) {
      setForm(prev => ({
        ...prev,
        accountNumberReceiver: locationState.accountNumberReceiver
      }));
    }
  }, []);
  const value = {
    // State
    form,
    setForm,
    otp,
    setOtp,
    step,
    setStep,
    loading,
    error,
    setError,
    success,
    setSuccess,
    result,
    recipients,
    saveRecipient,
    setSaveRecipient,
    state,
    
    // Methods
    formatCurrency,
    unformatCurrency,
    handleChange,
    handleRecipientChange,
    handleSaveRecipientChange,
    handleConfirm,    handleRequestOtp,
    handleVerifyOtp,
    handleSaveRecipient,
    resetTransfer,
    updateFormFromLocationState,
  };

  return (
    <TransferContext.Provider value={value}>
      {children}
    </TransferContext.Provider>
  );
};
