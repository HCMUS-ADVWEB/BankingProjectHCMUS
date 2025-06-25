import React, {
  createContext,
  useContext,
  useReducer,
  useCallback,
  useEffect,
} from 'react';
import { useAuth } from '../AuthContext';
import TransferService from '../../services/customer/TransferService';
import { formatVND } from '../../utils/constants';

const transferReducer = (state, action) => {
  switch (action.type) {
    case 'SET_FORM':
      return { ...state, form: { ...state.form, ...action.payload } };
    case 'SET_OTP':
      return { ...state, otp: action.payload };
    case 'SET_STEP':
      return { ...state, step: action.payload };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'CLEAR_ERROR':
      return { ...state, error: null };
    case 'SET_SUCCESS':
      return { ...state, success: action.payload };
    case 'SET_RESULT':
      return { ...state, result: action.payload };
    case 'SET_RECIPIENTS':
      return { ...state, recipients: action.payload };
    case 'SET_SAVE_RECIPIENT':
      return {
        ...state,
        saveRecipient: { ...state.saveRecipient, ...action.payload },
      };
    case 'RESET_TRANSFER':
      return {
        ...state,
        form: {
          accountNumberReceiver: '',
          amount: '',
          message: '',
          feeType: 'SENDER',
          transferType: 'internal',
          sourceAccountNumber: '',
          bankId: '',
          recipientName: '',
        },
        otp: '',
        step: 1,
        error: null,
        success: null,
        result: null,
        saveRecipient: {
          accountNumber: '',
          bankName: '',
          recipientName: '',
          recipientNickname: '',
        },
      };
    default:
      return state;
  }
};

const TransferContext = createContext();

export const useTransfer = () => {
  const context = useContext(TransferContext);
  if (!context) {
    throw new Error('useTransfer must be used within a TransferProvider');
  }
  return context;
};

export const TransferProvider = ({ children, initialAccountNumber }) => {
  const { state: authState } = useAuth();

  const initialState = {
    form: {
      accountNumberReceiver: initialAccountNumber || '',
      amount: '',
      message: '',
      feeType: 'SENDER',
      transferType: 'internal',
      sourceAccountNumber: '',
      bankId: '',
      recipientName: '',
    },
    otp: '',
    step: 1, // 1: form, 2: confirm, 3: otp, 4: save recipient
    loading: false,
    error: null,
    success: null,
    result: null,
    recipients: [],
    saveRecipient: {
      accountNumber: '',
      bankName: '',
      recipientName: '',
      recipientNickname: '',
    },
  };
  const [state, dispatch] = useReducer(transferReducer, initialState);
  const formatCurrency = (value) => {
    if (!value) return '';
    const numValue = Number(value);

    return formatVND(numValue);
  };

  const unformatCurrency = (value) => {
    if (!value) return '';
    return value.replace(/[^\d]/g, '');
  };

  // Fetch recipients
  const fetchRecipients = useCallback(async () => {
    try {
      const response = await TransferService.getRecipients(20, 1);
      dispatch({ type: 'SET_RECIPIENTS', payload: response.data || [] });
    } catch (err) {
      dispatch({
        type: 'SET_ERROR',
        payload: err.response?.data?.message || err.message,
      });
    }
  }, []);
  useEffect(() => {
    if (authState.isAuthenticated && authState.user?.id) {
      fetchRecipients();
    }
  }, [fetchRecipients, authState.isAuthenticated, authState.user?.id]);

  // Form handlers
  const handleChange = useCallback(
    (e) => {
      const { name, value } = e.target;

      if (name === 'amount') {
        const unformattedValue = unformatCurrency(value);
        if (unformattedValue < 0) return;
        dispatch({ type: 'SET_FORM', payload: { amount: unformattedValue } });
      } else if (name === 'accountNumberReceiver') {
        const selectedRecipient = state.recipients.find(
          (rec) => rec.accountNumber === value,
        );

        dispatch({
          type: 'SET_FORM',
          payload: {
            accountNumberReceiver: value,
            bankId: selectedRecipient?.bankName || state.form.bankId,
            recipientName:
              selectedRecipient?.recipientName || state.form.recipientName,
          },
        });
      } else {
        dispatch({ type: 'SET_FORM', payload: { [name]: value } });
      }
    },
    [state.recipients, state.form.bankId, state.form.recipientName],
  );

  const handleRecipientChange = useCallback(
    (e) => {
      const value = e.target.value;
      if (value === 'manual') {
        dispatch({
          type: 'SET_FORM',
          payload: {
            accountNumberReceiver: '',
            bankId: '',
            recipientName: '',
          },
        });
      } else {
        const selectedRecipient = state.recipients.find(
          (rec) => rec.accountNumber === value,
        );
        if (selectedRecipient) {
          dispatch({
            type: 'SET_FORM',
            payload: {
              accountNumberReceiver: selectedRecipient.accountNumber,
              bankId: selectedRecipient.bankName,
              recipientName: selectedRecipient.recipientName,
            },
          });
        }
      }
    },
    [state.recipients],
  );

  const handleSaveRecipientChange = useCallback((e) => {
    const { name, value } = e.target;
    dispatch({ type: 'SET_SAVE_RECIPIENT', payload: { [name]: value } });
  }, []);
  // Validation and form submission
  const validateForm = useCallback(() => {
    const { accountNumberReceiver, amount, sourceAccountNumber, transferType } =
      state.form;

    if (!accountNumberReceiver) {
      dispatch({
        type: 'SET_ERROR',
        payload: 'Receiver account number is required',
      });
      return false;
    }

    if (!amount || amount <= 0) {
      dispatch({ type: 'SET_ERROR', payload: 'Valid amount is required' });
      return false;
    }

    if (transferType === 'external' && !sourceAccountNumber) {
      dispatch({
        type: 'SET_ERROR',
        payload: 'Source account is required for external transfers',
      });
      return false;
    }
    dispatch({ type: 'CLEAR_ERROR' });
    return true;
  }, [state.form]);
  const handleConfirm = useCallback(async () => {
    // For internal transfers, set a default source account if not provided
    if (
      state.form.transferType === 'internal' &&
      !state.form.sourceAccountNumber
    ) {
      dispatch({
        type: 'SET_FORM',
        payload: { sourceAccountNumber: 'DEFAULT_INTERNAL_ACCOUNT' },
      });
    }

    if (!validateForm()) return;

    dispatch({ type: 'SET_LOADING', payload: true });

    try {
      dispatch({ type: 'SET_STEP', payload: 2 });
    } catch (err) {
      dispatch({
        type: 'SET_ERROR',
        payload: err.response?.data?.message || 'Failed to validate form',
      });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, [validateForm, state.form]);
  const handleRequestOtp = useCallback(async () => {
    dispatch({ type: 'SET_LOADING', payload: true });

    try {
      await TransferService.requestOtp(
        authState.user?.id,
        authState.user?.email,
        'TRANSFER',
      );

      dispatch({ type: 'SET_SUCCESS', payload: 'OTP sent to your email' });
      dispatch({ type: 'SET_STEP', payload: 3 });
    } catch (err) {
      dispatch({
        type: 'SET_ERROR',
        payload: err.response?.data?.message || 'Failed to request OTP',
      });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, [authState.user]);
  const handleVerifyOtp = useCallback(async () => {
    if (!state.otp) {
      dispatch({ type: 'SET_ERROR', payload: 'OTP is required' });
      return;
    }

    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'CLEAR_ERROR' });

    try {
      const payload = {
        ...state.form,
        otp: state.otp,
        email: authState.user?.email,
        userId: authState.user?.id,
      };

      const response =
        state.form.transferType === 'internal'
          ? await TransferService.internalTransfer(payload)
          : await TransferService.externalTransfer(payload);

      dispatch({ type: 'SET_RESULT', payload: response });
      dispatch({ type: 'SET_SUCCESS', payload: 'Transfer successful' });

      dispatch({ type: 'SET_STEP', payload: 4 });

      dispatch({
        type: 'SET_SAVE_RECIPIENT',
        payload: {
          accountNumber: state.form.accountNumberReceiver,
          bankName: state.form.bankId,
          recipientName: state.form.recipientName,
          recipientNickname: '',
        },
      });
    } catch (err) {
      dispatch({
        type: 'SET_ERROR',
        payload: err.response?.data?.message || 'Transfer failed',
      });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, [state.otp, state.form, authState.user]);

  // Define resetTransfer first
  const resetTransfer = useCallback(() => {
    dispatch({ type: 'RESET_TRANSFER' });
  }, []);

  const handleSaveRecipient = useCallback(async () => {
    if (!state.saveRecipient.recipientNickname) {
      dispatch({ type: 'SET_ERROR', payload: 'Nickname is required' });
      return;
    }

    dispatch({ type: 'SET_LOADING', payload: true });

    try {
      await TransferService.saveRecipient({
        accountNumber: state.saveRecipient.accountNumber,
        bankName: state.saveRecipient.bankName,
        recipientName: state.saveRecipient.recipientName,
        nickname: state.saveRecipient.recipientNickname,
      });

      dispatch({
        type: 'SET_SUCCESS',
        payload: 'Recipient saved successfully',
      });
      fetchRecipients();
      resetTransfer();
    } catch (err) {
      dispatch({
        type: 'SET_ERROR',
        payload: err.response?.data?.message || 'Failed to save recipient',
      });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, [state.saveRecipient, fetchRecipients, resetTransfer]);

  const updateFormFromLocationState = useCallback((locationState) => {
    if (locationState?.accountNumberReceiver) {
      dispatch({
        type: 'SET_FORM',
        payload: { accountNumberReceiver: locationState.accountNumberReceiver },
      });
    }
  }, []);

  const value = {
    // State
    form: state.form,
    otp: state.otp,
    step: state.step,
    loading: state.loading,
    error: state.error,
    success: state.success,
    result: state.result,
    recipients: state.recipients,
    saveRecipient: state.saveRecipient,
    authState,

    setForm: (formData) => dispatch({ type: 'SET_FORM', payload: formData }),
    setOtp: (otp) => dispatch({ type: 'SET_OTP', payload: otp }),
    setStep: (step) => dispatch({ type: 'SET_STEP', payload: step }),
    setError: (error) => dispatch({ type: 'SET_ERROR', payload: error }),
    setSuccess: (success) =>
      dispatch({ type: 'SET_SUCCESS', payload: success }),
    setSaveRecipient: (data) =>
      dispatch({ type: 'SET_SAVE_RECIPIENT', payload: data }),

    // Methods
    formatCurrency,
    formatVND,
    unformatCurrency,
    handleChange,
    handleRecipientChange,
    handleSaveRecipientChange,
    handleConfirm,
    handleRequestOtp,
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
