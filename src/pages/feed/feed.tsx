import { useDispatch, useSelector } from '@services/store';
import { fetchFeeds, getOrders } from '@slices/feeds';
import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC } from 'react';

export const Feed: FC = () => {
  const dispatch = useDispatch();
  const orders = useSelector(getOrders);

  const handleGetFeeds = () => {
    dispatch(fetchFeeds());
  };

  if (!orders || !orders.length) {
    return <Preloader />;
  }

  return <FeedUI orders={orders} handleGetFeeds={handleGetFeeds} />;
};
