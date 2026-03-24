import type { JSX, ReactNode } from 'react';

import { AuthContext } from './auth-context.js';
import { trpc } from './trpc.js';

interface AuthProviderProps {
  readonly children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps): JSX.Element => {
  const { data, isLoading } = trpc.auth.me.useQuery(undefined, { retry: false });

  const user = data ?? null;
  const isAdmin = user?.role === 'admin';

  return (
    <AuthContext.Provider value={{ user, isLoading, isAdmin }}>{children}</AuthContext.Provider>
  );
};
