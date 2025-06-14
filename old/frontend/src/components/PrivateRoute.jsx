import { Navigate, Outlet } from 'react-router-dom';

export default function PrivateRoute() {
  const isAuthenticated = !!localStorage.getItem('access_token');
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
}
