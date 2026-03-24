import type { JSX, ReactNode } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';

import { AppBar, Box, Button, Container, Toolbar, Typography } from '@mui/material';

import { trpc } from '../../lib/trpc.js';
import { useAuth } from '../../lib/use-auth.js';

const useLogout = (): { mutate: () => void } => {
  const navigate = useNavigate();
  const utils = trpc.useUtils();
  const { mutate } = trpc.auth.logout.useMutation({
    onSuccess: async () => {
      await utils.auth.me.invalidate();
      void navigate('/login');
    },
  });
  return { mutate };
};

const AdminAppBar = (): JSX.Element => {
  const { user } = useAuth();
  const logout = useLogout();
  return (
    <AppBar position="static" color="default" elevation={1}>
      <Toolbar sx={{ gap: 2 }}>
        <Typography
          variant="h6"
          component={RouterLink}
          to="/admin"
          sx={{ textDecoration: 'none', color: 'primary.main', flexGrow: 1 }}
        >
          Admin
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {user?.email}
        </Typography>
        <Button
          variant="outlined"
          size="small"
          onClick={() => {
            logout.mutate();
          }}
        >
          Logout
        </Button>
      </Toolbar>
    </AppBar>
  );
};

interface AdminLayoutProps {
  readonly children: ReactNode;
}

export const AdminLayout = ({ children }: AdminLayoutProps): JSX.Element => (
  <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
    <AdminAppBar />
    <Container maxWidth="lg" sx={{ py: 4, flexGrow: 1 }}>
      {children}
    </Container>
  </Box>
);
