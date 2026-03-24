import type { JSX } from 'react';

import { Typography } from '@mui/material';

import { AdminLayout } from '../../components/layout/AdminLayout.js';

export const AdminDashboardPage = (): JSX.Element => (
  <AdminLayout>
    <Typography variant="h4" gutterBottom>
      Dashboard
    </Typography>
    <Typography color="text.secondary">
      Welcome to the admin panel. More features coming soon.
    </Typography>
  </AdminLayout>
);
