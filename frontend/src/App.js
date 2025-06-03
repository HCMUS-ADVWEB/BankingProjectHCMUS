import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';
import { BankingProvider } from './context/BankingContext';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Login from './pages/auth/Login';
import ForgotPassword from './pages/auth/ForgotPassword';
import ChangePassword from './pages/auth/ChangePassword';
import CustomerDashboard from './pages/customer/Dashboard';
import Recipients from './pages/customer/Recipients';
import Transfer from './pages/customer/Transfer';
import Debt from './pages/customer/Debt';
import Transactions from './pages/customer/Transactions';
import AdminDashboard from './pages/admin/AdminDashboard';
import EmployeeDashboard from './pages/employee/EmployeeDashboard';
import './index.css';

// Protected Route Component
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { authState } = React.useContext(AuthContext);
  if (!authState.isAuthenticated) {
    return <Navigate to="/login" />;
  }
  if (allowedRoles && !allowedRoles.includes(authState.user.role)) {
    return <Navigate to="/login" />;
  }
  return children;
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <BankingProvider>
          <div className="app-container">
            <Navbar />
            <div className="main-content">
              <Sidebar />
              <div className="content">
                <Routes>
                  <Route path="/login" element={<Login />} />
                  <Route path="/forgot-password" element={<ForgotPassword />} />
                  <Route
                    path="/change-password"
                    element={
                      <ProtectedRoute allowedRoles={['customer', 'admin', 'employee']}>
                        <ChangePassword />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/"
                    element={
                      <ProtectedRoute allowedRoles={['customer']}>
                        <CustomerDashboard />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/recipients"
                    element={
                      <ProtectedRoute allowedRoles={['customer']}>
                        <Recipients />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/transfer"
                    element={
                      <ProtectedRoute allowedRoles={['customer']}>
                        <Transfer />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/debt"
                    element={
                      <ProtectedRoute allowedRoles={['customer']}>
                        <Debt />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/transactions"
                    element={
                      <ProtectedRoute allowedRoles={['customer']}>
                        <Transactions />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/admin"
                    element={
                      <ProtectedRoute allowedRoles={['admin']}>
                        <AdminDashboard />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/employee"
                    element={
                      <ProtectedRoute allowedRoles={['employee']}>
                        <EmployeeDashboard />
                      </ProtectedRoute>
                    }
                  />
                  <Route path="*" element={<Navigate to="/login" />} />
                </Routes>
              </div>
            </div>
          </div>
        </BankingProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;