import { Typography, Container, Box, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export const NotFoundPage = () => {
  const navigate = useNavigate();
  return (
    <Container maxWidth="sm">
      <Box sx={{ py: 8, textAlign: 'center' }}>
        <Typography variant="h2" gutterBottom>404</Typography>
        <Typography variant="body1" color="text.secondary" gutterBottom>
          Page not found
        </Typography>
        <Button variant="contained" onClick={() => navigate('/')}>Go home</Button>
      </Box>
    </Container>
  );
};
