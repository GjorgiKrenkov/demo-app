import { type Dispatch, type JSX, type SetStateAction, useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';

import { Alert, Box, Button, Container, Link, TextField, Typography } from '@mui/material';

import { trpc } from '../../lib/trpc.js';

const pageBoxSx = {
  mt: 12,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: 3,
} as const;
const formBoxSx = { width: '100%', display: 'flex', flexDirection: 'column', gap: 2 } as const;
const alertSx = { width: '100%' } as const;

interface LoginFormReturn {
  email: string;
  setEmail: Dispatch<SetStateAction<string>>;
  password: string;
  setPassword: Dispatch<SetStateAction<string>>;
  error: { message: string } | null;
  isPending: boolean;
  handleSubmit: (e: React.SyntheticEvent<HTMLFormElement>) => void;
}

const useLoginForm = (): LoginFormReturn => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { mutate, isPending, error } = trpc.auth.login.useMutation({
    onSuccess: () => {
      void navigate('/admin');
    },
  });
  const handleSubmit = (e: React.SyntheticEvent<HTMLFormElement>): void => {
    e.preventDefault();
    mutate({ email, password });
  };
  return { email, setEmail, password, setPassword, error, isPending, handleSubmit };
};

interface LoginFieldsProps {
  readonly form: LoginFormReturn;
}

const LoginEmailField = ({ form }: LoginFieldsProps): JSX.Element => (
  <TextField
    label="Email"
    type="email"
    value={form.email}
    onChange={(e) => {
      form.setEmail(e.target.value);
    }}
    required
    fullWidth
    autoComplete="email"
  />
);

const LoginPasswordField = ({ form }: LoginFieldsProps): JSX.Element => (
  <TextField
    label="Password"
    type="password"
    value={form.password}
    onChange={(e) => {
      form.setPassword(e.target.value);
    }}
    required
    fullWidth
    autoComplete="current-password"
  />
);

const LoginForm = ({ form }: LoginFieldsProps): JSX.Element => (
  <Box component="form" onSubmit={form.handleSubmit} sx={formBoxSx}>
    <LoginEmailField form={form} />
    <LoginPasswordField form={form} />
    <Button type="submit" variant="contained" fullWidth disabled={form.isPending} sx={{ mt: 1 }}>
      {form.isPending ? 'Signing in…' : 'Sign in'}
    </Button>
  </Box>
);

const LoginPageBody = ({ form }: LoginFieldsProps): JSX.Element => (
  <Box sx={pageBoxSx}>
    <Typography variant="h4" component="h1">
      Sign in
    </Typography>
    {form.error && (
      <Alert severity="error" sx={alertSx}>
        {form.error.message}
      </Alert>
    )}
    <LoginForm form={form} />
    <Typography variant="body2" color="text.secondary">
      No account?{' '}
      <Link component={RouterLink} to="/register">
        Register
      </Link>
    </Typography>
  </Box>
);

export const LoginPage = (): JSX.Element => {
  const form = useLoginForm();
  return (
    <Container maxWidth="xs">
      <LoginPageBody form={form} />
    </Container>
  );
};
