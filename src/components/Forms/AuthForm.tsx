'use client';

import { useForm } from 'react-hook-form';
import InputField from '@/components/Inputs/InputsField';
import ButtonAction from '@/components/Buttons/ButtonAction';
import { LoginScheme, RegisterScheme } from '@/Scheme/AuthFormScheme';
import { zodResolver } from '@hookform/resolvers/zod';
import ErrorForm from '@/components/Forms/ErrorForm';
import { useAuthState } from 'react-firebase-hooks/auth';
import {
  auth,
  logInWithEmailAndPassword,
  registerWithEmailAndPassword,
} from '@/firebase';
import { useEffect, useState } from 'react';
import { FirebaseError } from 'firebase/app';
import { z } from 'zod';

type AuthFormProps = {
  form: 'signIn' | 'signUp';
};

export default function AuthForm({ form }: AuthFormProps) {
  const schema = form === 'signIn' ? LoginScheme : RegisterScheme;
  type FormData = z.infer<typeof schema>;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const [user, loading, error] = useAuthState(auth);
  const [authErrors, setAuthErrors] = useState<string | null>(null);

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
      console.log('user:', user);
      // router.push('/client');
    }
  }, [user, loading]);

  return (
    <form onSubmit={handleSubmit(submit)} noValidate>
      <h2>{form === 'signIn' ? 'Welcome back!' : 'Registration'}</h2>

      {error && <div>Error authentication failed: {error.message}</div>}
      {authErrors && <div>Error authentication failed: {authErrors}</div>}

      <InputField
        label="Email"
        id="email"
        autoComplete="email"
        register={register('email')}
      />
      <ErrorForm field="email" rhfErrors={errors.email?.message} />

      <InputField
        label="Password"
        id="password"
        autoComplete={form === 'signIn' ? 'current-password' : 'new-password'}
        register={register('password')}
      />
      <ErrorForm field="password" rhfErrors={errors.password?.message} />

      <ButtonAction
        className=""
        type="submit"
        name={form === 'signIn' ? 'Sign In' : 'Sign Up'}
      />
    </form>
  );
}
