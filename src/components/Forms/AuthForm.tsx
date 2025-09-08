'use client';

import { useForm } from 'react-hook-form';
import InputField from '@/components/Inputs/InputsField';
import ButtonAction from '@/components/Buttons/ButtonAction';
import { LoginScheme } from '@/Scheme/AuthFormScheme';
import { zodResolver } from '@hookform/resolvers/zod';
import ErrorForm from '@/components/Forms/ErrorForm';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, logInWithEmailAndPassword } from '@/firebase';
import { useEffect, useState } from 'react';
import { FirebaseError } from 'firebase/app';
// import { useRouter } from 'next/navigation';

export default function AuthForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginScheme>({
    resolver: zodResolver(LoginScheme),
  });
  const [user, loading, error] = useAuthState(auth);
  const [authErrors, setAuthErrors] = useState<string | null>(null);
  // const router = useRouter();
  const submit = async (data: LoginScheme) => {
    try {
      await logInWithEmailAndPassword(data.email, data.password);
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
    if (loading) {
      return;
    }
    if (user && !loading) {
      console.log('user:', user);
      // router.push('/client');
    }
  }, [user, loading]);

  return (
    <form onSubmit={handleSubmit(submit)} noValidate>
      <h2>Welcome back! Please sign in</h2>

      {error && <div>Error authentication failed: {error.message}</div>}
      {authErrors && <div>Error authentication failed: {authErrors}</div>}

      <InputField
        label="Email "
        id="email "
        autoComplete="email"
        register={register('email')}
      />
      <ErrorForm field={'email'} rhfErrors={errors.email?.message} />

      <InputField
        label="Password"
        id="password"
        autoComplete="password"
        register={register('password')}
      />

      <ErrorForm field={'password'} rhfErrors={errors.password?.message} />

      <ButtonAction className={''} type="submit" name={'Submit'} />
    </form>
  );
}
