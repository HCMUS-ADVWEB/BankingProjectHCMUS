import {
  createContext,
  useContext,
  useReducer,
  useCallback,
  useEffect,
} from 'react';
import { useAuth } from '../AuthContext';
import RecipientService from '../../services/customer/RecipientService';
import CustomerService from '../../services/CustomerService';

// Reducer to handle all recipient state updates
const recipientReducer = (state, action) => {
  switch (action.type) {
    case 'SET_RECIPIENTS':
      return { ...state, recipients: action.payload };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'CLEAR_ERROR':
      return { ...state, error: null };
    case 'SET_SUCCESS':
      return { ...state, success: action.payload };
    case 'SET_FORM':
      return { ...state, form: { ...state.form, ...action.payload } };
    case 'RESET_FORM':
      return {
        ...state,
        form: {
          accountNumber: '',
          bankCode: '',
          nickName: '',
        },
        editId: null,
      };
    case 'SET_EDIT_ID':
      return { ...state, editId: action.payload };
    case 'SET_DIALOG_OPEN':
      return { ...state, dialogOpen: action.payload };
    case 'SET_BANKS':
      return { ...state, banks: action.payload };
    default:
      return state;
  }
};

// Create context
const RecipientContext = createContext();

// Custom hook to use the recipient context
export const useRecipient = () => {
  const context = useContext(RecipientContext);
  if (!context) {
    throw new Error('useRecipient must be used within a RecipientProvider');
  }
  return context;
};

// Recipient provider component
export const RecipientProvider = ({ children }) => {
  const { state: authState } = useAuth();
  // Initial state
  const initialState = {
    recipients: [],
    loading: false,
    error: null,
    success: null,
    form: {
      accountNumber: '',
      bankName: '',
      nickName: '',
      recipientName: '',
    },
    editId: null,
    dialogOpen: false,
    banks: [],
  };

  // Set up reducer
  const [state, dispatch] = useReducer(recipientReducer, initialState);

  // Fetch recipients
  const fetchRecipients = useCallback(async () => {
    if (!authState.isAuthenticated) return;

    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'CLEAR_ERROR' });

    try {
      const response = await RecipientService.getRecipients(20, 1);
      dispatch({ type: 'SET_RECIPIENTS', payload: response.data || [] });
    } catch (err) {
      dispatch({
        type: 'SET_ERROR',
        payload: err.response?.data?.message || 'Failed to fetch recipients',
      });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, [authState.isAuthenticated]);
  const addNewRecipient = useCallback(
    async (accountNumber, bankCode, nickName) => {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'CLEAR_ERROR' });

      try {
        const recipientData = {
          accountNumber,
          bankCode,
          nickName,
        };

        await RecipientService.addRecipient(recipientData);
        dispatch({
          type: 'SET_SUCCESS',
          payload: 'Recipient added successfully!',
        });
        dispatch({ type: 'RESET_FORM' });
        fetchRecipients();
        return true;
      } catch (err) {
        dispatch({
          type: 'SET_ERROR',
          payload: err.response?.data?.message || 'Failed to add recipient',
        });
        return false;
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    },
    [fetchRecipients],
  );

  // Add a new recipient
  const addRecipient = useCallback(
    async (recipientData) => {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'CLEAR_ERROR' });

      try {
        await RecipientService.addRecipient(recipientData);
        dispatch({
          type: 'SET_SUCCESS',
          payload: 'Recipient added successfully!',
        });
        dispatch({ type: 'RESET_FORM' });
        fetchRecipients();
        return true;
      } catch (err) {
        dispatch({
          type: 'SET_ERROR',
          payload: err.response?.data?.message || 'Failed to add recipient',
        });
        return false;
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    },
    [fetchRecipients],
  );

  // Update an existing recipient
  const updateRecipient = useCallback(
    async (recipientId, recipientData) => {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'CLEAR_ERROR' });

      try {
        await RecipientService.updateRecipient(recipientId, recipientData);
        dispatch({
          type: 'SET_SUCCESS',
          payload: 'Recipient updated successfully!',
        });
        dispatch({ type: 'RESET_FORM' });
        fetchRecipients();
        return true;
      } catch (err) {
        dispatch({
          type: 'SET_ERROR',
          payload: err.response?.data?.message || 'Failed to update recipient',
        });
        return false;
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    },
    [fetchRecipients],
  );

  // Delete a recipient
  const deleteRecipient = useCallback(
    async (recipientId) => {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'CLEAR_ERROR' });

      try {
        await RecipientService.deleteRecipient(recipientId);
        dispatch({
          type: 'SET_SUCCESS',
          payload: 'Recipient deleted successfully!',
        });
        fetchRecipients();
        return true;
      } catch (err) {
        dispatch({
          type: 'SET_ERROR',
          payload: err.response?.data?.message || 'Failed to delete recipient',
        });
        return false;
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    },
    [fetchRecipients],
  );

  const getAccountInfo = useCallback(async (accountNumber, bankCode) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'CLEAR_ERROR' });

    try {
      const response = await CustomerService.getAccountInfo(accountNumber, bankCode);
      const accountData = response.data || null;

      // Update recipientName in form if available
      if (accountData?.recipientName) {
        dispatch({
          type: 'SET_FORM',
          payload: { recipientName: accountData.recipientName },
        });
      }

      return accountData;
    } catch (err) {
      dispatch({
        type: 'SET_ERROR',
        payload: err.response?.data?.message || 'Failed to fetch account info',
      });
      return null;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, []);


  // Handle form change
  const handleFormChange = useCallback((e) => {
    const { name, value } = e.target;
    dispatch({ type: 'SET_FORM', payload: { [name]: value } });
  }, []);
  // Open dialog for adding/editing recipient
  const openDialog = useCallback((recipient = null) => {
    if (recipient) {
      dispatch({
        type: 'SET_FORM',
        payload: {
          accountNumber: recipient.recipientAccountNumber || '',
          bankName: recipient.bankName || '',
          nickName: recipient.nickName || '',
          recipientName: recipient.recipientName || '',
        },
      });
      dispatch({
        type: 'SET_EDIT_ID',
        payload: recipient.recipientId || recipient.id,
      });
    } else {
      dispatch({ type: 'RESET_FORM' });
    }
    dispatch({ type: 'SET_DIALOG_OPEN', payload: true });
  }, []);

  // Close dialog
  const closeDialog = useCallback(() => {
    dispatch({ type: 'SET_DIALOG_OPEN', payload: false });
    dispatch({ type: 'RESET_FORM' });
  }, []);

  // Submit form
  const submitForm = useCallback(async () => {
    const { form, editId } = state;

    let result;
    if (editId) {
      result = await updateRecipient(editId, form);
    } else {
      result = await addRecipient(form);
    }

    if (result) {
      closeDialog();
    }

    return result;
  }, [state.form, state.editId, addRecipient, updateRecipient, closeDialog]);

  const fetchBanks = useCallback(async () => {
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'CLEAR_ERROR' });

    try {
      const response = await CustomerService.getBanks(); // assuming this is your API call
      dispatch({ type: 'SET_BANKS', payload: response.data || [] });
    } catch (err) {
      dispatch({
        type: 'SET_ERROR',
        payload: err.response?.data?.message || 'Failed to fetch banks',
      });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, []);



  // Fetch recipients when auth state changes
  useEffect(() => {
    if (authState.isAuthenticated) {
      fetchRecipients();
    }
  }, [fetchRecipients, authState.isAuthenticated]);
  // Context value
  const value = {
    // State
    recipients: state.recipients,
    loading: state.loading,
    error: state.error,
    success: state.success,
    form: state.form,
    editId: state.editId,
    dialogOpen: state.dialogOpen,
    banks: state.banks,

    // Methods
    fetchRecipients,
    addRecipient,
    addNewRecipient,
    updateRecipient,
    deleteRecipient,
    handleFormChange,
    openDialog,
    closeDialog,
    submitForm,
    fetchBanks,
    getAccountInfo,
  };

  return (
    <RecipientContext.Provider value={value}>
      {children}
    </RecipientContext.Provider>
  );
};
