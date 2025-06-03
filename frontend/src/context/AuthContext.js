import React, { createContext, useReducer } from 'react';
import { useNavigate } from 'react-router-dom';

export const AuthContext = createContext();

const authReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN':
      return { isAuthenticated: true, user: action.payload };
    case 'LOGOUT':
      return { isAuthenticated: false, user: null };
    default:
      return state;
  }
};

export const AuthProvider = ({ children }) => {
  const [authState, dispatch] = useReducer(authReducer, {
    isAuthenticated: false,
    user: null,
  });

  const navigate = useNavigate();

  const login = (user) => {
    dispatch({ type: 'LOGIN', payload: user });
    // Redirect based on role
    if (user.role === 'customer') {
      navigate('/');
    } else if (user.role === 'admin') {
      navigate('/admin');
    } else if (user.role === 'employee') {
      navigate('/employee');
    }
  };

  const logout = () => {
    dispatch({ type: 'LOGOUT' });
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{ authState, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};