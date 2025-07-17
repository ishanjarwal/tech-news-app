'use client';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import BasicDetailsForm from './forms/BasicDetailsForm';
import PreferencesForm from './forms/PreferencesForm';
import SocialLinksForm from './forms/SocialLinksForm';
import { useEffect, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { setSearchParam } from '@/lib/utils';

const tabsList = [
  {
    title: 'Basic Details',
    value: 'basic-details',
    render: <BasicDetailsForm />,
  },
  {
    title: 'Social Links',
    value: 'social-links',
    render: <SocialLinksForm />,
  },
  {
    title: 'Account Preferences',
    value: 'account-preferences',
    render: <PreferencesForm />,
  },
];

const validTabValues = [
  'basic-details',
  'social-links',
  'account-preferences',
] as const;
type TabValue = (typeof validTabValues)[number];
const ProfileForm = () => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const tab = searchParams.get('tab');
  const [active, setActive] = useState<TabValue>('basic-details');

  useEffect(() => {
    if (tab && (validTabValues as readonly string[]).includes(tab)) {
      setActive(tab as TabValue);
    }
  }, [tab]);

  return (
    <div className="flex w-full flex-col gap-6 sm:max-w-sm">
      <Tabs defaultValue="basic-details" value={active}>
        <TabsList className="text-muted-foreground inline-flex h-9 w-full items-center justify-start rounded-none border-b bg-transparent p-0">
          {tabsList.map((el) => (
            <TabsTrigger
              className="data-[state=active]:!border-foreground cursor-pointer rounded-none !border-0 !shadow-none ring-0 data-[state=active]:!border-b-2 data-[state=active]:!bg-transparent"
              value={el.value}
              onClick={() => {
                setSearchParam('tab', el.value, pathname, searchParams, router);
              }}
            >
              {el.title}
            </TabsTrigger>
          ))}
        </TabsList>
        {tabsList.map((el) => (
          <TabsContent value={el.value}>{el.render}</TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default ProfileForm;
