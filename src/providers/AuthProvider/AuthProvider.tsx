'use client';

import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '@/firebase';
import { AuthContext } from '@/providers/AuthProvider/AuthContext';
import { PropsWithChildren } from 'react';

export function AuthProvider({ children }: PropsWithChildren) {
  const [user, loading, error] = useAuthState(auth);

  return <AuthContext value={{ user, loading, error }}>{children}</AuthContext>;
}
