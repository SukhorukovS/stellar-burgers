import { useDispatch, useSelector } from '@services/store';
import { fetchUserOrders, getIsOrdersLoading, getOrders } from '@slices/user';
import { Preloader } from '@ui';
import { ProfileOrdersUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC, useEffect } from 'react';

export const ProfileOrders: FC = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchUserOrders());
  }, []);

  const orders: TOrder[] | null = useSelector(getOrders);

  const isLoading = useSelector(getIsOrdersLoading);

  if (isLoading || orders === null || orders.length === 0) {
    return <Preloader />;
  }

  return <ProfileOrdersUI orders={orders} />;
};
