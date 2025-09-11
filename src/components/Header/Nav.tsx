'use client';

import { useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/providers/AuthProvider/AuthContext';
import AuthButton from '@/components/Buttons/AuthButton';
import { logout } from '@/firebase';

export default function Nav() {
  const { user } = useAuth();
  const router = useRouter();

  const handleSignIn = useCallback(() => {
    router.push('/auth/signin');
  }, [router]);

  const handleSignUp = useCallback(() => {
    router.push('/auth/signup');
  }, [router]);

  const handleSignOut = useCallback(async () => {
    try {
      await logout(); // важно дождаться завершения
      router.push('/');
    } catch (err) {
      console.error('Logout failed:', err);
    }
  }, [router]);

  return (
    <nav className="flex gap-4">
      {!user && <AuthButton form="signIn" onClick={handleSignIn} />}
      {!user && <AuthButton form="signUp" onClick={handleSignUp} />}
      {user && <AuthButton form="signOut" onClick={handleSignOut} />}
    </nav>
  );
}
