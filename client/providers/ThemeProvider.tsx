'use client';

import * as React from 'react';
import { ThemeProvider as NextThemesProvider, useTheme } from 'next-themes';
import { useSelector } from 'react-redux';
import { selectUserState } from '@/reducers/userReducer';

const ThemeProvider = ({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>) => {
  return (
    <NextThemesProvider {...props}>
      <UserThemeManager>{children}</UserThemeManager>
    </NextThemesProvider>
  );
};

const UserThemeManager = ({ children }: { children: React.ReactNode }) => {
  const { setTheme } = useTheme();
  const { user } = useSelector(selectUserState);

  React.useEffect(() => {
    if (user?.preferences?.theme) {
      setTheme(user.preferences.theme);
    }
  }, [user]);

  return <>{children}</>;
};

export default ThemeProvider;
