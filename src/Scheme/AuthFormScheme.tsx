import { z } from 'zod';
const passwordCheck = /^(?=.*\p{L})(?=.*\d)(?=.*[^A-Za-z0-9]).+$/u;

const LoginScheme = (t: (key: string) => string) => {
  return z.object({
    email: z.email({ message: t('errors.email') }),
    password: z.string().min(1, { message: t('errors.passwordComplexity') }),
  });
};
const RegisterScheme = (t: (key: string) => string) => {
  return z.object({
    email: z.email({ message: t('errors.email') }),
    password: z
      .string()
      .min(8, { message: t('errors.passwordMin') })
      .max(20, { message: t('errors.passwordMax') })
      .refine((val) => passwordCheck.test(val), {
        message: t('errors.passwordComplexity'),
      }),
  });
};

export { LoginScheme, RegisterScheme };
