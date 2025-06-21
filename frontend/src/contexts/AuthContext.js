import { createContext, useContext, useReducer, useEffect } from 'react';
import axios from 'axios';
import api from '../utils/api';
import { BASE_URL } from '../utils/constants';

const authReducer = (state, action) => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'LOGIN_START':
      return { ...state, authError: null, isLoading: true };
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        authError: null,
        isLoading: false,
      };
    case 'LOGIN_FAILURE':
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        authError: action.payload,
        isLoading: false,
      };
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        authError: null,
        isLoading: false,
      };
    case 'CLEAR_ERROR':
      return { ...state, authError: null };
    case 'UPDATE_PROFILE':
      return { ...state, user: action.payload };
    default:
      return state;
  }
};

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, {
    user: null,
    isAuthenticated: false,
    authError: null,
    isLoading: true, // Initialize with loading true
  });

  useEffect(() => {
    const checkAuth = async () => {
      dispatch({ type: 'SET_LOADING', payload: true });
      const accessToken = localStorage.getItem('accessToken');
      const userData = localStorage.getItem('user');

      if (accessToken && userData) {
        try {
          const user = JSON.parse(userData);
          dispatch({ type: 'LOGIN_SUCCESS', payload: user });
        } catch (error) {
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          localStorage.removeItem('user');
          dispatch({ type: 'LOGIN_FAILURE', payload: 'Invalid user data' });
        }
      } else {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    };

    checkAuth();
  }, []);

  const login = async (username, password, recaptcha) => {
    dispatch({ type: 'LOGIN_START' });

    try {
      const response = await axios.post(`${BASE_URL}/api/auth/login`, {
        username,
        password,
        token: recaptcha,
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const { status, message, data, timestamp } = response.data;
      const accessToken = data?.accessToken || '';
      const refreshToken = data?.refreshToken || '';
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      console.log(`Success: ${message} at ${timestamp} (Status: ${status})`);
    } catch (error) {
      if (error.response) {
        const status = error.response.status;
        const msg = error.response.data?.message;
        const timestamp = error.response.data?.timestamp || new Date().toISOString();
        console.error(`Error ${status}: ${msg} at ${timestamp}`);
        dispatch({
          type: 'LOGIN_FAILURE',
          payload: msg || 'Login failed',
        });
      } else if (error.request) {
        console.error('Network error or no response from server:', error.request);
        dispatch({
          type: 'LOGIN_FAILURE',
          payload: 'Network error or no response from server',
        });
      } else {
        console.error('Unexpected error:', error.message);
        dispatch({
          type: 'LOGIN_FAILURE',
          payload: 'Unexpected error occurred',
        });
      }
      return;
    }

    try {
      const response = await api.get('/api/users/me');
      const { status, message, data, timestamp } = response.data;
      const user = {
        ...data,
        role: data?.role?.toLowerCase(),
      };
      localStorage.setItem('user', JSON.stringify(user));
      dispatch({ type: 'LOGIN_SUCCESS', payload: user });
      console.log(`Success: ${message} at ${timestamp} (Status: ${status})`);
    } catch (error) {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      if (error.response) {
        const status = error.response.status;
        const msg = error.response.data?.message;
        const timestamp = error.response.data?.timestamp || new Date().toISOString();
        console.error(`Error ${status}: ${msg} at ${timestamp}`);
        dispatch({
          type: 'LOGIN_FAILURE',
          payload: msg || 'Login failed',
        });
      } else if (error.request) {
        console.error('Network error or no response from server:', error.request);
        dispatch({
          type: 'LOGIN_FAILURE',
          payload: 'Network error or no response from server',
        });
      } else {
        console.error('Unexpected error:', error.message);
        dispatch({
          type: 'LOGIN_FAILURE',
          payload: 'Unexpected error occurred',
        });
      }
      return;
    }
    clearError();
  };

  const logout = async () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    dispatch({ type: 'LOGOUT' });
  };

  const updateProfile = async (profileData) => {
    const updatedUser = { ...state.user, ...profileData };
    localStorage.setItem('user', JSON.stringify(updatedUser));
    dispatch({ type: 'UPDATE_PROFILE', payload: updatedUser });
  };

  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  return (
    <AuthContext.Provider
      value={{
        state,
        login,
        logout,
        clearError,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
