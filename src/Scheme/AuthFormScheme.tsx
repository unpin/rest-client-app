import { z } from 'zod';

export const LoginScheme = z.object({
  email: z.email('Please enter a valid email address'),
  password: z.string().min(1, { message: 'Password is require' }),
});

export type LoginScheme = z.infer<typeof RegisterScheme>;

const passwordCheck = /^(?=.*\p{L})(?=.*\d)(?=.*[^A-Za-z0-9]).+$/u;
export const RegisterScheme = z.object({
  email: z.email('Please enter a valid email address'),
  password: z
    .string()
    .min(8, { message: 'Please enter password' })
    .max(20)
    .refine((val) => passwordCheck.test(val), {
      message:
        'Password must include uppercase, lowercase, number, and special character',
    }),
});

export type RegisterScheme = z.infer<typeof RegisterScheme>;
