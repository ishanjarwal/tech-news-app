'use client';

import { useTheme } from 'next-themes';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Check, LaptopMinimal, Moon, Sun } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { selectUserState, updateUser } from '@/reducers/userReducer';
import { useEffect } from 'react';
import { AppDispatch } from '@/stores/appstore';

const ThemeToggleButton = () => {
  const { setTheme, theme } = useTheme();
  const { user } = useSelector(selectUserState);
  const dispatch = useDispatch<AppDispatch>();
  useEffect(() => {
    if (user && theme !== user.preferences?.theme) {
      dispatch(updateUser({ theme }));
    }
  }, [theme]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="cursor-pointer rounded-full"
        >
          <Sun className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          onClick={() => setTheme('light')}
          className="cursor-pointer"
        >
          <Sun />
          Light
          {theme === 'light' && (
            <DropdownMenuShortcut>
              <Check />
            </DropdownMenuShortcut>
          )}
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setTheme('dark')}
          className="cursor-pointer"
        >
          <Moon />
          Dark
          {theme === 'dark' && (
            <DropdownMenuShortcut>
              <Check />
            </DropdownMenuShortcut>
          )}
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setTheme('system')}
          className="cursor-pointer"
        >
          <LaptopMinimal />
          System
          {theme === 'system' && (
            <DropdownMenuShortcut>
              <Check />
            </DropdownMenuShortcut>
          )}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ThemeToggleButton;
