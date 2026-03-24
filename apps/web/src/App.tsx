import type { JSX } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import { AppThemeProvider } from '@demo-app/ui';

import { TrpcProvider } from './lib/query-provider.js';
import { HomePage } from './pages/home/HomePage.js';
import { NotFoundPage } from './pages/not-found/NotFoundPage.js';

export const App = (): JSX.Element => (
  <AppThemeProvider defaultMode="dark">
    <TrpcProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </BrowserRouter>
    </TrpcProvider>
  </AppThemeProvider>
);
