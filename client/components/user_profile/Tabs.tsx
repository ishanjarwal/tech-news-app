'use client';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Grid3X3 } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
const tabs = [
  {
    name: 'Profile',
    href: '/me',
    icon: <Grid3X3 />,
  },
  {
    name: 'Posts',
    href: '/me/posts',
    icon: <Grid3X3 />,
  },
  {
    name: 'Drafts',
    href: '/me/drafts',
    icon: <Grid3X3 />,
  },
  {
    name: 'Followers',
    href: '/me/followers',
    icon: <Grid3X3 />,
  },
  {
    name: 'Following',
    href: '/me/following',
  },
];
export default function TabsUnderlinedDemo() {
  const path = usePathname();
  return (
    <Tabs defaultValue={path}>
      <TabsList className="sm:bg-muted bg-background border-border h-10 w-full justify-start rounded-none border-y sm:h-12 sm:rounded-lg sm:border-y-0">
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
    </Tabs>
  );
}
