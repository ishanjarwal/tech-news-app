'use client';
import { Tabs as ShadTabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import { selectUserState } from '@/reducers/userReducer';
import { UserRoleValues } from '@/types/types';
import { Grid3X3 } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSelector } from 'react-redux';
const allTabs = [
  {
    name: 'Profile',
    href: '/me',
    icon: <Grid3X3 />,
    roles: ['author', 'user'],
  },
  {
    name: 'Posts',
    href: '/me/posts',
    icon: <Grid3X3 />,
    roles: ['author'],
  },
  {
    name: 'Drafts',
    href: '/me/drafts',
    icon: <Grid3X3 />,
    roles: ['author'],
  },
  {
    name: 'Followers',
    href: '/me/followers',
    icon: <Grid3X3 />,
    roles: ['author'],
  },
  {
    name: 'Following',
    href: '/me/following',
    roles: ['author', 'user'],
  },
];

export default function Tabs() {
  const path = usePathname();

  const { user } = useSelector(selectUserState);
  const roles = user?.roles || [];
  const tabs = allTabs.filter((tab) =>
    roles.some((role) => tab.roles.includes(role as UserRoleValues))
  );

  return (
    <ShadTabs defaultValue={path}>
      <TabsList
        className={cn(
          'sm:bg-muted bg-background border-border h-10 justify-start rounded-none border-y sm:h-12 sm:rounded-lg sm:border-y-0',
          roles.includes('author') ? 'w-full' : 'w-full sm:w-max'
        )}
      >
        {tabs.map((tab) => (
          <TabsTrigger
            key={tab.href}
            value={tab.href}
            asChild
            className="data-[state=active]:!bg-foreground/10 px-2 text-sm data-[state=active]:border-0 data-[state=active]:ring-0 sm:px-6 sm:text-base sm:font-semibold"
          >
            <Link href={tab.href}>{tab.name}</Link>
          </TabsTrigger>
        ))}
      </TabsList>
    </ShadTabs>
  );
}
