'use client';

import { logo } from '@/constants/constants';
import { cn } from '@/lib/utils';
import { useTheme } from 'next-themes';

const Logo = ({ className }: { className?: string }) => {
  const { theme, systemTheme } = useTheme();

  return (
    <img
      src={
        theme === 'dark' || (theme === 'system' && systemTheme === 'dark')
          ? logo.src_dark
          : logo.src_light
      }
      className={cn(className)}
      alt={logo.alt}
    />
  );
};

export default Logo;
