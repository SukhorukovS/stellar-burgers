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
import { fetchUser } from '@slices/user';

const App = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const didInit = useRef(false);

  const backgroundLocation = location.state?.background;

  useEffect(() => {
    if (!didInit.current) {
      dispatch(fetchIngredients());
      dispatch(fetchUser());
      didInit.current = true;
    }
  }, []);

  return (
    <Layout>
      <Routes location={backgroundLocation || location}>
        {/* Публичные роуты */}
        <Route path={ROUTES.MAIN} element={<ConstructorPage />} />
        <Route path={ROUTES.FEED} element={<Feed />} />
        <Route path={ROUTES.FEED_DETAIL} element={<OrderInfo />} />
        <Route path={ROUTES.INGREDIENT} element={<IngredientDetails />} />

        {/* Защищённые роуты (только для неавторизованных) */}
        <Route
          path={ROUTES.LOGIN}
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />
        <Route
          path={ROUTES.REGISTER}
          element={
            <PublicRoute>
              <Register />
            </PublicRoute>
          }
        />
        <Route
          path={ROUTES.FORGOT_PASSWORD}
          element={
            <PublicRoute>
              <ForgotPassword />
            </PublicRoute>
          }
        />
        <Route
          path={ROUTES.RESET_PASSWORD}
          element={
            <PublicRoute>
              <ResetPassword />
            </PublicRoute>
          }
        />

        {/* Защищённые роуты (только для авторизованных) */}
        <Route
          path={ROUTES.PROFILE}
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path={ROUTES.PROFILE_ORDERS}
          element={
            <ProtectedRoute>
              <ProfileOrders />
            </ProtectedRoute>
          }
        />
        <Route
          path={ROUTES.PROFILE_ORDER_DETAIL}
          element={
            <ProtectedRoute>
              <OrderInfo />
            </ProtectedRoute>
          }
        />

        {/* 404 */}
        <Route path='*' element={<NotFound404 />} />
      </Routes>

      {/* Модальные окна */}
      {backgroundLocation && (
        <Routes>
          <Route path={ROUTES.FEED_DETAIL} element={<OrderInfoModal />} />
          <Route
            path={ROUTES.INGREDIENT}
            element={<IngredientDetailsModal />}
          />
          <Route
            path={ROUTES.PROFILE_ORDER_DETAIL}
            element={
              <ProtectedRoute>
                <OrderInfoModal />
              </ProtectedRoute>
            }
          />
        </Routes>
      )}
    </Layout>
  );
};

export default App;
