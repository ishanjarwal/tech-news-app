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
  return (
    <>
      {width > mobileWidth ? (
        <img
          src={
            theme === 'dark' || (theme === 'system' && systemTheme === 'dark')
              ? logo.namelogo_src_dark
              : logo.namelogo_src_light
          }
          className={cn('h-8', className)}
          alt={logo.alt}
        />
      ) : (
        <img
          src={
            theme === 'dark' || (theme === 'system' && systemTheme === 'dark')
              ? logo.src_dark
              : logo.src_light
          }
          className={cn('h-8', className)}
          alt={logo.alt}
        />
      )}
    </>
  );
};

export default Logo;
