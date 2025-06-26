import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { NotificationProvider } from './contexts/NotificationContext';
import { DebtProvider } from './contexts/customer/DebtContext';
import { TransactionProvider } from './contexts/customer/TransactionContext';
import { RecipientProvider } from './contexts/customer/RecipientContext';
import { EmployeeTransactionProvider } from './contexts/employee/EmployeeTransactionContext';
import { CreateAccountProvider } from './contexts/employee/CreateAccountContext';
import { DepositProvider } from './contexts/employee/DepositContext';
import './styles/output.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <ThemeProvider>
          <NotificationProvider>
            <EmployeeTransactionProvider>
              <DebtProvider>
                <TransactionProvider>
                  <RecipientProvider>
                    <CreateAccountProvider>
                      <DepositProvider>
                        <App />
                      </DepositProvider>
                    </CreateAccountProvider>
                  </RecipientProvider>
                </TransactionProvider>
              </DebtProvider>
            </EmployeeTransactionProvider>
          </NotificationProvider>
        </ThemeProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
);
