import { PREFERENCES_THEMES } from '@/validations/profile';

export interface User {
  // id: string;
  fullname: string;
  username: string;
  email: string;

  bio?: string;
  avatar?: string;
  cover_image?: string;
  socialLinks?: {
    github?: string;
    linkedin?: string;
    instagram?: string;
    x?: string;
    threads?: string;
    websites?: string[];
    youtube?: string;
    facebook?: string;
  };

  preferences?: {
    theme: (typeof PREFERENCES_THEMES)[number];
    newsletter: boolean;
    language: string;
  };

  roles: ('user' | 'admin' | 'author')[number];

  created_at: Date;
  updated_at: Date;

  login_provider: 'email' | 'google';
}

export type InfoTypeValues =
  | 'warning'
  | 'error'
  | 'success'
  | 'validation_error';

export interface ReduxErrorPayload {
  status: InfoTypeValues;
  message: string;
  error?: any;
}

export interface ReduxSuccessPayload {
  status: InfoTypeValues;
  message: string;
  data?: any;
}

export type UserRoleValues = 'admin' | 'author' | 'user';
