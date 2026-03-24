import { createContext } from 'react';

export interface SessionUser {
  id: string;
  email: string;
  name: string;
  role: string;
}

export interface AuthContextValue {
  user: SessionUser | null;
  isLoading: boolean;
  isAdmin: boolean;
}

export const AuthContext = createContext<AuthContextValue | null>(null);
