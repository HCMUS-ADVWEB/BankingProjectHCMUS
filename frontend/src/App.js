import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import NotFound from './components/NotFound';
// Home page
import HomePage from './pages/Home';
// Auth pages
import Login from './pages/auth/Login';
import ForgotPassword from './pages/auth/ForgotPassword';
// Customer pages
import CustomerDashboard from './pages/customer/Dashboard';
import CustomerAccounts from './pages/customer/Accounts';
import CustomerRecipients from './pages/customer/Recipients';
import CustomerTransfer from './pages/customer/Transfer';
import CustomerDebts from './pages/customer/Debts';
import CustomerTransactions from './pages/customer/Transactions';
import CustomerChangePassword from './pages/customer/ChangePassword';
import CustomerTemplate from './pages/customer/Template';
// Employee pages
import EmployeeDashboard from './pages/employee/Dashboard';
import EmployeeAccounts from './pages/employee/Accounts';
import EmployeeDeposit from './pages/employee/Deposit';
import EmployeeTransactions from './pages/employee/Transactions';
import EmployeeTemplate from './pages/employee/Template';
// Admin pages
import AdminDashboard from './pages/admin/Dashboard';
import AdminEmployees from './pages/admin/Employees';
import AdminTransactions from './pages/admin/Transactions';
import AdminTemplate from './pages/admin/Template';

export default function App() {  return (

        <div className="App">
          <Routes>
          {/* Public routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/auth/login" element={<Login />} />
          <Route path="/auth/forgot-password" element={<ForgotPassword />} />

          {/* Customer routes */}
          <>
            <Route
              path="/customer/template"
              element={
                <ProtectedRoute allowedRoles={['customer']}>
                  <CustomerTemplate />
                </ProtectedRoute>
              }
            />
            <Route
              path="/customer/dashboard"
              element={
                <ProtectedRoute allowedRoles={['customer']}>
                  <CustomerDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/customer/accounts"
              element={
                <ProtectedRoute allowedRoles={['customer']}>
                  <CustomerAccounts />
                </ProtectedRoute>
              }
            />
            <Route
              path="/customer/recipients"
              element={
                <ProtectedRoute allowedRoles={['customer']}>
                  <CustomerRecipients />
                </ProtectedRoute>
              }
            />
            <Route
              path="/customer/transfer"
              element={
                <ProtectedRoute allowedRoles={['customer']}>
                  <CustomerTransfer />
                </ProtectedRoute>
              }
            />
            <Route
              path="/customer/debts"
              element={
                <ProtectedRoute allowedRoles={['customer']}>
                  <CustomerDebts />
                </ProtectedRoute>
              }
            />
            <Route
              path="/customer/transactions"
              element={
                <ProtectedRoute allowedRoles={['customer']}>
                  <CustomerTransactions />
                </ProtectedRoute>
              }
            />
            <Route
              path="/customer/change-password"
              element={
                <ProtectedRoute allowedRoles={['customer']}>
                  <CustomerChangePassword />
                </ProtectedRoute>
              }
            />
          </>

          {/* Employee routes */}
          <>
            <Route
              path="/employee/template"
              element={
                <ProtectedRoute allowedRoles={['employee']}>
                  <EmployeeTemplate />
                </ProtectedRoute>
              }
            />
            <Route
              path="/employee/dashboard"
              element={
                <ProtectedRoute allowedRoles={['employee']}>
                  <EmployeeDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/employee/accounts"
              element={
                <ProtectedRoute allowedRoles={['employee']}>
                  <EmployeeAccounts />
                </ProtectedRoute>
              }
            />
            <Route
              path="/employee/deposit"
              element={
                <ProtectedRoute allowedRoles={['employee']}>
                  <EmployeeDeposit />
                </ProtectedRoute>
              }
            />
            <Route
              path="/employee/transactions"
              element={
                <ProtectedRoute allowedRoles={['employee']}>
                  <EmployeeTransactions />
                </ProtectedRoute>
              }
            />
          </>

          {/* Admin routes */}
          <>
            <Route
              path="/admin/template"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminTemplate />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/dashboard"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/employees"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminEmployees />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/transactions"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminTransactions />
                </ProtectedRoute>
              }
            />
          </>

          {/* 404 */}
          <Route path="*" element={<NotFound />} />        </Routes>
      </div>

  );
}
