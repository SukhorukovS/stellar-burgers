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
import styles from './app.module.css';

import { AppHeader } from '@components';
import { Routes, Route } from 'react-router-dom';
import { ProtectedRoute } from '../routes/protected-route';
import { PublicRoute } from '../routes/public-route';

const App = () => (
  <div className={styles.app}>
    <AppHeader />
    <Routes>
      {/* Публичные роуты */}
      <Route path='/' element={<ConstructorPage />} />
      <Route path='/feed' element={<Feed />} />

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

      {/* 404 */}
      <Route path='*' element={<NotFound404 />} />
    </Routes>
  </div>
);

export default App;
