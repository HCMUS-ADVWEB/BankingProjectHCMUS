import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { NotificationProvider } from './contexts/NotificationContext';
import { EmployeeProvider } from './contexts/employee/EmployeeContext';
import { DebtProvider } from './contexts/customer/DebtContext';
import { TransactionProvider } from './contexts/customer/TransactionContext';
import './styles/output.css';
import { RecipientProvider } from './contexts/customer/RecipientContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <ThemeProvider>
          <NotificationProvider>
            <EmployeeProvider>
              <DebtProvider>
                <TransactionProvider>
                  <RecipientProvider>
                    <App />
                  </RecipientProvider>
                </TransactionProvider>
              </DebtProvider>
            </EmployeeProvider>
          </NotificationProvider>
        </ThemeProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
);
