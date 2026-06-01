import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children }) {
  const { ready } = useAuth();

  // TODO: Replace localStorage check with real token validation when backend is ready
  const token = localStorage.getItem('token');

  if (!ready) return null;
  if (!token) return <Navigate to="/login" replace />;
  return children;
}
