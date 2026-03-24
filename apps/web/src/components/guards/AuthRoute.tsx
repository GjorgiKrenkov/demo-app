import type { JSX } from 'react';
import { Navigate, Outlet } from 'react-router-dom';

import { Box, CircularProgress } from '@mui/material';

import { useAuth } from '../../lib/use-auth.js';

export const AuthRoute = (): JSX.Element => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <Box
        sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};
