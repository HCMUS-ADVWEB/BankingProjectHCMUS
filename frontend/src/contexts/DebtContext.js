import React, { createContext, useContext, useReducer, useEffect } from 'react';
import DebtService from '../services/DebtService';
import { useAuth } from './AuthContext';

const debtReducer = (state, action) => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'CLEAR_ERROR':
      return { ...state, error: null };
    case 'SET_CREATED_DEBTS':
      return { ...state, createdDebts: action.payload };
    case 'SET_RECEIVED_DEBTS':
      return { ...state, receivedDebts: action.payload };
    case 'FETCH_DEBTS_START':
      return { ...state, loading: true, error: null };
    case 'FETCH_DEBTS_SUCCESS':
      return {
        ...state,
        createdDebts: action.payload.createdDebts,
        receivedDebts: action.payload.receivedDebts,
        loading: false,
        error: null
      };
    case 'FETCH_DEBTS_FAILURE':
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

const DebtContext = createContext();

export const useDebt = () => useContext(DebtContext);

export const DebtProvider = ({ children }) => {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  
  const [state, dispatch] = useReducer(debtReducer, {
    createdDebts: [],
    receivedDebts: [],
    loading: false,
    error: null
  });

  const fetchDebtReminders = async (status = null, limit = 10, page = 1) => {
    dispatch({ type: 'FETCH_DEBTS_START' });
    
    try {
      const response = await DebtService.getDebtReminderLists(status, limit, page);
      
      if (response && response.status === 200) {
        const createdDebtsData = response.data.createdDebts || [];
        const receivedDebtsData = response.data.receivedDebts || [];
        
        dispatch({ 
          type: 'FETCH_DEBTS_SUCCESS', 
          payload: {
            createdDebts: createdDebtsData,
            receivedDebts: receivedDebtsData
          }
        });
      } else {
        const errorMsg = response?.message || 'Failed to fetch debt reminders';
        dispatch({ type: 'SET_ERROR', payload: errorMsg });
      }
    } catch (err) {
      console.error('Error fetching debt reminders:', err);
      dispatch({ 
        type: 'FETCH_DEBTS_FAILURE', 
        payload: 'Error fetching debt reminders. Please try again later.'
      });
    }
  };

  const createDebtReminder = async (debtData) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'CLEAR_ERROR' });
    
    try {
      const response = await DebtService.createDebtReminder(debtData);
      
      if (response && response.status === 200) {
        // Refresh the debt reminders list
        await fetchDebtReminders();
        dispatch({ type: 'SET_LOADING', payload: false });
        return { success: true, data: response.data };
      } else {
        const errorMsg = response?.message || 'Failed to create debt reminder';
        dispatch({ type: 'SET_ERROR', payload: errorMsg });
        dispatch({ type: 'SET_LOADING', payload: false });
        return { success: false, error: errorMsg };
      }
    } catch (err) {
      console.error('Error creating debt reminder:', err);
      const errorMessage = err.response?.data?.message || 'Error creating debt reminder. Please try again later.';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      dispatch({ type: 'SET_LOADING', payload: false });
      return { success: false, error: errorMessage };
    }
  };

  const cancelDebtReminder = async (reminderId, reason) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'CLEAR_ERROR' });
    
    try {
      const response = await DebtService.cancelDebtReminder(reminderId, reason);
      
      if (response && response.status === 200) {
        // Refresh the debt reminders list
        await fetchDebtReminders();
        dispatch({ type: 'SET_LOADING', payload: false });
        return { success: true };
      } else {
        const errorMsg = response?.message || 'Failed to cancel debt reminder';
        dispatch({ type: 'SET_ERROR', payload: errorMsg });
        dispatch({ type: 'SET_LOADING', payload: false });
        return { success: false, error: errorMsg };
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Error cancelling debt reminder. Please try again later.';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      dispatch({ type: 'SET_LOADING', payload: false });
      return { success: false, error: errorMessage };
    }
  };

  const requestOtpForPayDebt = async () => {
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'CLEAR_ERROR' });
    
    try {
      const response = await DebtService.requestOtpForPayDebt();
      
      if (response && response.status === 200) {
        dispatch({ type: 'SET_LOADING', payload: false });
        return { success: true, message: response.message };
      } else {
        const errorMsg = response?.message || 'Failed to request OTP';
        dispatch({ type: 'SET_ERROR', payload: errorMsg });
        dispatch({ type: 'SET_LOADING', payload: false });
        return { success: false, error: errorMsg };
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Error requesting OTP. Please try again later.';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      dispatch({ type: 'SET_LOADING', payload: false });
      return { success: false, error: errorMessage };
    }
  };

  const payDebtReminder = async (reminderId, paymentData) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'CLEAR_ERROR' });
    
    try {
      const response = await DebtService.payDebtReminder(reminderId, paymentData);
      
      if (response && response.status === 200) {
        // Refresh the debt reminders list
        await fetchDebtReminders();
        dispatch({ type: 'SET_LOADING', payload: false });
        return { success: true, data: response.data };
      } else {
        const errorMsg = response?.message || 'Failed to pay debt';
        dispatch({ type: 'SET_ERROR', payload: errorMsg });
        dispatch({ type: 'SET_LOADING', payload: false });
        return { success: false, error: errorMsg };
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Error paying debt. Please try again later.';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      dispatch({ type: 'SET_LOADING', payload: false });
      return { success: false, error: errorMessage };
    }  };
  // Helper function to check if user has access token regardless of auth context
  // eslint-disable-next-line no-unused-vars
  const hasToken = () => {
    return !!localStorage.getItem('accessToken');
  };

  // Fetch debt reminders only when user is authenticated
  useEffect(() => {
    if (isAuthenticated && !authLoading) {
      fetchDebtReminders();
    }
  }, [isAuthenticated, authLoading]);

  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  return (
    <DebtContext.Provider
      value={{
        createdDebts: state.createdDebts,
        receivedDebts: state.receivedDebts,
        loading: state.loading,
        error: state.error,
        fetchDebtReminders,
        createDebtReminder,
        cancelDebtReminder,
        requestOtpForPayDebt,
        payDebtReminder,
        clearError
      }}
    >
      {children}
    </DebtContext.Provider>
  );
};

export default DebtContext;