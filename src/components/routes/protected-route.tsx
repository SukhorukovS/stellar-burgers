import { Navigate } from 'react-router-dom';

export const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  // TODO: проверка авторизации из стора
  const isAuthenticated = false;

  if (!isAuthenticated) {
    return <Navigate to='/login' replace />;
  }

  return children;
};
