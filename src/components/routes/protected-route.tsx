import { useSelector } from '@services/store';
import { getUser } from '@slices/user';
import { Navigate } from 'react-router-dom';

export const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const isAuthenticated = Boolean(useSelector(getUser));

  if (!isAuthenticated) {
    return <Navigate to='/login' replace />;
  }

  return children;
};
