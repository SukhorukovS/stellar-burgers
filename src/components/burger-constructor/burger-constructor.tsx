import { FC, useMemo } from 'react';
import { TConstructorIngredient } from '@utils-types';
import { BurgerConstructorUI } from '@ui';
import { useSelector } from '@services/store';
import { getConstructorItems } from '@slices/burger-constructor';
import { getUser } from '@slices/user';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../routes/types';

export const BurgerConstructor: FC = () => {
  const navigate = useNavigate();
  const constructorItems = useSelector(getConstructorItems);
  const user = useSelector(getUser);

  const orderRequest = false;

  const orderModalData = null;

  const onOrderClick = () => {
    if (!user) navigate(ROUTES.LOGIN);
    if (!constructorItems.bun || orderRequest) return;
  };
  const closeOrderModal = () => {};

  const price = useMemo(
    () =>
      (constructorItems.bun ? constructorItems.bun.price * 2 : 0) +
      constructorItems.ingredients.reduce(
        (s: number, v: TConstructorIngredient) => s + v.price,
        0
      ),
    [constructorItems]
  );

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={constructorItems}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};
