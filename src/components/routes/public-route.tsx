import { Navigate } from 'react-router-dom';

export const PublicRoute = ({ children }: { children: JSX.Element }) => {
  // TODO: проверка авторизации из стора
  const isAuthenticated = false;

  if (isAuthenticated) {
    return <Navigate to='/' replace />;
  }

  return children;
};
