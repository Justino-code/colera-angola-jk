import { Navigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth'; // ou de contexts, depende de onde você exporta

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) return <div className="text-center py-4">Carregando...</div>;

  if (!user) return <Navigate to="/login" replace />;

  return children;
}
