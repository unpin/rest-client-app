'use client';

import { useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/providers/AuthProvider/AuthContext';
import AuthButton from '@/components/Buttons/AuthButton';
import { logout } from '@/firebase';
import LocaleSwitcher from '@/components/LocaleSwitcher/LocaleSwitcher';
import { routing } from '@/i18n/routing';
import { useLocale } from 'next-intl';

export default function Nav() {
  const { user } = useAuth();
  const router = useRouter();
  const locale = useLocale();
  const handleSignIn = useCallback(() => {
    router.push('/auth/signin');
  }, [router]);

  const handleSignUp = useCallback(() => {
    router.push('/auth/signup');
  }, [router]);

  const handleSignOut = useCallback(async () => {
    try {
      await logout();
      router.push('/');
    } catch (err) {
      console.error('Logout failed:', err);
    }
  }, [router]);
  const handleMainPage = useCallback(() => {
    router.push('/');
  }, [router]);

  return (
    <nav className="flex gap-4">
      {user && <AuthButton form="main" onClick={handleMainPage} />}
      {!user && <AuthButton form="signIn" onClick={handleSignIn} />}
      {!user && <AuthButton form="signUp" onClick={handleSignUp} />}
      {user && <AuthButton form="signOut" onClick={handleSignOut} />}

      <LocaleSwitcher defaultValue={locale}>
        {routing.locales.map((cur) => (
          <option key={cur} value={cur}>
            {cur}
          </option>
        ))}
      </LocaleSwitcher>
    </nav>
  );
}
