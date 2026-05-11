import { useSelector } from '@services/store';
import { getIsInitialState, getIsLoading, getUser } from '@slices/user';
import { Preloader } from '@ui';
import { Navigate, useLocation } from 'react-router-dom';
import { getCookie } from '../../utils/cookie';
import { ROUTES } from './types';
import path from 'path';

export const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const location = useLocation();
  const isLoading = useSelector(getIsLoading);
  const isInitialState = useSelector(getIsInitialState);
  const isAuthenticated = Boolean(useSelector(getUser));

  const token = getCookie('accessToken');

  if (isLoading || isInitialState) {
    return <Preloader />;
  }

  if (!token || !isAuthenticated) {
    console.log(location);
    return (
      <Navigate to={ROUTES.LOGIN} replace state={{ path: location.pathname }} />
    );
  }

  return children;
};
