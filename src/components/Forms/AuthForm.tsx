'use client';

import { useForm } from 'react-hook-form';
import InputField from '@/components/Inputs/InputsField';
import ButtonAction from '@/components/Buttons/ButtonAction';
import { AuthFormData, AuthFormScheme } from '@/Scheme/AuthFormScheme';
import { zodResolver } from '@hookform/resolvers/zod';

export default function AuthForm() {
  const { register, handleSubmit } = useForm<AuthFormData>({
    resolver: zodResolver(AuthFormScheme),
  });

  const submit = (data: AuthFormData) => {
    console.log(data);
  };
  return (
    <form onSubmit={handleSubmit(submit)} noValidate>
      <h2>Welcome back! Please sign in</h2>

      <InputField
        label="Email "
        id="email "
        autoComplete="email "
        register={register('email')}
      />
      <InputField
        label="Password"
        id="password"
        autoComplete="password"
        register={register('password')}
      />

      <ButtonAction className={''} type="submit" name={'Submit'} />
    </form>
  );
}
