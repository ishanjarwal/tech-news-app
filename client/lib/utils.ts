import { clsx, type ClassValue } from 'clsx';
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import { ReadonlyURLSearchParams } from 'next/navigation';
import { twMerge } from 'tailwind-merge';
import { ReduxErrorPayload } from '@/types/types';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import numeral from 'numeral';
import _ from 'lodash';
import { formatDuration } from 'date-fns/formatDuration';
import { intervalToDuration } from 'date-fns/intervalToDuration';

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

export function formatReadingTime(seconds: number): string {
  if (seconds <= 0 || isNaN(seconds)) return 'Less than a minute read';

  const duration = intervalToDuration({ start: 0, end: seconds * 1000 });

  const { hours = 0, minutes = 0 } = duration;

  if (hours >= 2) return '2+ hours read';
  if (hours === 1) return '1 hour read';
  if (minutes >= 1) return `${minutes} minute${minutes > 1 ? 's' : ''} read`;

  return 'Less than a minute read';
}
