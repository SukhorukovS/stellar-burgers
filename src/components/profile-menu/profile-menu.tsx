import { FC, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ProfileMenuUI } from '@ui';
import { useDispatch, useSelector } from '@services/store';
import { getUser, logoutUser } from '@slices/user';
import { ROUTES } from '../routes/types';

export const ProfileMenu: FC = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = async () => {
    dispatch(logoutUser());
    navigate(ROUTES.LOGIN);
  };

  return <ProfileMenuUI handleLogout={handleLogout} pathname={pathname} />;
};
