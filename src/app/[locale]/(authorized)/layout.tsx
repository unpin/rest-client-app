import AuthGuard from '@/components/AuthGuard/AuthGuard';
import { PropsWithChildren } from 'react';

export default function AuthorizedLayout({ children }: PropsWithChildren) {
  return <AuthGuard>{children}</AuthGuard>;
}
