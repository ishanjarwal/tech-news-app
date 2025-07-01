export interface User {
  // id: string;
  avatar?: string;
  fullname: string;
  email: string;
  username: string;
  roles: string[];
  login_provider: string | null;
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
