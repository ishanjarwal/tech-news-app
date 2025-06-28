import { clsx, type ClassValue } from 'clsx';
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import { ReadonlyURLSearchParams } from 'next/navigation';
import { twMerge } from 'tailwind-merge';

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
