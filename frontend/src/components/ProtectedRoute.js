import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Loading from '../components/Loading';

export default function ProtectedRoute({ children, allowedRoles }) {
  const { state } = useAuth();

  if (state.isLoading) {
    return <Loading />;
  }

  if (!state.isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(state.user?.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
}
