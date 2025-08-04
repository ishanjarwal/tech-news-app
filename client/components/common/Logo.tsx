'use client';

import { logo } from '@/constants/constants';
import { useWindowSize } from '@/hooks/use-window-size';
import { cn } from '@/lib/utils';
import { useTheme } from 'next-themes';

const Logo = ({
  className,
  mobileWidth = 1280,
}: {
  className?: string;
  mobileWidth?: number;
}) => {
  const { theme, systemTheme } = useTheme();
  const { width } = useWindowSize();

  const resolvedTheme = theme === 'system' ? systemTheme : theme;

  if (typeof width === 'undefined' || !resolvedTheme) return null;

  const isMobile = width <= mobileWidth;
  const src = isMobile
    ? resolvedTheme === 'dark'
      ? logo.src_dark
      : logo.src_light
    : resolvedTheme === 'dark'
      ? logo.namelogo_src_dark
      : logo.namelogo_src_light;

  return <img src={src} className={cn('h-8', className)} alt={logo.alt} />;
};

export default Logo;
