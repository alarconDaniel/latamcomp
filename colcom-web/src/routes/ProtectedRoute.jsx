import { useAuth } from '../hooks/useAuth.js';
import { navigate } from './navigation.js';

export function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) {
    setTimeout(() => navigate('/admin/login'), 0);
    return null;
  }
  return children;
}
