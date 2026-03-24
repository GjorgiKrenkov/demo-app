import type { JSX } from 'react';
import { useNavigate } from 'react-router-dom';

import { Box, Button, Container, Typography } from '@mui/material';

const NotFoundContent = ({ onGoHome }: { readonly onGoHome: () => void }): JSX.Element => (
  <Container maxWidth="sm">
    <Box sx={{ py: 8, textAlign: 'center' }}>
      <Typography variant="h2" gutterBottom>
        404
      </Typography>
      <Typography variant="body1" color="text.secondary" gutterBottom>
        Page not found
      </Typography>
      <Button variant="contained" onClick={onGoHome}>
        Go home
      </Button>
    </Box>
  </Container>
);

export const NotFoundPage = (): JSX.Element => {
  const navigate = useNavigate();
  return (
    <NotFoundContent
      onGoHome={() => {
        void navigate('/');
      }}
    />
  );
};
