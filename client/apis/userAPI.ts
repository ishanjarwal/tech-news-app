import { env } from '@/config/env';
import {
  EmailValues,
  UserLoginValues,
  UserSignUpValues,
  VerifyValues,
} from '@/validations/auth';
import axios from 'axios';

export async function registerUserAPI(data: UserSignUpValues) {
  return new Promise(async (resolve, reject) => {
    try {
      const url = `${env.NEXT_PUBLIC_BASE_URL}/user`;
      const { fullname, email, password, username } = data;
      const response = await axios.post(url, {
        fullname,
        username,
        email,
        password,
      });
      resolve(response.data);
    } catch (err) {
      reject(err);
    }
  });
}

export async function verifyUserAPI(data: VerifyValues) {
  return new Promise(async (resolve, reject) => {
    try {
      const url = `${env.NEXT_PUBLIC_BASE_URL}/user/verify-account`;
      const { email, otp } = data;
      const response = await axios.post(
        url,
        { email, otp },
        { withCredentials: true }
      );
      resolve(response.data);
    } catch (err) {
      reject(err);
    }
  });
}

export async function resendOTPAPI(data: EmailValues) {
  return new Promise(async (resolve, reject) => {
    try {
      const url = `${env.NEXT_PUBLIC_BASE_URL}/user/resend-otp`;
      const { email } = data;
      const response = await axios.post(url, { email });
      resolve(response.data);
    } catch (err) {
      reject(err);
    }
  });
}

export async function loginUserAPI(data: UserLoginValues) {
  return new Promise(async (resolve, reject) => {
    try {
      const url = `${env.NEXT_PUBLIC_BASE_URL}/user/login`;
      const { email_username, password } = data;
      const response = await axios.post(
        url,
        { email_username, password },
        { withCredentials: true }
      );
      resolve(response.data);
    } catch (err) {
      reject(err);
    }
  });
}

export async function userProfileAPI() {
  return new Promise(async (resolve, reject) => {
    try {
      const url = `${env.NEXT_PUBLIC_BASE_URL}/user/me`;
      const response = await axios.get(url, { withCredentials: true });
      resolve(response.data);
    } catch (err) {
      reject(err);
    }
  });
}

export async function logoutUserAPI() {
  return new Promise(async (resolve, reject) => {
    try {
      const url = `${env.NEXT_PUBLIC_BASE_URL}/user/logout`;
      const response = await axios.get(url, { withCredentials: true });
      resolve(response.data);
    } catch (err) {
      reject(err);
    }
  });
}

export async function updateUserAPI(data: { name: string; bio: string }) {
  return new Promise(async (resolve, reject) => {
    try {
      const url = `${env.NEXT_PUBLIC_BASE_URL}/user/`;
      const { name, bio } = data;
      const response = await axios.put(
        url,
        { name, bio },
        { withCredentials: true }
      );
      resolve(response.data);
    } catch (err) {
      reject(err);
    }
  });
}

export async function changePasswordAPI(data: {
  old_password: string;
  password: string;
  password_confirmation: string;
}) {
  return new Promise(async (resolve, reject) => {
    try {
      const url = `${env.NEXT_PUBLIC_BASE_URL}/user/change-password`;
      const { password, password_confirmation, old_password } = data;
      const response = await axios.post(
        url,
        { old_password, password, password_confirmation },
        { withCredentials: true }
      );
      resolve(response.data);
    } catch (err) {
      reject(err);
    }
  });
}

export async function resetPasswordAPI(data: {
  token: string;
  password: string;
  password_confirmation: string;
}) {
  return new Promise(async (resolve, reject) => {
    try {
      const { token, password, password_confirmation } = data;
      const url = `${env.NEXT_PUBLIC_BASE_URL}/user/reset-password/${token}`;
      const response = await axios.post(
        url,
        { password, password_confirmation },
        { withCredentials: true }
      );
      resolve(response.data);
    } catch (err) {
      reject(err);
    }
  });
}

export async function resetPasswordLinkAPI(data: { email: string }) {
  return new Promise(async (resolve, reject) => {
    try {
      const { email } = data;
      const url = `${env.NEXT_PUBLIC_BASE_URL}/user/forgot-password`;
      const response = await axios.post(
        url,
        { email },
        { withCredentials: true }
      );
      resolve(response.data);
    } catch (err) {
      reject(err);
    }
  });
}
