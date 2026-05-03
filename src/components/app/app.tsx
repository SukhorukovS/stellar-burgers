import { ConstructorPage } from '@pages';
import {
  Login,
  Register,
  ForgotPassword,
  ResetPassword,
  Profile,
  ProfileOrders,
  Feed,
  NotFound404
} from '@pages';
import {
  Layout,
  OrderInfoModal,
  IngredientDetailsModal,
  OrderInfo,
  IngredientDetails
} from '@components';
import { Routes, Route, useLocation } from 'react-router-dom';
import { ProtectedRoute } from '../routes/protected-route';
import { PublicRoute } from '../routes/public-route';
import { useEffect, useRef } from 'react';
import { fetchIngredients } from '../../services/slices/ingredients';
import { useDispatch } from '../../services/store';
import { ROUTES } from '../routes/types';
import { fetchFeeds } from '@slices/feeds';

const App = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const didInit = useRef(false);

  const backgroundLocation = location.state?.background;

  useEffect(() => {
    if (!didInit.current) {
      dispatch(fetchIngredients());
      dispatch(fetchFeeds());
      didInit.current = true;
    }
  }, []);

  return (
    <Layout>
      <Routes location={backgroundLocation || location}>
        {/* Публичные роуты */}
        <Route path={ROUTES.MAIN} element={<ConstructorPage />} />
        <Route path={ROUTES.FEED} element={<Feed />} />
        <Route path='/feed/:number' element={<OrderInfo />} />
        <Route path='/ingredients/:id' element={<IngredientDetails />} />

        {/* Защищённые роуты (только для неавторизованных) */}
        <Route
          path='/login'
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />
        <Route
          path='/register'
          element={
            <PublicRoute>
              <Register />
            </PublicRoute>
          }
        />
        <Route
          path='/forgot-password'
          element={
            <PublicRoute>
              <ForgotPassword />
            </PublicRoute>
          }
        />
        <Route
          path='/reset-password'
          element={
            <PublicRoute>
              <ResetPassword />
            </PublicRoute>
          }
        />

        {/* Защищённые роуты (только для авторизованных) */}
        <Route
          path='/profile'
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path='/profile/orders'
          element={
            <ProtectedRoute>
              <ProfileOrders />
            </ProtectedRoute>
          }
        />
        <Route
          path='/profile/orders/:number'
          element={
            <ProtectedRoute>
              <OrderInfoModal />
            </ProtectedRoute>
          }
        />

        {/* 404 */}
        <Route path='*' element={<NotFound404 />} />
      </Routes>

      {/* Модальные окна */}
      {backgroundLocation && (
        <Routes>
          <Route path='/feed/:number' element={<OrderInfoModal />} />
          <Route path='/ingredients/:id' element={<IngredientDetailsModal />} />
        </Routes>
      )}
    </Layout>
  );
};

export default App;
