import { Typography, Container, Box } from '@mui/material';

export const HomePage = () => (
  <Container maxWidth="lg">
    <Box sx={{ py: 8, textAlign: 'center' }}>
      <Typography variant="h1" gutterBottom>
        Welcome to <Box component="span" sx={{ color: 'primary.main' }}>demo-app</Box>
      </Typography>
      <Typography variant="body1" color="text.secondary">
        Full-stack monorepo with tRPC + Drizzle + MUI gold theme
      </Typography>
    </Box>
  </Container>
);
