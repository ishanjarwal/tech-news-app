'use client';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { auth, logo } from '@/constants/constants';
import { Menu } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import SearchBar from '../searchbar/SearchBar';
import ThemeToggleButton from '../theme_toggle/ThemeToggleButton';
import UserProfile from './UserProfile';
import { useTheme } from 'next-themes';
import Logo from '../Logo';

const Navbar = () => {
  const { theme } = useTheme();
  const [mobileNav, setMobileNav] = useState<boolean>(false);

  return (
    <section className="py-2 md:py-4">
      <div className="px-2 sm:px-4">
        <nav className="flex justify-between">
          <div className="flex items-center gap-6">
            {/* Logo */}
            <Link href={logo.url} className="flex items-center gap-2">
              <Logo className="max-h-8" />
              <span className="hidden text-lg font-semibold tracking-tighter lg:inline">
                {logo.title}
              </span>
            </Link>
          </div>
          <div className="flex flex-1 items-center px-4">
            <SearchBar />
          </div>
          <div className="me-2 flex items-center justify-center">
            <ThemeToggleButton />
          </div>
          <UserProfile />
          {/* <div className="hidden items-center gap-2 md:flex">
            <Button asChild variant="outline" size="sm">
              <Link href={auth.login.href}>{auth.login.title}</Link>
            </Button>
            <Button asChild size="sm">
              <Link href={auth.signup.href}>{auth.signup.title}</Link>
            </Button>
          </div> */}
          <div className="md:hidden">
            <Button
              onClick={() => setMobileNav(true)}
              variant={'secondary'}
              size={'icon'}
              className="cursor-pointer active:brightness-90"
            >
              <Menu />
            </Button>
          </div>
        </nav>
      </div>

      {/* mobile nav */}
      <div className="md:hidden">
        <MobileNavbar
          theme={theme}
          open={mobileNav}
          setOpen={() => setMobileNav((prev) => !prev)}
        />
      </div>
    </section>
  );
};

interface MobilenavProps {
  theme: string | undefined;
  open: boolean;
  setOpen: () => void;
}

const MobileNavbar = ({ open, setOpen, theme }: MobilenavProps) => {
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      {/* <SheetTrigger>Open</SheetTrigger> */}
      <SheetContent side="left" className="overflow-auto">
        <SheetHeader>
          <SheetTitle>
            <Link href={logo.url} className="flex items-center gap-2">
              <Logo className="max-h-8" />
              <span className="text-lg font-semibold tracking-tighter">
                {logo.title}
              </span>
            </Link>
          </SheetTitle>
          <SheetDescription className="text-balance">
            A community driven platform to share knowledge and grow together.
          </SheetDescription>
        </SheetHeader>
        <div>
          <div className="flex w-full space-x-2 px-4">
            <Button asChild variant="outline" size="sm" className="flex-1">
              <Link href={auth.login.href}>{auth.login.title}</Link>
            </Button>
            <Button asChild size="sm" className="flex-1">
              <Link href={auth.signup.href}>{auth.signup.title}</Link>
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default Navbar;
