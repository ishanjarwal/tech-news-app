import { clsx, type ClassValue } from 'clsx';
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import { ReadonlyURLSearchParams } from 'next/navigation';
import { twMerge } from 'tailwind-merge';
import { ReduxErrorPayload } from '@/types/types';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import numeral from 'numeral';
import _ from 'lodash';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const setSearchParam = (
  key: string,
  value: string,
  pathname: string,
  searchParams: ReadonlyURLSearchParams,
  router: AppRouterInstance
) => {
  const params = new URLSearchParams(searchParams.toString());
  params.set(key, value);
  router.replace(`${pathname}?${params.toString()}`);
};

export const reduxThunkErrorPaylod = (error: any): ReduxErrorPayload => {
  let paylod: ReduxErrorPayload;
  if (axios.isAxiosError(error)) {
    paylod = {
      status: error.response?.data.status || 'error',
      message: error.response?.data.message || 'Something went wrong',
      error: error.response?.data?.error,
    };
  } else {
    paylod = {
      status: 'error',
      message: 'Something went wrong',
    };
  }
  return paylod;
};

export const decodeJWT = (token: string) => {
  return jwtDecode<any>(token);
};

export const formatNumberShort = (n: number): string => {
  return numeral(n).format('0.[0]a').toUpperCase();
};

export function getChangedProps<T extends Record<string, any>>(
  obj1: T,
  obj2: T
): Partial<T> {
  const changedProps: Partial<T> = {};

  for (const key in obj2) {
    if (Object.prototype.hasOwnProperty.call(obj2, key)) {
      const val1 = obj1[key];
      const val2 = obj2[key];

      // Use _.isEqual for deep comparison of all types (objects, arrays, primitives)
      if (!_.isEqual(val1, val2)) {
        changedProps[key] = val2;
      }
    }
  }

  return changedProps;
}
