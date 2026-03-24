import { type Dispatch, type JSX, type SetStateAction, useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';

import { Alert, Box, Button, Container, Link, TextField, Typography } from '@mui/material';

import { trpc } from '../../lib/trpc.js';

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

const RegisterFields = ({
  name,
  setName,
  email,
  setEmail,
  password,
  setPassword,
}: Pick<
  RegisterFormReturn,
  'name' | 'setName' | 'email' | 'setEmail' | 'password' | 'setPassword'
>): JSX.Element => (
  <>
    <TextField
      label="Name"
      value={name}
      onChange={(e) => {
        setName(e.target.value);
      }}
      required
      fullWidth
      autoComplete="name"
    />
    <TextField
      label="Email"
      type="email"
      value={email}
      onChange={(e) => {
        setEmail(e.target.value);
      }}
      required
      fullWidth
      autoComplete="email"
    />
    <TextField
      label="Password"
      type="password"
      value={password}
      onChange={(e) => {
        setPassword(e.target.value);
      }}
      required
      fullWidth
      slotProps={{ htmlInput: { minLength: 8 } }}
      autoComplete="new-password"
    />
  </>
);

export const RegisterPage = (): JSX.Element => {
  const { name, setName, email, setEmail, password, setPassword, error, isPending, handleSubmit } =
    useRegisterForm();
  return (
    <Container maxWidth="xs">
      <Box sx={{ mt: 12, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
        <Typography variant="h4" component="h1">
          Create account
        </Typography>
        {error && (
          <Alert severity="error" sx={{ width: '100%' }}>
            {error.message}
          </Alert>
        )}
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 2 }}
        >
          <RegisterFields
            name={name}
            setName={setName}
            email={email}
            setEmail={setEmail}
            password={password}
            setPassword={setPassword}
          />
          <Button type="submit" variant="contained" fullWidth disabled={isPending} sx={{ mt: 1 }}>
            {isPending ? 'Creating account…' : 'Create account'}
          </Button>
        </Box>
        <Typography variant="body2" color="text.secondary">
          Already have an account?{' '}
          <Link component={RouterLink} to="/login">
            Sign in
          </Link>
        </Typography>
      </Box>
    </Container>
  );
};
