import { z } from 'zod';

export const UserSignUpSchema = z.object({
  username: z
    .string()
    .nonempty({ message: 'Username is required' })
    .max(50, { message: 'Max length is 50 characters' })
    .regex(/^[a-zA-Z0-9_]+$/, {
      message: 'Username must be alphanumeric and can contain underscores only',
    }),

  fullname: z
    .string()
    .nonempty({ message: 'Full name is required' })
    .max(100, { message: 'Full name must be at most 100 characters' })
    .regex(/^[\p{L}]+(?:\s[\p{L}]+){0,2}$/u, {
      message:
        'Full name must contain only letters and at most two words (separated by spaces)',
    }),

  email: z
    .string()
    .nonempty({ message: 'Email is required' })
    .max(100, { message: 'Email must be at most 100 characters' })
    .email({ message: 'Invalid email format' }),

  password: z
    .string()
    .nonempty({ message: 'Please enter your password' })
    .min(8, { message: 'Password must be at least 8 characters long' })
    .max(50, { message: 'Password must be at most 50 characters long' })
    .regex(/^[A-Za-z0-9!@#$%^&*()_\-+=\[\]{};:'",.<>?/\\|]+$/, {
      message: 'Password must not contain spaces',
    }),
});

export type UserSignUpValues = z.infer<typeof UserSignUpSchema>;

export const UserLoginSchema = z.object({
  email_username: z
    .string()
    .nonempty({ message: 'Required' })
    .max(100, { message: 'Email must be at most 100 characters' }),
  password: z
    .string()
    .nonempty({ message: 'Required' })
    .min(8, { message: 'Password must be at least 8 characters long' })
    .max(50, { message: 'Password must be at most 50 characters long' })
    .regex(/^[A-Za-z0-9!@#$%^&*()_\-+=\[\]{};:'",.<>?/\\|]+$/, {
      message: 'Password must not contain spaces',
    }),
});

export type UserLoginValues = z.infer<typeof UserLoginSchema>;

export const EmailSchema = z.object({
  email: z
    .string()
    .nonempty({ message: 'Email is required' })
    .max(100, { message: 'Email must be at most 100 characters' })
    .email({ message: 'Invalid email format' }),
});

export type EmailValues = z.infer<typeof EmailSchema>;

export const PasswordResetSchema = z
  .object({
    password: z
      .string()
      .nonempty({ message: 'Please enter your password' })
      .min(8, { message: 'Password must be at least 8 characters long' })
      .max(50, { message: 'Password must be at most 50 characters long' })
      .regex(/^[A-Za-z0-9!@#$%^&*()_\-+=\[\]{};:'",.<>?/\\|]+$/, {
        message: 'Password must not contain spaces',
      }),

    password_confirmation: z
      .string()
      .nonempty({ message: 'Please confirm your password' }),
  })
  .refine((data) => data.password === data.password_confirmation, {
    path: ['password_confirmation'],
    message: 'Passwords do not match',
  });

export type PasswordResetValues = z.infer<typeof PasswordResetSchema>;

export const VerifySchema = z.object({
  email: z
    .string()
    .trim()
    .nonempty('Please provide your email address')
    .email('Invalid email format')
    .transform((val) => val.toLowerCase()), // normalize email

  otp: z
    .string()
    .length(4, { message: 'Please enter your OTP.' })
    .regex(/^\d{4}$/, { message: 'OTP must contain only digits.' }),
});

export type VerifyValues = z.infer<typeof VerifySchema>;
