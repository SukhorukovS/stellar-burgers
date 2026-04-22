import { FC } from 'react';
import { useNavigate } from 'react-router-dom';
import { Modal } from '@components';
import { OrderInfo } from '@components';

export const OrderInfoModal: FC = () => {
  const navigate = useNavigate();

  const handleClose = () => {
    navigate(-1);
  };

  return (
    <Modal title='Детали заказа' onClose={handleClose}>
      <OrderInfo />
    </Modal>
  );
};
