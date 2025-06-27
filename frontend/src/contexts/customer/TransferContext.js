import React, { createContext, useContext, useReducer, useCallback } from 'react';
import { TRANSFER_STEPS, TRANSFER_TYPES } from '../../utils/transferConstants';
import CustomerService from '../../services/CustomerService';

const TransferContext = createContext();

const initialState = {
  step: TRANSFER_STEPS.FORM,
  transferInfo: null,
  loading: false,
  error: null,
  success: null,
  recipients: [],
  banks: [],
  isFetchingName: false,
  otp: '',
  result: null,
};


function transferReducer(state, action) {
  switch (action.type) {
    case 'SET_STEP':
      return { ...state, step: action.payload };
    case 'SET_TRANSFER_INFO':
      return { ...state, transferInfo: action.payload };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'SET_SUCCESS':
      return { ...state, success: action.payload };
    case 'SET_RECIPIENTS':
      return { ...state, recipients: action.payload };
    case 'SET_BANKS':
      return { ...state, banks: action.payload };
    case 'SET_FETCHING_NAME':
      return { ...state, isFetchingName: action.payload };
    case 'SET_OTP':
      return { ...state, otp: action.payload };
    case 'SET_RESULT':
      return { ...state, result: action.payload };
    case 'RESET_TRANSFER':
      return {
        ...initialState, // reset everything to initial
      };
    default:
      return state;
  }
}

export function TransferProvider({ children, initialAccountNumber }) {
  const [state, dispatch] = useReducer(transferReducer, {
    ...initialState,
    transferInfo: initialAccountNumber
      ? { accountNumber: initialAccountNumber }
      : null,
  });

  const setStep = useCallback((step) => dispatch({ type: 'SET_STEP', payload: step }), []);
  const setTransferInfo = useCallback((info) => dispatch({ type: 'SET_TRANSFER_INFO', payload: info }), []);
  const setLoading = useCallback((loading) => dispatch({ type: 'SET_LOADING', payload: loading }), []);
  const setError = useCallback((error) => dispatch({ type: 'SET_ERROR', payload: error }), []);
  const setSuccess = useCallback((success) => dispatch({ type: 'SET_SUCCESS', payload: success }), []);
  const setRecipients = useCallback((recipients) => dispatch({ type: 'SET_RECIPIENTS', payload: recipients }), []);
  const setBanks = useCallback((banks) => dispatch({ type: 'SET_BANKS', payload: banks }), []);
  const setFetchingName = useCallback((fetching) => dispatch({ type: 'SET_FETCHING_NAME', payload: fetching }), []);
  
  const resetTransfer = () => {
    dispatch({ type: 'RESET_TRANSFER' });
  };

  const sendOtp = useCallback(async () => {
    try {
      await CustomerService.sendOtp('TRANSFER');
      console.log('OTP sent successfully');
    } catch (err) {
      console.error('Failed to send OTP:', err);
      setError('Failed to send OTP. Please try again.');
    }
  }, [setError]);

  const setOtp = useCallback((otp) => {
    dispatch({ type: 'SET_OTP', payload: otp });
  }, []);

  const handleVerifyOtp = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // 1. Call transfer API based on transferInfo.transferType
      if (!state.transferInfo) throw new Error('No transfer info found.');

      const info = state.transferInfo;
      let res;

      if (info.transferType === TRANSFER_TYPES.INTERNAL) {
        res = await CustomerService.internalTransfer({
          accountNumberReceiver: info.accountNumberReceiver,
          amount: Number(info.amount),
          message: info.message,
          feeType: info.feeType,
          otp: state.otp,
        });
      } else {
        res = await CustomerService.externalTransfer({
          receiverAccountNumber: info.accountNumberReceiver,
          amount: Number(info.amount),
          content: info.message,
          otp: state.otp,
          bankCode: info.bankId,
        });
      }

      // 2. If success, move to result page
      setResult(res.data);  // <--- store this response’s data into context
      setStep(TRANSFER_STEPS.COMPLETE);
      setSuccess('Transfer completed successfully.');
    } catch (err) {
      console.error('Transfer failed:', err);
      setError(err.response?.data?.message || 'Transfer failed, please try again.');
    } finally {
      setLoading(false);
    }
  }, [state.otp, state.transferInfo, setLoading, setError, setStep, setSuccess]);

  const fetchBanksAndRecipients = useCallback(async () => {
    try {
      const [banksRes, recipientsRes] = await Promise.all([
        CustomerService.getBanks(),
        CustomerService.getRecipients(),
      ]);
      setBanks(banksRes.data);
      setRecipients(recipientsRes.data);
    } catch (err) {
      console.error('Failed to fetch banks/recipients:', err);
      setError('Failed to load banks and recipients');
    }
  }, [setBanks, setRecipients, setError]);

  const fetchAccountInfo = useCallback(async (accountNumber, bankId, transferType) => {
    if (!accountNumber) {
      return '';
    }

    setFetchingName(true);
    try {
      const res = await CustomerService.getAccountInfo(
        accountNumber,
        transferType === TRANSFER_TYPES.EXTERNAL ? bankId : null
      );
      return res.data.fullName;
    } catch (err) {
      console.error('Failed to fetch account info:', err);
      setError('Failed to fetch recipient information');
      return '';
    } finally {
      setFetchingName(false);
    }
  }, [setFetchingName, setError]);

  const formatCurrency = (value) => {
    if (isNaN(value)) return '0 ₫';
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0,
    }).format(value);
  };

  const setResult = (resultData) => {
    dispatch({ type: 'SET_RESULT', payload: resultData });
  };


  const value = {
    ...state,
    otp: state.otp,
    loading: state.loading,
    error: state.error,
    success: state.success,
    result: state.result,
    setStep,
    setTransferInfo,
    setLoading,
    setError,
    setSuccess,
    setRecipients,
    setBanks,
    setFetchingName,
    fetchBanksAndRecipients,
    fetchAccountInfo,
    sendOtp,
    setOtp,
    handleVerifyOtp,
    formatCurrency,
    resetTransfer
  };

  return <TransferContext.Provider value={value}>{children}</TransferContext.Provider>;
}

export const useTransfer = () => useContext(TransferContext);