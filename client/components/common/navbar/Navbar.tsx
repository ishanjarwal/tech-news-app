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
import { ArrowBigDown, ArrowRight, Menu } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import SearchBar from '../searchbar/SearchBar';
import ThemeToggleButton from '../theme_toggle/ThemeToggleButton';
import UserProfile from './UserProfile';
import { useTheme } from 'next-themes';
import Logo from '../Logo';
import { useSelector } from 'react-redux';
import { selectUserState } from '@/reducers/userReducer';
import LogoutButton from '@/components/auth/logout/LogoutButton';

const navLinks = [
  {
    text: 'Archive',
    href: '/archive',
  },
  {
    text: 'Most viewed',
    href: '/most-viewed',
  },
  {
    text: 'Most liked',
    href: '/most-liked',
  },
  {
    text: 'Popular topics',
    href: '/topics',
  },
  {
    text: 'Categories',
    href: '/categories',
  },
];

const Navbar = () => {
  const { user } = useSelector(selectUserState);

  const { theme } = useTheme();
  const [mobileNav, setMobileNav] = useState<boolean>(false);

  return (
    <section className="py-2 md:py-4">
      <div className="px-2 sm:px-0">
        <nav className="flex justify-between">
          <div className="flex items-center gap-6">
            {/* Logo */}
            <Link href={logo.url} className="flex items-center gap-2">
              <Logo />
              {/* <span className="hidden text-lg font-bold tracking-tighter lg:inline">
                {logo.title}
              </span> */}
            </Link>
          </div>
          <div className="flex flex-1 items-center px-2 sm:px-4">
            <SearchBar />
          </div>
          <div className="flex items-center justify-end space-x-1 md:space-x-2">
            <div className="hidden items-center lg:flex">
              {navLinks.map((link, index) => (
                <Button
                  key={'navlink-' + index}
                  asChild
                  variant={'link'}
                  className="px-2 text-xs xl:px-3 xl:text-sm"
                >
                  <Link href={link.href}>{link.text}</Link>
                </Button>
              ))}
            </div>

            <div className="hidden items-center justify-center lg:flex">
              <ThemeToggleButton />
            </div>

            {user ? (
              <div className="flex items-center justify-center md:me-0">
                <UserProfile />
              </div>
            ) : (
              <>
                <div className="hidden items-center gap-2 lg:flex">
                  <Button asChild variant="outline" size="sm">
                    <Link href={auth.login.href}>{auth.login.title}</Link>
                  </Button>
                  <Button asChild size="sm">
                    <Link href={auth.signup.href}>{auth.signup.title}</Link>
                  </Button>
                </div>
                <div className="lg:hidden">
                  <Button asChild size="sm">
                    <Link href={auth.login.href}>Join</Link>
                  </Button>
                </div>
              </>
            )}
            <div className="lg:hidden">
              <Button
                onClick={() => setMobileNav(true)}
                variant={'ghost'}
                size={'icon'}
                className="cursor-pointer active:brightness-90"
              >
                <Menu className="size-6" />
              </Button>
            </div>
          </div>
        </nav>
      </div>

      {/* mobile nav */}
      <div className="lg:hidden">
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
  setOpen: (value: boolean) => void;
}

const MobileNavbar = ({ open, setOpen, theme }: MobilenavProps) => {
  const { user } = useSelector(selectUserState);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      {/* <SheetTrigger>Open</SheetTrigger> */}
      <SheetContent side="right" className="overflow-auto">
        <SheetHeader>
          <SheetTitle>
            <Link href={logo.url} className="flex items-center gap-2">
              <Logo className="max-h-8" mobileWidth={0} />
              {/* <span className="text-lg font-semibold tracking-tighter">
                {logo.title}
              </span> */}
            </Link>
          </SheetTitle>
          <SheetDescription className="text-balance">
            A community driven platform to share knowledge and grow together.
          </SheetDescription>
        </SheetHeader>
        <div>
          <div className="mb-8 flex flex-col">
            {navLinks.map((link, index) => (
              <Button
                onClick={() => setOpen(false)}
                key={'navlink-' + index}
                className="justify-start text-base"
                asChild
                variant={'link'}
              >
                <Link
                  className="group flex items-center space-x-0.5"
                  href={link.href}
                >
                  <span className="text-muted-foreground group-hover:text-foreground relative duration-150 group-hover:translate-x-1">
                    <ArrowRight />
                  </span>
                  <span>{link.text}</span>
                </Link>
              </Button>
            ))}
            <div className="mt-8 flex items-center justify-start space-x-2 px-4">
              <p className="text-muted-foreground text-base">Dark Mode</p>
              <ThemeToggleButton />
            </div>
          </div>
          {user ? (
            <div className="px-4">
              <LogoutButton
                onClick={() => {
                  setOpen(false);
                }}
                className="bg-background cursor-pointer rounded-md border px-3 py-2 text-center hover:brightness-90"
              />
            </div>
          ) : (
            <div className="flex w-full flex-col space-y-2 px-4">
              <Button
                onClick={() => setOpen(false)}
                asChild
                variant="outline"
                className="flex-1"
              >
                <Link href={auth.login.href}>{auth.login.title}</Link>
              </Button>
              <Button onClick={() => setOpen(false)} asChild className="flex-1">
                <Link href={auth.signup.href}>{auth.signup.title}</Link>
              </Button>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default Navbar;
