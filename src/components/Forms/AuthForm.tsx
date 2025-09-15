'use client';

import { useForm } from 'react-hook-form';
import InputField from '@/components/Inputs/InputsField';
import { LoginScheme, RegisterScheme } from '@/Scheme/AuthFormScheme';
import { zodResolver } from '@hookform/resolvers/zod';
import ErrorForm from '@/components/Forms/ErrorForm';
import {
  logInWithEmailAndPassword,
  registerWithEmailAndPassword,
} from '@/firebase';
import { useEffect, useState } from 'react';
import { FirebaseError } from 'firebase/app';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/providers/AuthProvider/AuthContext';
import { useTranslations } from 'next-intl';
import AuthButton from '@/components/Buttons/AuthButton';
import Link from 'next/link';
type AuthFormProps = {
  form: 'signIn' | 'signUp';
};

export default function AuthForm({ form }: AuthFormProps) {
  const t = useTranslations('Auth');
  const schema = form === 'signIn' ? LoginScheme(t) : RegisterScheme(t);
  type FormData = z.infer<typeof schema>;
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });
  const [authErrors, setAuthErrors] = useState<string | null>(null);
  const { user, loading, error } = useAuth();
  const submit = async (data: FormData) => {
    try {
      if (form === 'signIn') {
        await logInWithEmailAndPassword(data.email, data.password);
      } else {
        await registerWithEmailAndPassword(data.email, data.password);
      }
      setAuthErrors(null);
    } catch (err) {
      if (err instanceof FirebaseError) {
        setAuthErrors(err.code);
      } else {
        setAuthErrors('Something went wrong');
      }
    }
  };

  useEffect(() => {
    if (!loading && user) {
      router.push('/');
    }
  }, [user, loading]);

  if (loading) {
    return <div>Loading...</div>;
  }
  console.log('error', error, 'authErrors', authErrors);

  return (
    <form onSubmit={handleSubmit(submit)} noValidate className="form">
      <h2 className="text-2xl font-semibold text-gray-800 text-center">
        {form === 'signIn' ? t('login.subtitle') : t('register.subtitle')}
      </h2>

      {error && (
        <div className="error-auth">
          {t('errors.authFailed')}: {error.message}
        </div>
      )}
      {authErrors && (
        <div className="error-auth">{t(`errors.${authErrors.slice(5)}`)}</div>
      )}

      <div className="space-y-2">
        <InputField
          label={t('login.emailLabel')}
          id="email"
          autoComplete="email"
          register={register('email')}
        />
        <ErrorForm message={errors.email?.message} />
      </div>

      <div className="space-y-2">
        <InputField
          label={t('login.passwordLabel')}
          id="password"
          autoComplete={form === 'signIn' ? 'current-password' : 'new-password'}
          register={register('password')}
        />
        <ErrorForm message={errors.password?.message} />
      </div>

      <AuthButton form={form} />
      <div className="text-center text-sm text-gray-600">
        {form === 'signUp' ? (
          <>
            {t('register.hasAccount')}{' '}
            <Link
              href="/auth/signin"
              className="text-blue-600 hover:underline font-medium"
            >
              {t('register.goToLogin')}
            </Link>
          </>
        ) : (
          <>
            {t('login.noAccount')}{' '}
            <Link
              href="/auth/signup"
              className="text-blue-600 hover:underline font-medium"
            >
              {t('login.goToRegister')}
            </Link>
          </>
        )}
      </div>
    </form>
  );
}
