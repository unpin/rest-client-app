import { createContext, useContext } from 'react';
import { User } from '@firebase/auth';

export const AuthContext = createContext<AuthContextType | null>(null);
type AuthContextType = {
  user: User | null | undefined;
  loading: boolean;
  error: Error | undefined;
};
export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('Error provider');
  return ctx;
};
