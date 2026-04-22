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

const App = () => {
  const location = useLocation();

  const backgroundLocation = location.state?.backgroundLocation;

  return (
    <Layout>
      <Routes location={location}>
        {/* Публичные роуты */}
        <Route path='/' element={<ConstructorPage />} />
        <Route path='/feed' element={<Feed />} />
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
