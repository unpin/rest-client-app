'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { useAuth } from '@/providers/AuthProvider/AuthContext';

export default function AuthBlock() {
  const t = useTranslations();
  const { user, loading } = useAuth();

  if (loading) return <p>Loading...</p>;

  return (

    <div className="flex items-center justify-center ">

      <div className="form text-center">
        <h1 className="text-3xl font-bold text-gray-300 mb-6">
          {!user
            ? t('MainPage.title')
            : `${t('MainPage.titleLogin')} ${user.email ?? ''}`}
        </h1>

        {user && (
          <div className="flex flex-col gap-4">
            <Link className="text-blue-400" href={'/client'}>
              Client
            </Link>
            <Link className="text-blue-400" href={'/history'}>
              History
            </Link>
            <Link className="text-blue-400" href={'/variables'}>
              Variables
            </Link>
          </div>
        )}

        {!user && (
          <div className="flex flex-col gap-4 w-full">
            <p className="text-gray-600 mb-8">{t('MainPage.subtitle')}</p>
            <Link href="/auth/signin" className="btn-action">
              {t('Auth.login.submit')}
            </Link>
            <Link href="/auth/signup" className="btn-action">
              {t('Auth.register.submit')}
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
