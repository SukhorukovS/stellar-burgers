import { useSelector } from '@services/store';
import { getIsInitialState, getIsLoading, getUser } from '@slices/user';
import { Preloader } from '@ui';
import { Navigate } from 'react-router-dom';
import { getCookie } from '../../utils/cookie';

export const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const isLoading = useSelector(getIsLoading);
  const isInitialState = useSelector(getIsInitialState);
  const isAuthenticated = Boolean(useSelector(getUser));

  const token = getCookie('accessToken');

  if (isLoading || isInitialState) {
    return <Preloader />;
  }

  if (!token || !isAuthenticated) {
    return <Navigate to='/login' replace />;
  }

  return children;
};
