import { FC } from 'react';
import { useNavigate } from 'react-router-dom';
import { Modal } from '@components';
import { IngredientDetails } from '@components';

export const IngredientDetailsModal: FC = () => {
  const navigate = useNavigate();

  const handleClose = () => {
    navigate(-1);
  };

  return (
    <Modal title='Детали ингредиента' onClose={handleClose}>
      <IngredientDetails />
    </Modal>
  );
};
