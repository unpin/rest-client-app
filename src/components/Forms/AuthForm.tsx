'use client';

import { useForm } from 'react-hook-form';
import InputField from '@/components/Inputs/InputsField';
import ButtonAction from '@/components/Buttons/ButtonAction';
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
type AuthFormProps = {
  form: 'signIn' | 'signUp';
};

export default function AuthForm({ form }: AuthFormProps) {
  const schema = form === 'signIn' ? LoginScheme : RegisterScheme;
  type FormData = z.infer<typeof schema>;
  const router = useRouter();
  const t = useTranslations('Auth');
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
        setAuthErrors(err.message);
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

  return (
    <form
      onSubmit={handleSubmit(submit)}
      noValidate
      className="max-w-md mx-auto bg-white shadow-lg rounded-2xl p-8 space-y-6 border border-gray-200"
    >
      <h2 className="text-2xl font-semibold text-gray-800 text-center">
        {form === 'signIn' ? t('login.subtitle') : t('register.subtitle')}
      </h2>

      {error && (
        <div className="text-red-600 text-sm bg-gray-50 p-2 rounded-md border border-gray-200">
          Error authentication failed: {error.message}
        </div>
      )}
      {authErrors && (
        <div className="text-red-600 text-sm bg-gray-50 p-2 rounded-md border border-gray-200">
          Error authentication failed: {authErrors}
        </div>
      )}

      <div className="space-y-2">
        <InputField
          label={t('login.emailLabel')}
          id="email"
          autoComplete="email"
          register={register('email')}
        />
        <ErrorForm field="email" rhfErrors={errors.email?.message} />
      </div>

      <div className="space-y-2">
        <InputField
          label={t('login.passwordLabel')}
          id="password"
          autoComplete={form === 'signIn' ? 'current-password' : 'new-password'}
          register={register('password')}
        />
        <ErrorForm field="password" rhfErrors={errors.password?.message} />
      </div>

      <ButtonAction
        className="w-full bg-gray-800 text-white py-2 px-4 rounded-lg hover:bg-gray-700 transition-colors"
        type="submit"
        name={form === 'signIn' ? t('login.submit') : t('register.submit')}
      />
    </form>
  );
}
