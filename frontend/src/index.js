import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { EmployeeProvider } from './contexts/EmployeeContext';
import './styles/output.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <EmployeeProvider>
          <ThemeProvider>
            <App />
          </ThemeProvider>
        </EmployeeProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
);
