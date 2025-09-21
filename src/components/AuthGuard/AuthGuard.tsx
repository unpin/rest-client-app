'use client';

import { useAuth } from '@/providers/AuthProvider/AuthContext';
import { useRouter } from '@/i18n/navigation';
import { PropsWithChildren, useEffect } from 'react';

export default function AuthGuard({ children }: PropsWithChildren) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) {
      return;
    }

    if (!user) {
      router.replace('/auth/signin');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-gray-900">
        <p className="text-white">Loading...</p>
      </div>
    );
  }

  if (user) {
    return <>{children}</>;
  }

  return null;
}
