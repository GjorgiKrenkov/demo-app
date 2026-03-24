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

interface RegisterFormReturn {
  name: string;
  setName: Dispatch<SetStateAction<string>>;
  email: string;
  setEmail: Dispatch<SetStateAction<string>>;
  password: string;
  setPassword: Dispatch<SetStateAction<string>>;
  error: { message: string } | null;
  isPending: boolean;
  handleSubmit: (e: React.SyntheticEvent<HTMLFormElement>) => void;
}

const useRegisterForm = (): RegisterFormReturn => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { mutate, isPending, error } = trpc.auth.register.useMutation({
    onSuccess: () => {
      void navigate('/');
    },
  });
  const handleSubmit = (e: React.SyntheticEvent<HTMLFormElement>): void => {
    e.preventDefault();
    mutate({ name, email, password });
  };
  return { name, setName, email, setEmail, password, setPassword, error, isPending, handleSubmit };
};

interface RegisterFieldsProps {
  readonly form: RegisterFormReturn;
}

const RegisterNameField = ({ form }: RegisterFieldsProps): JSX.Element => (
  <TextField
    label="Name"
    value={form.name}
    onChange={(e) => {
      form.setName(e.target.value);
    }}
    required
    fullWidth
    autoComplete="name"
  />
);

const RegisterEmailField = ({ form }: RegisterFieldsProps): JSX.Element => (
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

const RegisterPasswordField = ({ form }: RegisterFieldsProps): JSX.Element => (
  <TextField
    label="Password"
    type="password"
    value={form.password}
    onChange={(e) => {
      form.setPassword(e.target.value);
    }}
    required
    fullWidth
    slotProps={{ htmlInput: { minLength: 8 } }}
    autoComplete="new-password"
  />
);

const RegisterFields = ({ form }: RegisterFieldsProps): JSX.Element => (
  <>
    <RegisterNameField form={form} />
    <RegisterEmailField form={form} />
    <RegisterPasswordField form={form} />
  </>
);

const RegisterForm = ({ form }: RegisterFieldsProps): JSX.Element => (
  <Box component="form" onSubmit={form.handleSubmit} sx={formBoxSx}>
    <RegisterFields form={form} />
    <Button type="submit" variant="contained" fullWidth disabled={form.isPending} sx={{ mt: 1 }}>
      {form.isPending ? 'Creating account…' : 'Create account'}
    </Button>
  </Box>
);

const RegisterPageBody = ({ form }: RegisterFieldsProps): JSX.Element => (
  <Box sx={pageBoxSx}>
    <Typography variant="h4" component="h1">
      Create account
    </Typography>
    {form.error && (
      <Alert severity="error" sx={alertSx}>
        {form.error.message}
      </Alert>
    )}
    <RegisterForm form={form} />
    <Typography variant="body2" color="text.secondary">
      Already have an account?{' '}
      <Link component={RouterLink} to="/login">
        Sign in
      </Link>
    </Typography>
  </Box>
);

export const RegisterPage = (): JSX.Element => {
  const form = useRegisterForm();
  return (
    <Container maxWidth="xs">
      <RegisterPageBody form={form} />
    </Container>
  );
};
