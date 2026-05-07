import { useSelector } from '@services/store';
import { getIsInitialState, getIsLoading, getUser } from '@slices/user';
import { Preloader } from '@ui';
import { Navigate } from 'react-router-dom';

export const PublicRoute = ({ children }: { children: JSX.Element }) => {
  const isLoading = useSelector(getIsLoading);
  const isInitialState = useSelector(getIsInitialState);
  const isAuthenticated = Boolean(useSelector(getUser));

  if (isLoading || isInitialState) {
    return <Preloader />;
  }

  if (isAuthenticated) {
    return <Navigate to='/' replace />;
  }

  return children;
};
