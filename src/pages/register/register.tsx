import { FC, SyntheticEvent, useState } from 'react';
import { RegisterUI } from '@ui-pages';
import { useDispatch, useSelector } from '@services/store';
import { registerUser } from '@slices/user';
import { useLocation, useNavigate } from 'react-router-dom';
import { ROUTES } from '../../components/routes/types';

export const Register: FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { error } = useSelector((state) => state.user);
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();
    try {
      await dispatch(
        registerUser({ name: userName, email, password })
      ).unwrap();
      navigate(location.state.path ? location.state.path : ROUTES.MAIN);
    } catch (error) {}
  };

  return (
    <RegisterUI
      errorText={error || ''}
      email={email}
      userName={userName}
      password={password}
      setEmail={setEmail}
      setPassword={setPassword}
      setUserName={setUserName}
      handleSubmit={handleSubmit}
    />
  );
};
