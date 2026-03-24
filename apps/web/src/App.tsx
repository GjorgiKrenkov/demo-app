import type { JSX } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import { AppThemeProvider } from '@demo-app/ui';

import { AdminRoute } from './components/guards/AdminRoute.js';
import { AuthProvider } from './lib/AuthProvider.js';
import { TrpcProvider } from './lib/query-provider.js';
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage.js';
import { HomePage } from './pages/home/HomePage.js';
import { LoginPage } from './pages/login/LoginPage.js';
import { NotFoundPage } from './pages/not-found/NotFoundPage.js';
import { RegisterPage } from './pages/register/RegisterPage.js';

export const App = (): JSX.Element => (
  <AppThemeProvider defaultMode="dark">
    <TrpcProvider>
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route element={<AdminRoute />}>
              <Route path="/admin" element={<AdminDashboardPage />} />
            </Route>
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TrpcProvider>
  </AppThemeProvider>
);
