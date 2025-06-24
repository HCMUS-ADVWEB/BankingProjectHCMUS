import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../utils/api';
import { useAuth } from './AuthContext';

const DebtContext = createContext();

export const useDebt = () => useContext(DebtContext);

export const DebtProvider = ({ children }) => {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [createdDebts, setCreatedDebts] = useState([]);
  const [receivedDebts, setReceivedDebts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);  const fetchDebtReminders = async (status = null, limit = 10, page = 1) => {
    
    setLoading(true);
    setError(null);
    
    try {
      const queryParams = new URLSearchParams();
      if (status) queryParams.append('status', status);
      queryParams.append('limit', limit);
      queryParams.append('page', page);
      
      const url = `/api/debts/lists?${queryParams.toString()}`;
      
      const response = await api.get(url);
      
      if (response.data && response.data.status === 200) {
        const createdDebtsData = response.data.data.createdDebts || [];
        const receivedDebtsData = response.data.data.receivedDebts || [];
        setCreatedDebts(createdDebtsData);
        setReceivedDebts(receivedDebtsData);
      } else {
        const errorMsg = response.data.message || 'Failed to fetch debt reminders';
        setError(errorMsg);
      }
    } catch (err) {
      console.error('Error fetching debt reminders:', err);
    } finally {
      setLoading(false);
    }
  };

  const createDebtReminder = async (debtData) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await api.post('/api/debts/reminders', debtData);
      
      if (response.data && response.data.status === 200) {
        // Refresh the debt reminders list
        await fetchDebtReminders();
        return { success: true, data: response.data.data };
      } else {
        setError(response.data.message || 'Failed to create debt reminder');
        return { success: false, error: response.data.message };
      }
    } catch (err) {
      console.error('Error creating debt reminder:', err);
      const errorMessage = err.response?.data?.message || 'Error creating debt reminder. Please try again later.';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const cancelDebtReminder = async (reminderId, reason) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await api.delete(`/api/debts/${reminderId}`, {
        data: { cancelledReason: reason }
      });
      
      if (response.data && response.data.status === 200) {
        // Refresh the debt reminders list
        await fetchDebtReminders();
        return { success: true };
      } else {
        setError(response.data.message || 'Failed to cancel debt reminder');
        return { success: false, error: response.data.message };
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Error cancelling debt reminder. Please try again later.';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const requestOtpForPayDebt = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await api.post('/api/debts/request-otp');
      
      if (response.data && response.data.status === 200) {
        return { success: true, message: response.data.message };
      } else {
        setError(response.data.message || 'Failed to request OTP');
        return { success: false, error: response.data.message };
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Error requesting OTP. Please try again later.';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const payDebtReminder = async (reminderId, paymentData) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await api.post(`/api/debts/${reminderId}/pay`, paymentData);
      
      if (response.data && response.data.status === 200) {
        // Refresh the debt reminders list
        await fetchDebtReminders();
        return { success: true, data: response.data.data };
      } else {
        setError(response.data.message || 'Failed to pay debt');
        return { success: false, error: response.data.message };
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Error paying debt. Please try again later.';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };  // Helper function to check if user has access token regardless of auth context
  const hasToken = () => {
    return !!localStorage.getItem('accessToken');
  };  // Fetch debt reminders on component mount or when auth state changes
  useEffect(() => {
    fetchDebtReminders();
  }, [isAuthenticated, authLoading]);

  const value = {
    createdDebts,
    receivedDebts,
    loading,
    error,
    fetchDebtReminders,
    createDebtReminder,
    cancelDebtReminder,
    requestOtpForPayDebt,
    payDebtReminder
  };

  return (
    <DebtContext.Provider value={value}>
      {children}
    </DebtContext.Provider>
  );
};

export default DebtContext;